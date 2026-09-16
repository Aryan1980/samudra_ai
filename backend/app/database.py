"""SQLite Database Layer for SamudraAI conversations and telemetry with serverless resilience."""
import sqlite3
import json
import os
import tempfile
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

# In-memory fallback message cache if filesystem is strictly read-only
_MEM_CACHE: Dict[str, List[Dict[str, Any]]] = {}

def get_db_path() -> str:
    """Resolve a writable path for SQLite database, supporting serverless (Vercel, AWS Lambda) environments."""
    # Explicit DATA_DIR override
    data_dir = os.environ.get("DATA_DIR")
    if data_dir:
        try:
            os.makedirs(data_dir, exist_ok=True)
            return os.path.join(data_dir, "samudra_ai.db")
        except Exception:
            pass

    # Serverless environments (Vercel, AWS Lambda, etc.) have read-only filesystems except /tmp
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME") or os.environ.get("LAMBDA_TASK_ROOT"):
        return os.path.join(tempfile.gettempdir(), "samudra_ai.db")

    # Try local backend directory
    local_db = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "samudra_ai.db"))
    local_dir = os.path.dirname(local_db)

    # Test writability of directory
    try:
        test_path = os.path.join(local_dir, ".write_test")
        with open(test_path, "w") as f:
            f.write("ok")
        os.remove(test_path)
        return local_db
    except (OSError, IOError, PermissionError):
        # Local dir is read-only, fallback to temp directory
        return os.path.join(tempfile.gettempdir(), "samudra_ai.db")

DB_FILE = get_db_path()

def get_db():
    global DB_FILE
    try:
        conn = sqlite3.connect(DB_FILE, timeout=5.0)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        # Fallback to in-memory if disk file cannot be opened
        try:
            temp_db = os.path.join(tempfile.gettempdir(), "samudra_ai.db")
            conn = sqlite3.connect(temp_db, timeout=5.0)
            conn.row_factory = sqlite3.Row
            DB_FILE = temp_db
            return conn
        except Exception:
            conn = sqlite3.connect(":memory:", timeout=5.0)
            conn.row_factory = sqlite3.Row
            return conn

def init_db():
    try:
        with get_db() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id TEXT PRIMARY KEY,
                    title TEXT,
                    created_at TEXT,
                    language TEXT DEFAULT 'en',
                    last_lat REAL,
                    last_lon REAL
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id TEXT,
                    role TEXT,
                    content TEXT,
                    response_metadata TEXT,
                    created_at TEXT,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS user_bookmarks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    latitude REAL,
                    longitude REAL,
                    notes TEXT,
                    created_at TEXT
                )
            """)
            conn.commit()
    except Exception as e:
        print(f"Notice: SQLite init_db operating with in-memory or degraded state: {e}")

def save_message(conv_id: str, role: str, content: str, meta: Optional[Dict[str, Any]] = None):
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Store in memory cache
    if conv_id not in _MEM_CACHE:
        _MEM_CACHE[conv_id] = []
    _MEM_CACHE[conv_id].append({
        "role": role,
        "content": content,
        "response_metadata": json.dumps(meta or {}),
        "created_at": now_str
    })

    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO messages (conversation_id, role, content, response_metadata, created_at) VALUES (?, ?, ?, ?, ?)",
                (conv_id, role, content, json.dumps(meta or {}), now_str)
            )
            conn.commit()
    except Exception as e:
        # Non-fatal error; memory cache already preserves session
        pass

def get_conversation_history(conv_id: str) -> List[Dict[str, Any]]:
    try:
        with get_db() as conn:
            cursor = conn.execute(
                "SELECT role, content, response_metadata, created_at FROM messages WHERE conversation_id = ? ORDER BY id ASC",
                (conv_id,)
            )
            rows = [dict(row) for row in cursor.fetchall()]
            if rows:
                return rows
    except Exception:
        pass
    
    return _MEM_CACHE.get(conv_id, [])

