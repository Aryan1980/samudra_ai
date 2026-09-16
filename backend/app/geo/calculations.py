"""Pure Python Geospatial calculations for marine navigation."""
import math
from typing import Tuple

EARTH_RADIUS_KM = 6371.0088

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth (in km)."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(EARTH_RADIUS_KM * c, 2)

def calculate_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> Tuple[float, str]:
    """Calculate initial forward bearing from point 1 to point 2 in degrees and compass 16-point."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)

    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    theta = math.atan2(y, x)
    bearing = (math.degrees(theta) + 360.0) % 360.0

    compass_points = [
        "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ]
    index = round(bearing / 22.5) % 16
    return round(bearing, 1), compass_points[index]

def destination_point(lat: float, lon: float, distance_km: float, bearing_deg: float) -> Tuple[float, float]:
    """Calculate destination coordinates given starting point, distance (km), and bearing (deg)."""
    delta = distance_km / EARTH_RADIUS_KM
    theta = math.radians(bearing_deg)
    phi1 = math.radians(lat)
    lambda1 = math.radians(lon)

    phi2 = math.asin(
        math.sin(phi1) * math.cos(delta) +
        math.cos(phi1) * math.sin(delta) * math.cos(theta)
    )
    lambda2 = lambda1 + math.atan2(
        math.sin(theta) * math.sin(delta) * math.cos(phi1),
        math.cos(delta) - math.sin(phi1) * math.sin(phi2)
    )
    return round(math.degrees(phi2), 5), round(math.degrees(lambda2), 5)

def point_to_segment_distance(plat: float, plon: float, alat: float, alon: float, blat: float, blon: float) -> float:
    """Calculate minimum distance from point P to line segment AB in kilometers."""
    # Projected local Cartesian approximation suitable for marine geofence radii < 100km
    phi = math.radians((alat + blat) / 2.0)
    cos_phi = math.cos(phi)

    def to_xy(lat, lon):
        return (math.radians(lon) * EARTH_RADIUS_KM * cos_phi, math.radians(lat) * EARTH_RADIUS_KM)

    px, py = to_xy(plat, plon)
    ax, ay = to_xy(alat, alon)
    bx, by = to_xy(blat, blon)

    dx = bx - ax
    dy = by - ay
    segment_len_sq = dx * dx + dy * dy

    if segment_len_sq == 0.0:
        return haversine_distance(plat, plon, alat, alon)

    # Projection factor t
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / segment_len_sq))
    proj_x = ax + t * dx
    proj_y = ay + t * dy

    dist = math.hypot(px - proj_x, py - proj_y)
    return round(dist, 2)
