"""Risk assessment and scoring schemas."""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class FactorScore(BaseModel):
    factor_name: str
    raw_value: float
    unit: str
    score: float = Field(..., description="Deterministic penalty score between 0 and 100")
    weight: float
    weighted_score: float
    severity: str = Field(..., description="LOW, MODERATE, HIGH, EXTREME")
    explanation: str

class RiskAssessment(BaseModel):
    overall_score: float = Field(..., description="Overall deterministic risk score (0-100)")
    risk_level: str = Field(..., description="LOW, MODERATE, HIGH, EXTREME")
    safety_verdict: str = Field(..., description="SAFE, SAFE_WITH_CAUTION, UNSAFE, HAZARDOUS")
    recommendation: str
    factors: List[FactorScore]
    summary_reasons: List[str]
    timestamp: str
    calculation_method: str = "deterministic_weighted_matrix"
    disclaimer: str = "SamudraAI is an operational decision-support tool. It does not replace official statutory advisories issued by INCOIS, IMD, or the Indian Coast Guard."
