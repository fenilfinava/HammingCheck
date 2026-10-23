"""
backend/app/models.py
=====================
Pydantic Schemas for API Requests & Responses.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class EncodeRequest(BaseModel):
    data_bits: List[int] = Field(..., min_length=4, max_length=4, description="4-bit data vector [d1, d2, d3, d4]")


class SimulateRequest(BaseModel):
    data_bits: List[int] = Field(..., min_length=4, max_length=4, description="4-bit data vector [d1, d2, d3, d4]")
    flip_positions: List[int] = Field(default=[], description="List of 1-indexed bit positions to flip (1 to 7 or 8)")
    enable_secded: bool = Field(default=False, description="Whether to include 8-bit SECDED simulation")


class ParityEquation(BaseModel):
    row: int
    name: str
    indices: List[int]
    formula: str
    result: int
    status: str


class AliasingProof(BaseModel):
    bit1: int
    bit2: int
    col1: List[int]
    col2: List[int]
    sum_col: List[int]
    aliased_bit: int
    explanation: str


class SimulationResponse(BaseModel):
    transmitted_data: List[int]
    transmitted_codeword: List[int]
    flip_positions: List[int]
    num_flips: int
    error_vector: List[int]
    received_vector: List[int]
    syndrome_bits: List[int]
    syndrome_decimal: int
    equations: List[ParityEquation]
    corrected_position: int
    corrected_vector: List[int]
    decoded_data: List[int]
    is_data_correct: bool
    is_codeword_correct: bool
    final_error_count: int
    aliasing_proof: Optional[AliasingProof] = None
    secded_result: Optional[Dict[str, Any]] = None


class MatrixInfoResponse(BaseModel):
    generator_matrix: List[List[int]]
    parity_check_matrix: List[List[int]]
    columns_mapping: List[Dict[str, Any]]


class BenchmarkSummary(BaseModel):
    total_runs: int
    zero_error_total: int
    zero_error_success_rate: float
    single_error_total: int
    single_error_corrected_rate: float
    double_error_total: int
    double_error_safe_rate: float
    double_error_aliased_rate: float
    secded_double_detected_rate: float
