"""SQLite Database Layer for SamudraAI conversations and telemetry."""
import sqlite3
import json
import os
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "samudra_ai.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
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

def save_message(conv_id: str, role: str, content: str, meta: Optional[Dict[str, Any]] = None):
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with get_db() as conn:
        conn.execute(
            "INSERT INTO messages (conversation_id, role, content, response_metadata, created_at) VALUES (?, ?, ?, ?, ?)",
            (conv_id, role, content, json.dumps(meta or {}), now_str)
        )
        conn.commit()

def get_conversation_history(conv_id: str) -> List[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.execute(
            "SELECT role, content, response_metadata, created_at FROM messages WHERE conversation_id = ? ORDER BY id ASC",
            (conv_id,)
        )
        return [dict(row) for row in cursor.fetchall()]
