"""Geofencing and Polygon spatial algorithms."""
from typing import List, Tuple
from app.geo.calculations import point_to_segment_distance, haversine_distance

def is_point_in_polygon(lat: float, lon: float, polygon: List[List[float]]) -> bool:
    """Determine whether coordinate (lat, lon) is inside a polygon using Ray Casting."""
    if not polygon or len(polygon) < 3:
        return False

    n = len(polygon)
    inside = False
    p1_lat, p1_lon = polygon[0][0], polygon[0][1]

    for i in range(1, n + 1):
        p2_lat, p2_lon = polygon[i % n][0], polygon[i % n][1]
        
        # Ray cast along latitude / longitude
        if lon > min(p1_lon, p2_lon):
            if lon <= max(p1_lon, p2_lon):
                if lat <= max(p1_lat, p2_lat):
                    if p1_lon != p2_lon:
                        lat_inters = (lon - p1_lon) * (p2_lat - p1_lat) / (p2_lon - p1_lon) + p1_lat
                    if p1_lat == p2_lat or lat <= lat_inters:
                        inside = not inside
        p1_lat, p1_lon = p2_lat, p2_lon

    return inside

def distance_to_polygon(lat: float, lon: float, polygon: List[List[float]]) -> float:
    """Return minimum distance (km) from (lat, lon) to polygon boundary. Returns 0.0 if inside."""
    if is_point_in_polygon(lat, lon, polygon):
        return 0.0

    min_dist = float("inf")
    n = len(polygon)
    for i in range(n):
        p1 = polygon[i]
        p2 = polygon[(i + 1) % n]
        dist = point_to_segment_distance(lat, lon, p1[0], p1[1], p2[0], p2[1])
        if dist < min_dist:
            min_dist = dist

    return round(min_dist, 2)

def _ccw(ax: float, ay: float, bx: float, by: float, cx: float, cy: float) -> bool:
    return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax)

def segments_intersect(
    p1: Tuple[float, float], p2: Tuple[float, float],
    q1: Tuple[float, float], q2: Tuple[float, float]
) -> bool:
    """Check if line segment p1-p2 intersects line segment q1-q2."""
    # Coordinates are (lat, lon) -> treat as (y, x)
    p1_y, p1_x = p1
    p2_y, p2_x = p2
    q1_y, q1_x = q1
    q2_y, q2_x = q2

    return (
        _ccw(p1_x, p1_y, q1_x, q1_y, q2_x, q2_y) != _ccw(p2_x, p2_y, q1_x, q1_y, q2_x, q2_y) and
        _ccw(p1_x, p1_y, p2_x, p2_y, q1_x, q1_y) != _ccw(p1_x, p1_y, p2_x, p2_y, q2_x, q2_y)
    )

def line_intersects_polygon(
    start: Tuple[float, float], end: Tuple[float, float], polygon: List[List[float]]
) -> bool:
    """Check if segment start-end crosses polygon boundaries or either endpoint is inside."""
    if is_point_in_polygon(start[0], start[1], polygon) or is_point_in_polygon(end[0], end[1], polygon):
        return True

    n = len(polygon)
    for i in range(n):
        p1 = (polygon[i][0], polygon[i][1])
        p2 = (polygon[(i + 1) % n][0], polygon[(i + 1) % n][1])
        if segments_intersect(start, end, p1, p2):
            return True

    return False
