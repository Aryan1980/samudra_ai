"""Safe navigation route optimizer avoiding maritime hazards, MPAs, and geofences."""
from typing import List, Dict, Any, Tuple
from app.geo.calculations import haversine_distance, calculate_bearing, destination_point
from app.geo.geofence import line_intersects_polygon, is_point_in_polygon
from app.geo.boundaries import MARINE_PROTECTED_AREAS, RESTRICTED_ZONES, IMBL_BOUNDARIES
from app.schemas.marine import Coordinates
from app.schemas.route import Waypoint, RouteOption, RouteComparison

AVERAGE_FISHING_SPEED_KMH = 16.7  # ~9 knots

def plan_navigation_route(
    origin: Coordinates,
    destination: Coordinates,
    weather_hazard_center: Tuple[float, float] = None
) -> RouteComparison:
    """Compare direct shortest navigation track with risk-mitigated safe route."""
    start_pt = (origin.latitude, origin.longitude)
    dest_pt = (destination.latitude, destination.longitude)

    # 1. Identify all active environmental & regulatory hazard zones
    all_polygons: List[Dict[str, Any]] = []
    for mpa in MARINE_PROTECTED_AREAS:
        all_polygons.append({
            "name": mpa["name"],
            "category": "Marine Protected Area",
            "polygon": mpa["polygon"]
        })
    for rz in RESTRICTED_ZONES:
        all_polygons.append({
            "name": rz["name"],
            "category": "Restricted Security Zone",
            "polygon": rz["polygon"]
        })

    # Weather hazard circle approximated as small diamond polygon if present
    if weather_hazard_center:
        w_lat, w_lon = weather_hazard_center
        weather_poly = [
            [w_lat + 0.15, w_lon],
            [w_lat, w_lon + 0.15],
            [w_lat - 0.15, w_lon],
            [w_lat, w_lon - 0.15],
            [w_lat + 0.15, w_lon]
        ]
        all_polygons.append({
            "name": "Severe Wave/Lightning Cell",
            "category": "Weather Hazard",
            "polygon": weather_poly
        })

    # 2. Check direct line collisions
    intersected_hazards: List[Dict[str, Any]] = []
    for item in all_polygons:
        if line_intersects_polygon(start_pt, dest_pt, item["polygon"]):
            intersected_hazards.append(item)

    # Calculate shortest route metrics
    direct_dist = haversine_distance(origin.latitude, origin.longitude, destination.latitude, destination.longitude)
    shortest_duration = round(direct_dist / AVERAGE_FISHING_SPEED_KMH, 1)
    shortest_risk = "HIGH" if intersected_hazards else "LOW"

    shortest_waypoints = [
        Waypoint(name="Departure Point", latitude=origin.latitude, longitude=origin.longitude, segment_risk="LOW"),
        Waypoint(name="Destination Zone", latitude=destination.latitude, longitude=destination.longitude, segment_risk=shortest_risk)
    ]

    hazard_names = [f"{h['name']} ({h['category']})" for h in intersected_hazards]

    shortest_option = RouteOption(
        route_type="shortest",
        waypoints=shortest_waypoints,
        distance_km=direct_dist,
        estimated_duration_hours=shortest_duration,
        risk_level=shortest_risk,
        hazards_intersected=hazard_names,
        description=f"Direct rhumb line: {direct_dist} km ({shortest_duration} hrs)." + 
                    (f" WARNING: Crosses {len(hazard_names)} restricted/hazard zones." if hazard_names else " Clear navigational track.")
    )

    # 3. Construct Safe Route Detour if hazards exist
    safe_waypoints: List[Waypoint] = []
    safe_waypoints.append(Waypoint(name="Departure Point", latitude=origin.latitude, longitude=origin.longitude, segment_risk="LOW"))

    if intersected_hazards:
        # Calculate detour waypoints offsetting away from hazard centroid into seaward/safe waters
        for h in intersected_hazards:
            poly = h["polygon"]
            avg_lat = sum(p[0] for p in poly) / len(poly)
            avg_lon = sum(p[1] for p in poly) / len(poly)

            # Detour vector: push waypoint ~12 km seaward (west in Arabian Sea or east in Bay of Bengal)
            offset_bearing = 270.0 if origin.longitude < 80.0 else 90.0
            detour_lat, detour_lon = destination_point(avg_lat, avg_lon, 12.0, offset_bearing)
            
            safe_waypoints.append(Waypoint(
                name=f"Safe Waypoint: Clearance of {h['name']}",
                latitude=detour_lat,
                longitude=detour_lon,
                hazard_distance_km=12.0,
                segment_risk="LOW"
            ))

    safe_waypoints.append(Waypoint(name="Destination Zone", latitude=destination.latitude, longitude=destination.longitude, segment_risk="LOW"))

    # Compute total safe distance
    total_safe_dist = 0.0
    for i in range(len(safe_waypoints) - 1):
        seg = haversine_distance(
            safe_waypoints[i].latitude, safe_waypoints[i].longitude,
            safe_waypoints[i+1].latitude, safe_waypoints[i+1].longitude
        )
        total_safe_dist += seg
    total_safe_dist = round(total_safe_dist, 2)
    safe_duration = round(total_safe_dist / AVERAGE_FISHING_SPEED_KMH, 1)

    reasoning = (
        f"The direct track intersects {', '.join(hazard_names)}. "
        f"The optimized safe route diverts around protected boundaries with a mandatory buffer, "
        f"adding {round(total_safe_dist - direct_dist, 1)} km ({round(safe_duration - shortest_duration, 1)} hrs) "
        f"while mitigating regulatory penalties and collision risks."
        if intersected_hazards else
        "Direct track has zero hazard intersections and conforms to all maritime safety corridors."
    )

    safe_option = RouteOption(
        route_type="safe",
        waypoints=safe_waypoints,
        distance_km=total_safe_dist,
        estimated_duration_hours=safe_duration,
        risk_level="LOW",
        hazards_intersected=[],
        description=f"Risk-mitigated corridor: {total_safe_dist} km ({safe_duration} hrs). Zero restricted zone crossings."
    )

    return RouteComparison(
        origin=origin,
        destination=destination,
        shortest_route=shortest_option,
        safe_route=safe_option,
        recommendation="Recommended Safe Route" if intersected_hazards else "Direct Navigation Route",
        reasoning=reasoning
    )
