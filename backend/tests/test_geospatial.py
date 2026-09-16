"""Unit tests for geospatial mathematics and geofencing."""
from app.geo.calculations import haversine_distance, calculate_bearing, destination_point
from app.geo.geofence import is_point_in_polygon, distance_to_polygon, segments_intersect

def test_haversine_distance():
    # Distance between Kochi (9.9312, 76.2673) and Mumbai (18.9220, 72.8347) is approx 1060-1070 km
    dist = haversine_distance(9.9312, 76.2673, 18.9220, 72.8347)
    assert 1050.0 < dist < 1080.0
    # Zero distance test
    assert haversine_distance(10.0, 75.0, 10.0, 75.0) == 0.0

def test_bearing():
    # Due North: lat increases, lon constant
    deg, comp = calculate_bearing(10.0, 75.0, 12.0, 75.0)
    assert comp == "N"
    assert round(deg) == 0 or round(deg) == 360

    # Due East: lon increases, lat constant
    deg_e, comp_e = calculate_bearing(10.0, 75.0, 10.0, 77.0)
    assert comp_e in ["E", "ENE", "ESE"]
    assert 80.0 < deg_e < 100.0

def test_point_in_polygon():
    square = [
        [10.0, 70.0],
        [10.0, 72.0],
        [12.0, 72.0],
        [12.0, 70.0],
        [10.0, 70.0]
    ]
    # Center point inside
    assert is_point_in_polygon(11.0, 71.0, square) is True
    # Point clearly outside
    assert is_point_in_polygon(15.0, 75.0, square) is False

def test_distance_to_polygon():
    square = [
        [10.0, 70.0],
        [10.0, 72.0],
        [12.0, 72.0],
        [12.0, 70.0],
        [10.0, 70.0]
    ]
    # Point inside should have 0 distance
    assert distance_to_polygon(11.0, 71.0, square) == 0.0
    # Point outside should have positive distance
    dist = distance_to_polygon(10.0, 73.0, square)
    assert dist > 0.0
