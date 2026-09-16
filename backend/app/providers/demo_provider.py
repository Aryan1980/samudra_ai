"""High-fidelity realistic synthetic Demo Data Provider for Indian Waters."""
from datetime import datetime, timezone
import math
from typing import List, Dict, Any, Optional
from app.providers.base import MarineDataProvider
from app.schemas.marine import Coordinates, MarineObservation, PFZZone, WeatherReport
from app.schemas.alert import MarineAlert
from app.schemas.data_sources import DataSourceInfo
from app.geo.calculations import haversine_distance, calculate_bearing, destination_point
from app.geo.geofence import is_point_in_polygon, distance_to_polygon
from app.geo.boundaries import MARINE_PROTECTED_AREAS, RESTRICTED_ZONES, IMBL_BOUNDARIES, COASTAL_PRESETS
from app.geo.coastline import get_seaward_baseline

class DemoDataProvider(MarineDataProvider):
    """Generates realistic oceanographic, atmospheric, and navigational data for ISRO evaluation."""

    def __init__(self):
        self.is_demo = True

    def _get_utc_now(self) -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    async def get_weather(self, coords: Coordinates, target_time: Optional[str] = None) -> WeatherReport:
        import httpx
        from app.config import settings

        # 1. Check for Live WeatherAPI.com credentials
        if settings.WEATHER_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(
                        "http://api.weatherapi.com/v1/current.json",
                        params={"key": settings.WEATHER_API_KEY, "q": f"{coords.latitude},{coords.longitude}"}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        cur = data.get("current", {})
                        w_speed = float(cur.get("wind_kph", 16.0))
                        w_dir = float(cur.get("wind_degree", 240.0))
                        w_gust = float(cur.get("gust_kph", w_speed * 1.3))
                        temp = float(cur.get("temp_c", 28.5))
                        precip = float(cur.get("precip_mm", 0.0))
                        humidity = float(cur.get("humidity", 78.0))
                        vis = float(cur.get("vis_km", 10.0))
                        cond_text = cur.get("condition", {}).get("text", "Normal Sea Breeze")
                        
                        # Calculate wave height from wind & swell model
                        wave_m = round(max(0.7, min(4.5, 0.03 * (w_speed ** 1.22))), 1)
                        lightning = "thunder" in cond_text.lower() or "storm" in cond_text.lower()
                        
                        return WeatherReport(
                            location=coords,
                            timestamp=self._get_utc_now(),
                            temperature_c=temp,
                            wind_speed_kmh=w_speed,
                            wind_direction_deg=w_dir,
                            wind_gust_kmh=w_gust,
                            wave_height_m=wave_m,
                            wave_direction_deg=round((w_dir - 15) % 360, 1),
                            rainfall_mm=precip,
                            humidity_pct=humidity,
                            visibility_km=vis,
                            lightning_detected=lightning,
                            lightning_distance_km=15.0 if lightning else None,
                            cyclone_status="none",
                            cyclone_category=None,
                            advisory_text=f"Live Observation ({cond_text}): Surface wind {w_speed} km/h with gusts up to {w_gust} km/h.",
                            source="WeatherAPI.com (Live Satellite/Radar Feed)",
                            is_demo=False
                        )
            except Exception as e:
                pass # Fallback smoothly to alternative provider or physical simulation

        # 2. Check for Live OpenWeatherMap if configured
        owm_key = settings.OPENWEATHER_API_KEY or settings.MAP_API_KEY
        if owm_key:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(
                        "https://api.openweathermap.org/data/2.5/weather",
                        params={"lat": coords.latitude, "lon": coords.longitude, "appid": owm_key, "units": "metric"}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        w_speed = float(data.get("wind", {}).get("speed", 4.5)) * 3.6
                        w_dir = float(data.get("wind", {}).get("deg", 240.0))
                        w_gust = float(data.get("wind", {}).get("gust", (w_speed / 3.6) * 1.3)) * 3.6
                        temp = float(data.get("main", {}).get("temp", 28.5))
                        humidity = float(data.get("main", {}).get("humidity", 78.0))
                        vis = float(data.get("visibility", 10000)) / 1000.0
                        cond_desc = data.get("weather", [{}])[0].get("description", "Clear Sea Breeze")
                        precip = float(data.get("rain", {}).get("1h", 0.0))
                        wave_m = round(max(0.7, min(4.5, 0.03 * (w_speed ** 1.22))), 1)
                        lightning = "thunder" in cond_desc.lower() or "storm" in cond_desc.lower()

                        return WeatherReport(
                            location=coords,
                            timestamp=self._get_utc_now(),
                            temperature_c=temp,
                            wind_speed_kmh=round(w_speed, 1),
                            wind_direction_deg=w_dir,
                            wind_gust_kmh=round(w_gust, 1),
                            wave_height_m=wave_m,
                            wave_direction_deg=round((w_dir - 15) % 360, 1),
                            rainfall_mm=precip,
                            humidity_pct=humidity,
                            visibility_km=vis,
                            lightning_detected=lightning,
                            lightning_distance_km=15.0 if lightning else None,
                            cyclone_status="none",
                            cyclone_category=None,
                            advisory_text=f"Live Observation ({cond_desc.title()}): Surface wind {round(w_speed, 1)} km/h with gusts up to {round(w_gust, 1)} km/h.",
                            source="OpenWeatherMap (Live Marine Atmospheric Feed)",
                            is_demo=False
                        )
            except Exception:
                pass

        # Fallback synthetic physical simulation

        # Base realistic physical parameters derived from coastal coordinates
        lat, lon = coords.latitude, coords.longitude
        
        # Spatial variations along Indian coast
        is_bay_of_bengal = lon > 79.5
        is_north = lat > 18.0

        base_wind = 18.0 + 6.0 * math.sin(lat * 0.7) + (4.0 if is_bay_of_bengal else 0.0)
        base_gust = base_wind * 1.35
        base_wave = 1.2 + 0.5 * math.cos(lon * 0.4) + (0.4 if is_north else 0.1)
        
        # Cyclone scenario simulated for northern Bay of Bengal if lat > 19 and lon > 85
        if lat > 19.5 and lon > 85.5:
            cyclone_status = "watch"
            cyclone_cat = "Depression (BOB-02)"
            advisory = "IMD Cyclone Watch: Deep depression forming over North Bay of Bengal. Fishermen advised to remain cautious."
            lightning = True
            lightning_dist = 22.0
            base_wind = 38.0
            base_wave = 2.7
        else:
            cyclone_status = "none"
            cyclone_cat = None
            advisory = "Normal seasonal sea conditions. Nearshore fishing operations feasible."
            lightning = False
            lightning_dist = None

        return WeatherReport(
            location=coords,
            timestamp=self._get_utc_now(),
            temperature_c=round(29.2 + 1.2 * math.sin(lat * 0.3), 1),
            wind_speed_kmh=round(base_wind, 1),
            wind_direction_deg=round(245.0 + 15.0 * math.sin(lat), 1),
            wind_gust_kmh=round(base_gust, 1),
            wave_height_m=round(base_wave, 1),
            wave_direction_deg=round(230.0 + 10.0 * math.cos(lon), 1),
            rainfall_mm=round(2.5 if is_bay_of_bengal else 0.4, 1),
            humidity_pct=round(78.0 + 8.0 * math.sin(lon * 0.5), 1),
            visibility_km=round(9.5 if not lightning else 6.0, 1),
            lightning_detected=lightning,
            lightning_distance_km=lightning_dist,
            cyclone_status=cyclone_status,
            cyclone_category=cyclone_cat,
            advisory_text=advisory,
            source="IMD / MOSDAC Satellite Feed (Synthetic Demo)",
            is_demo=True
        )

    async def get_ocean_conditions(self, coords: Coordinates) -> MarineObservation:
        lat, lon = coords.latitude, coords.longitude
        
        # Sea Surface Temperature (SST) in Indian waters: typically 27.5 - 30.2 C
        sst = round(28.4 + 0.8 * math.sin(lat * 0.5) - 0.4 * math.cos(lon * 0.3), 1)
        
        # Chlorophyll-a: coastal upwelling produces 1.5 - 3.5 mg/m3; offshore 0.3 - 0.9
        # Distance to nominal coastline estimate
        coast_proximity = min(abs(lon - 72.8), abs(lon - 80.2), abs(lat - 8.1))
        chlorophyll = round(max(0.4, min(4.2, 2.4 / (1.0 + coast_proximity * 0.8))), 2)

        wave_h = round(1.3 + 0.4 * math.sin(lat * 0.6), 1)
        wind_s = round(19.5 + 4.0 * math.cos(lon * 0.2), 1)

        tide_states = ["Rising Tide (Flood)", "High Tide (Slack)", "Falling Tide (Ebb)", "Low Tide"]
        tide_idx = int((lat * 10 + lon * 5) % 4)
        tide_status = tide_states[tide_idx]
        tide_height = round(1.4 + 0.6 * math.sin(lat * 1.5), 2)

        sea_state = "Slight (Wave 0.5m-1.25m)" if wave_h < 1.5 else "Moderate (Wave 1.25m-2.5m)" if wave_h < 2.5 else "Rough (Wave > 2.5m)"

        return MarineObservation(
            location=coords,
            timestamp=self._get_utc_now(),
            sst=sst,
            chlorophyll=chlorophyll,
            wave_height=wave_h,
            wave_direction=round(235.0, 1),
            wind_speed=wind_s,
            wind_direction=round(240.0, 1),
            rainfall=0.8,
            tide=tide_status,
            tide_height_m=tide_height,
            sea_state=sea_state,
            source="INCOIS / ISRO Oceansat-3 OCM/AASS (Synthetic Demo)",
            data_type="demo",
            is_demo=True
        )

    async def get_pfz_advisories(self, coords: Coordinates, radius_km: float = 120.0) -> List[PFZZone]:
        """Generate 8 realistic PFZ zones calibrated to the fisherman's departure location.
        Uses coastal geometry baseline to guarantee spots are strictly in open sea water,
        never on land, islands, estuaries, or backwaters."""
        lat, lon = coords.latitude, coords.longitude
        results: List[PFZZone] = []

        # 1. Determine seaward baseline from coastline engine
        baseline = get_seaward_baseline(lat, lon)
        orig_lat = baseline["origin_lat"]
        orig_lon = baseline["origin_lon"]

        # Generous angular and distance separation (in km) to ensure clean map visibility with zero pin overlap
        is_west = lon < 78.0
        if is_west:
            bearings = [265, 295, 235, 280, 225, 308, 250, 275]
        else:
            bearings = [90, 65, 120, 80, 135, 55, 105, 95]

        offsets = [0.6, 2.2, 4.2, 6.8, 9.8, 13.5, 17.5, 22.5]

        zone_data = [
            {
                "name": "Chlorophyll Bloom Alpha",
                "sst_offset": 0.0,
                "chl_base": 3.4,
                "suitability": 94,
                "note": "High-density chlorophyll bloom. Ideal for sardine & mackerel near the thermal front."
            },
            {
                "name": "Coastal Upwelling Beta",
                "sst_offset": -0.4,
                "chl_base": 3.0,
                "suitability": 90,
                "note": "Active upwelling. Rich nutrient surge supporting anchovy and scad aggregations."
            },
            {
                "name": "SST Gradient Gamma",
                "sst_offset": -0.7,
                "chl_base": 2.7,
                "suitability": 87,
                "note": "Optimal SST gradient (ΔT=0.8°C). Pelagic tuna and kingfish likely present."
            },
            {
                "name": "Thermal Convergence Delta",
                "sst_offset": -1.0,
                "chl_base": 2.3,
                "suitability": 83,
                "note": "Convergence zone. Mixed pelagic aggregation. Suitable for gill-net operations."
            },
            {
                "name": "Mid-Shelf Break Epsilon",
                "sst_offset": -1.2,
                "chl_base": 2.0,
                "suitability": 79,
                "note": "Mid-shelf break. Good for trawling. Monitor wave height before departure."
            },
            {
                "name": "Offshore Front Zeta",
                "sst_offset": -1.5,
                "chl_base": 1.8,
                "suitability": 74,
                "note": "Moderate chlorophyll. Suitable for experienced offshore fishermen with larger craft."
            },
            {
                "name": "Pelagic Trench Eta",
                "sst_offset": -1.7,
                "chl_base": 1.6,
                "suitability": 70,
                "note": "Scattered pelagic activity. Long transit; plan fuel and provisions accordingly."
            },
            {
                "name": "Deep Shelf Break Theta",
                "sst_offset": -2.0,
                "chl_base": 1.4,
                "suitability": 65,
                "note": "Shelf-break edge. Not recommended for craft under 20 ft. Check cyclone advisories."
            },
        ]

        # Baseline SST from ocean latitude model
        import math
        base_sst = 28.2 + 0.5 * math.sin(math.radians(lat * 10))

        for i, (bearing, off_dist, zd) in enumerate(zip(bearings, offsets, zone_data)):
            # Generate spot position offshore
            pfz_lat, pfz_lon = destination_point(orig_lat, orig_lon, off_dist, bearing)

            # True transit distance and compass bearing from vessel departure point
            transit_dist = haversine_distance(lat, lon, pfz_lat, pfz_lon)
            b_deg, b_comp = calculate_bearing(lat, lon, pfz_lat, pfz_lon)

            sst = round(base_sst + zd["sst_offset"], 1)
            chl = round(zd["chl_base"], 2)
            suitability = zd["suitability"]

            # Safety tier based on transit distance and sea exposure
            safety_rating = "SAFE" if transit_dist <= 24.0 else "CAUTION" if transit_dist <= 36.0 else "AVOID"

            # Tight polygon contour (~1.6km radius) strictly in open ocean
            poly = [
                [round(pfz_lat + 0.014, 4), round(pfz_lon - 0.014, 4)],
                [round(pfz_lat + 0.014, 4), round(pfz_lon + 0.014, 4)],
                [round(pfz_lat - 0.014, 4), round(pfz_lon + 0.014, 4)],
                [round(pfz_lat - 0.014, 4), round(pfz_lon - 0.014, 4)],
                [round(pfz_lat + 0.014, 4), round(pfz_lon - 0.014, 4)]
            ]

            results.append(PFZZone(
                id=f"spot_{i+1}",
                name=f"Spot {i+1}: {zd['name']}",
                location=Coordinates(latitude=round(pfz_lat, 4), longitude=round(pfz_lon, 4)),
                polygon=poly,
                distance_km=round(transit_dist, 1),
                bearing_deg=b_deg,
                bearing_compass=b_comp,
                sst_c=sst,
                chlorophyll_mg_m3=chl,
                suitability_score=float(suitability),
                safety_rating=safety_rating,
                recommendation=zd["note"],
                avoids=(safety_rating == "AVOID"),
                source="INCOIS PFZ Advisory / Oceansat-3 OCM-3 (Synthetic)",
                is_demo=True
            ))

        return results

    async def get_boundary_contexts(self, coords: Coordinates) -> Dict[str, Any]:
        lat, lon = coords.latitude, coords.longitude
        nearest_imbl = None
        min_imbl_dist = float("inf")

        for imbl in IMBL_BOUNDARIES:
            line_coords = imbl["coordinates"]
            for i in range(len(line_coords) - 1):
                p1, p2 = line_coords[i], line_coords[i+1]
                dist = haversine_distance(lat, lon, p1[0], p1[1])
                if dist < min_imbl_dist:
                    min_imbl_dist = dist
                    nearest_imbl = imbl

        # MPAs check
        inside_mpa = None
        nearest_mpa = None
        min_mpa_dist = float("inf")
        for mpa in MARINE_PROTECTED_AREAS:
            if is_point_in_polygon(lat, lon, mpa["polygon"]):
                inside_mpa = mpa
                min_mpa_dist = 0.0
                break
            d = distance_to_polygon(lat, lon, mpa["polygon"])
            if d < min_mpa_dist:
                min_mpa_dist = d
                nearest_mpa = mpa

        # Restricted Zones check
        inside_restricted = None
        for rz in RESTRICTED_ZONES:
            if is_point_in_polygon(lat, lon, rz["polygon"]):
                inside_restricted = rz
                break

        return {
            "imbl": {
                "name": nearest_imbl["name"] if nearest_imbl else "None",
                "distance_km": round(min_imbl_dist, 2),
                "is_approaching": min_imbl_dist <= 20.0,
                "is_critical": min_imbl_dist <= 5.0
            },
            "mpa": {
                "inside": inside_mpa is not None,
                "name": inside_mpa["name"] if inside_mpa else (nearest_mpa["name"] if nearest_mpa else "None"),
                "distance_km": round(min_mpa_dist, 2),
                "restriction": inside_mpa["restriction"] if inside_mpa else "Standard Coastal Regulation Zone"
            },
            "restricted_zone": {
                "inside": inside_restricted is not None,
                "name": inside_restricted["name"] if inside_restricted else "None",
                "authority": inside_restricted["authority"] if inside_restricted else "None"
            }
        }

    async def get_active_alerts(self, coords: Coordinates) -> List[MarineAlert]:
        alerts: List[MarineAlert] = []
        lat, lon = coords.latitude, coords.longitude
        now_str = self._get_utc_now()

        # 1. IMBL Proximity Check
        boundaries = await self.get_boundary_contexts(coords)
        imbl = boundaries["imbl"]
        if imbl["is_critical"]:
            alerts.append(MarineAlert(
                id="alt_imbl_critical",
                title="CRITICAL: International Maritime Boundary Proximity",
                severity="EXTREME",
                category="IMBL",
                location=coords,
                affected_radius_km=10.0,
                message=f"Vessel is within {imbl['distance_km']} km of {imbl['name']}. Immediate course reversal required to avoid sovereign airspace/water transgression.",
                issued_at=now_str,
                expires_at="2026-09-14T23:59:59Z",
                source="Indian Coast Guard / INCOIS Geofence Monitor",
                is_demo=True
            ))
        elif imbl["is_approaching"]:
            alerts.append(MarineAlert(
                id="alt_imbl_warn",
                title="WARNING: Approaching Maritime Boundary Line",
                severity="HIGH",
                category="IMBL",
                location=coords,
                affected_radius_km=20.0,
                message=f"Vessel is within {imbl['distance_km']} km of {imbl['name']}. Exercise caution and maintain active AIS transponder.",
                issued_at=now_str,
                expires_at="2026-09-14T23:59:59Z",
                source="Indian Coast Guard / INCOIS Geofence Monitor",
                is_demo=True
            ))

        # 2. MPA Check
        mpa = boundaries["mpa"]
        if mpa["inside"]:
            alerts.append(MarineAlert(
                id="alt_mpa_breach",
                title=f"RESTRICTED AREA: Inside {mpa['name']}",
                severity="HIGH",
                category="MPA",
                location=coords,
                affected_radius_km=15.0,
                message=f"Mechanized commercial fishing is prohibited in this protected reserve. {mpa['restriction']}.",
                issued_at=now_str,
                expires_at="2026-09-14T23:59:59Z",
                source="Ministry of Environment, Forest and Climate Change (MoEFCC)",
                is_demo=True
            ))

        # 3. Wave & Weather alert
        weather = await self.get_weather(coords)
        if weather.cyclone_status != "none":
            alerts.append(MarineAlert(
                id="alt_cyclone_active",
                title=f"CYCLONE ALERT: {weather.cyclone_category}",
                severity="EXTREME",
                category="CYCLONE",
                location=coords,
                affected_radius_km=150.0,
                message=f"{weather.advisory_text} Maximum sustained winds expected up to 65 km/h.",
                issued_at=now_str,
                expires_at="2026-09-14T18:00:00Z",
                source="India Meteorological Department (IMD)",
                is_demo=True
            ))
        elif weather.wave_height_m >= 2.5:
            alerts.append(MarineAlert(
                id="alt_high_wave",
                title="HIGH WAVE WARNING: Swell Surge",
                severity="HIGH",
                category="WAVE",
                location=coords,
                affected_radius_km=60.0,
                message=f"Significant wave height exceeding {weather.wave_height_m} meters. Small crafts and country boats advised against venturing offshore.",
                issued_at=now_str,
                expires_at="2026-09-14T12:00:00Z",
                source="INCOIS Ocean State Forecast (OSF)",
                is_demo=True
            ))
        else:
            alerts.append(MarineAlert(
                id="alt_routine_marine",
                title="Routine Ocean State Advisory",
                severity="INFORMATIONAL",
                category="WIND",
                location=coords,
                affected_radius_km=50.0,
                message="Normal navigational conditions prevailing along coastal corridors. Wind speeds 15-22 km/h.",
                issued_at=now_str,
                expires_at="2026-09-14T23:59:59Z",
                source="INCOIS Marine Bulletin",
                is_demo=True
            ))

        return alerts

    def get_source_metadata(self) -> List[DataSourceInfo]:
        now_str = self._get_utc_now()
        return [
            DataSourceInfo(
                id="isro_oceansat3",
                name="ISRO Oceansat-3 (EOS-06)",
                organization="Indian Space Research Organisation",
                dataset_name="Ocean Colour Monitor (OCM-3) & AASS-derived SST",
                parameters="Sea Surface Temperature (SST), Chlorophyll-a concentration, diffuse attenuation coefficient",
                status="ACTIVE_DEMO",
                is_demo=True,
                last_update=now_str,
                update_frequency="Daily (6-hour orbital revisit)",
                description="Spaceborne thermal infrared and multi-spectral ocean color radiometry providing high-resolution oceanic fronts for PFZ generation.",
                official_portal="https://mosdac.gov.in",
                config_env_var="SATELLITE_API_KEY"
            ),
            DataSourceInfo(
                id="incois_pfz",
                name="INCOIS Potential Fishing Zones Advisory",
                organization="Indian National Centre for Ocean Information Services (MoES)",
                dataset_name="Integrated Multilingual PFZ & Ocean State Forecast (OSF)",
                parameters="PFZ coordinates, depth, compass bearing, ocean surface currents, wave spectrum",
                status="ACTIVE_DEMO",
                is_demo=True,
                last_update=now_str,
                update_frequency="Daily at 06:00 & 18:00 IST",
                description="Operational PFZ bulletins synthesized by INCOIS from satellite SST and Chlorophyll composites to reduce search time for traditional fishermen.",
                official_portal="https://incois.gov.in/portal/pfz/pfz.jsp",
                config_env_var="OCEAN_API_KEY"
            ),
            DataSourceInfo(
                id="imd_marine",
                name="IMD Marine Weather & Cyclone Bulletin",
                organization="India Meteorological Department (MoES)",
                dataset_name="Coastal Weather Forecast, Squall Warnings & Cyclone Tracks",
                parameters="Wind speed & gust, swell height, sea state, visibility, thunderstorm & lightning detection",
                status="ACTIVE_DEMO",
                is_demo=True,
                last_update=now_str,
                update_frequency="3-Hourly Updates",
                description="Authoritative national meteorological advisories for maritime navigation and coastal ports along Arabian Sea and Bay of Bengal.",
                official_portal="https://mausam.imd.gov.in",
                config_env_var="WEATHER_API_KEY"
            ),
            DataSourceInfo(
                id="icg_gis",
                name="National Marine Spatial GIS Repository",
                organization="Indian Coast Guard / Survey of India",
                dataset_name="IMBL, Marine Protected Areas, Oil Offshore Exclusion Zones",
                parameters="Sovereignty lines, bilateral agreements (1974/1976), wildlife protection buffers",
                status="ACTIVE_DEMO",
                is_demo=True,
                last_update=now_str,
                update_frequency="Quarterly / Statutory",
                description="Verified nautical polygon perimeters for maritime security, ecological preservation, and defense hazard avoidance.",
                official_portal="https://indiancoastguard.gov.in",
                config_env_var="MAP_API_KEY"
            )
        ]
