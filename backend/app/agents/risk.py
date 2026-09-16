"""Deterministic Marine Risk Assessment Engine.
Calculates transparent mathematical risk scores based on physical thresholds without LLM hallucination.
"""
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.schemas.marine import WeatherReport, MarineObservation
from app.schemas.risk import FactorScore, RiskAssessment

class RiskAssessmentAgent:
    """Calculates transparent, deterministic risk scores and categories."""

    def __init__(self):
        self.cfg = settings.RISK

    def _calc_wind_score(self, wind_kmh: float) -> Tuple[float, str, str]:
        if wind_kmh < self.cfg.WIND_MODERATE:
            return 10.0, "LOW", f"Wind speed {wind_kmh} km/h is well within gentle/moderate breeze limits (<{self.cfg.WIND_MODERATE} km/h)."
        elif wind_kmh < self.cfg.WIND_HIGH:
            score = 25.0 + 25.0 * ((wind_kmh - self.cfg.WIND_MODERATE) / (self.cfg.WIND_HIGH - self.cfg.WIND_MODERATE))
            return round(score, 1), "MODERATE", f"Wind speed {wind_kmh} km/h presents fresh breeze; small craft caution advised."
        elif wind_kmh < self.cfg.WIND_EXTREME:
            score = 50.0 + 35.0 * ((wind_kmh - self.cfg.WIND_HIGH) / (self.cfg.WIND_EXTREME - self.cfg.WIND_HIGH))
            return round(score, 1), "HIGH", f"Strong wind {wind_kmh} km/h exceeds safe threshold ({self.cfg.WIND_HIGH} km/h); nearshore operations only."
        else:
            return 100.0, "EXTREME", f"Gale/storm force winds {wind_kmh} km/h. Dangerous navigation conditions."

    def _calc_wave_score(self, wave_m: float) -> Tuple[float, str, str]:
        if wave_m < self.cfg.WAVE_MODERATE:
            return 10.0, "LOW", f"Significant wave height {wave_m} m is slight/favourable (<{self.cfg.WAVE_MODERATE} m)."
        elif wave_m < self.cfg.WAVE_HIGH:
            score = 25.0 + 25.0 * ((wave_m - self.cfg.WAVE_MODERATE) / (self.cfg.WAVE_HIGH - self.cfg.WAVE_MODERATE))
            return round(score, 1), "MODERATE", f"Wave height {wave_m} m indicates moderate chop; manageable for decked motor vessels."
        elif wave_m < self.cfg.WAVE_EXTREME:
            score = 50.0 + 35.0 * ((wave_m - self.cfg.WAVE_HIGH) / (self.cfg.WAVE_EXTREME - self.cfg.WAVE_HIGH))
            return round(score, 1), "HIGH", f"Rough seas with wave height {wave_m} m exceeding {self.cfg.WAVE_HIGH} m advisory limit."
        else:
            return 100.0, "EXTREME", f"Very rough to high seas ({wave_m} m). High capsize hazard."

    def _calc_lightning_score(self, detected: bool, distance_km: float = None) -> Tuple[float, str, str]:
        if not detected:
            return 0.0, "LOW", "No active convective lightning cells detected within radar radius."
        if distance_km and distance_km <= self.cfg.LIGHTNING_ACTIVE_KM:
            return 100.0, "EXTREME", f"Active lightning discharge within {distance_km} km. Immediate open-deck strike hazard."
        elif distance_km and distance_km <= self.cfg.LIGHTNING_NEARBY_KM:
            return 60.0, "HIGH", f"Thunderstorm cell detected {distance_km} km away. Approach expected within 30-45 mins."
        return 35.0, "MODERATE", "Distal convective clouds detected in sector."

    def _calc_cyclone_score(self, status: str, category: str = None) -> Tuple[float, str, str]:
        st = status.lower()
        if st == "warning":
            return 100.0, "EXTREME", f"Active IMD Cyclone Warning ({category or 'Severe'}). Absolute harbor shelter mandatory."
        elif st == "watch":
            return 65.0, "HIGH", f"IMD Cyclone Watch in effect ({category or 'Depression'}). Offshore ventures prohibited."
        return 0.0, "LOW", "No active tropical cyclonic disturbance in ocean basin."

    def _calc_geofence_score(self, boundary_ctx: Dict[str, Any]) -> Tuple[float, str, str]:
        imbl = boundary_ctx.get("imbl", {})
        mpa = boundary_ctx.get("mpa", {})
        rz = boundary_ctx.get("restricted_zone", {})

        if imbl.get("is_critical"):
            return 100.0, "EXTREME", f"Vessel within critical 5 km buffer of {imbl.get('name')}. High apprehension risk."
        if rz.get("inside"):
            return 95.0, "EXTREME", f"Vessel inside defense/energy restricted perimeter: {rz.get('name')}."
        if mpa.get("inside"):
            return 75.0, "HIGH", f"Vessel inside Marine Protected Area ({mpa.get('name')}). Commercial fishing prohibited."
        if imbl.get("is_approaching"):
            return 50.0, "MODERATE", f"Approaching maritime boundary: {imbl.get('distance_km')} km from {imbl.get('name')}."
        return 5.0, "LOW", "Safe distance maintained from all international boundaries and conservation zones."

    def _calc_tide_score(self, tide_status: str, height_m: float = None) -> Tuple[float, str, str]:
        if height_m and height_m > 3.5:
            return 70.0, "HIGH", f"Spring tidal surge {height_m} m. Strong bar mouth rip currents."
        if "High" in (tide_status or "") or "Rising" in (tide_status or ""):
            return 15.0, "LOW", f"Tide state ({tide_status}): favourable harbour navigation depth."
        return 20.0, "LOW", f"Tide state ({tide_status}): standard tidal flow."

    def assess_risk(
        self,
        weather: WeatherReport,
        ocean: MarineObservation,
        boundary_ctx: Dict[str, Any]
    ) -> RiskAssessment:
        factors: List[FactorScore] = []

        # 1. Wind
        w_score, w_sev, w_exp = self._calc_wind_score(weather.wind_speed_kmh)
        factors.append(FactorScore(
            factor_name="Wind Speed",
            raw_value=weather.wind_speed_kmh,
            unit="km/h",
            score=w_score,
            weight=self.cfg.WEIGHT_WIND,
            weighted_score=round(w_score * self.cfg.WEIGHT_WIND, 2),
            severity=w_sev,
            explanation=w_exp
        ))

        # 2. Wave
        wv_score, wv_sev, wv_exp = self._calc_wave_score(ocean.wave_height or weather.wave_height_m)
        factors.append(FactorScore(
            factor_name="Wave Height",
            raw_value=ocean.wave_height or weather.wave_height_m,
            unit="m",
            score=wv_score,
            weight=self.cfg.WEIGHT_WAVE,
            weighted_score=round(wv_score * self.cfg.WEIGHT_WAVE, 2),
            severity=wv_sev,
            explanation=wv_exp
        ))

        # 3. Lightning
        lt_score, lt_sev, lt_exp = self._calc_lightning_score(weather.lightning_detected, weather.lightning_distance_km)
        factors.append(FactorScore(
            factor_name="Lightning & Squall",
            raw_value=weather.lightning_distance_km or 0.0,
            unit="km",
            score=lt_score,
            weight=self.cfg.WEIGHT_LIGHTNING,
            weighted_score=round(lt_score * self.cfg.WEIGHT_LIGHTNING, 2),
            severity=lt_sev,
            explanation=lt_exp
        ))

        # 4. Cyclone
        cy_score, cy_sev, cy_exp = self._calc_cyclone_score(weather.cyclone_status, weather.cyclone_category)
        factors.append(FactorScore(
            factor_name="Cyclone Alert",
            raw_value=1.0 if weather.cyclone_status != "none" else 0.0,
            unit="alert_level",
            score=cy_score,
            weight=self.cfg.WEIGHT_CYCLONE,
            weighted_score=round(cy_score * self.cfg.WEIGHT_CYCLONE, 2),
            severity=cy_sev,
            explanation=cy_exp
        ))

        # 5. Geofence / Boundaries
        geo_score, geo_sev, geo_exp = self._calc_geofence_score(boundary_ctx)
        factors.append(FactorScore(
            factor_name="Maritime Geofencing",
            raw_value=boundary_ctx.get("imbl", {}).get("distance_km", 99.0),
            unit="km_to_border",
            score=geo_score,
            weight=self.cfg.WEIGHT_GEOFENCE,
            weighted_score=round(geo_score * self.cfg.WEIGHT_GEOFENCE, 2),
            severity=geo_sev,
            explanation=geo_exp
        ))

        # 6. Tide
        t_score, t_sev, t_exp = self._calc_tide_score(ocean.tide, ocean.tide_height_m)
        factors.append(FactorScore(
            factor_name="Tidal Current",
            raw_value=ocean.tide_height_m or 1.5,
            unit="m",
            score=t_score,
            weight=self.cfg.WEIGHT_TIDE,
            weighted_score=round(t_score * self.cfg.WEIGHT_TIDE, 2),
            severity=t_sev,
            explanation=t_exp
        ))

        # Calculate total weighted deterministic score
        total_score = round(sum(f.weighted_score for f in factors), 1)

        # Extreme override: If any critical single factor is EXTREME (e.g. Cyclone warning or IMBL breach), overall risk is elevated
        if cy_score >= 90.0 or lt_score >= 90.0 or geo_score >= 90.0:
            total_score = max(total_score, 80.0)

        # Categorize
        if total_score <= 25.0:
            risk_level = "LOW"
            safety_verdict = "SAFE"
            recommendation = "Favourable marine conditions. Normal nearshore and offshore fishing operations permitted."
        elif total_score <= 50.0:
            risk_level = "MODERATE"
            safety_verdict = "SAFE_WITH_CAUTION"
            recommendation = "Conditions generally suitable, but small motorboats and non-motorized crafts should maintain caution."
        elif total_score <= 75.0:
            risk_level = "HIGH"
            safety_verdict = "UNSAFE"
            recommendation = "High risk. Rough sea states and elevated wind/swell make offshore voyages unsafe."
        else:
            risk_level = "EXTREME"
            safety_verdict = "HAZARDOUS"
            recommendation = "Extreme marine hazard. Severe weather, cyclone or sovereign boundary breach. Return to port immediately."

        # Summary bullet reasons
        summary_reasons = [f.explanation for f in factors if f.severity in ["MODERATE", "HIGH", "EXTREME"]]
        if not summary_reasons:
            summary_reasons.append("All meteorological and navigational indicators are within green safety limits.")

        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        return RiskAssessment(
            overall_score=total_score,
            risk_level=risk_level,
            safety_verdict=safety_verdict,
            recommendation=recommendation,
            factors=factors,
            summary_reasons=summary_reasons,
            timestamp=now_str
        )
