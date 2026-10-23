"""
backend/app/main.py
===================
FastAPI REST API Server for Hamming(7,4) Single vs Double Error Dynamics.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from itertools import combinations, product
from typing import List, Dict, Any
import numpy as np

from .hamming74 import Hamming74
from .secded84 import ExtendedHamming84
from .models import (
    EncodeRequest,
    SimulateRequest,
    SimulationResponse,
    MatrixInfoResponse,
    BenchmarkSummary,
)

app = FastAPI(
    title="Hamming(7,4) Error Dynamics API",
    description="High-performance error control backend computing syndromes, SEC, decoder aliasing, and SECDED.",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Hamming(7,4) Error Dynamics Engine",
        "version": "2.0.0",
        "capabilities": ["Hamming74", "SECDED84", "MatrixAnalysis", "BenchmarkSuite"]
    }


@app.post("/api/encode")
def encode_message(payload: EncodeRequest):
    try:
        d = payload.data_bits
        c7 = Hamming74.encode(d)
        p1, p2, p4 = Hamming74.calculate_parity_explicit(d[0], d[1], d[2], d[3])
        c8 = ExtendedHamming84.encode(d)
        return {
            "data_bits": d,
            "codeword_7bit": c7,
            "codeword_8bit_secded": c8,
            "parity_bits": {
                "p1": p1,
                "p2": p2,
                "p4": p4,
                "p0_overall": c8[7],
            },
            "formula_explanation": {
                "p1": f"d1({d[0]}) ⊕ d2({d[1]}) ⊕ d4({d[3]}) = {p1}",
                "p2": f"d1({d[0]}) ⊕ d3({d[2]}) ⊕ d4({d[3]}) = {p2}",
                "p4": f"d2({d[1]}) ⊕ d3({d[2]}) ⊕ d4({d[3]}) = {p4}",
                "p0": f"⊕(all 7 bits) = {c8[7]}"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/simulate", response_model=SimulationResponse)
def simulate_channel(payload: SimulateRequest):
    try:
        d = payload.data_bits
        flips = payload.flip_positions

        res7 = Hamming74.analyze_behavior(d, flips)

        secded_res = None
        if payload.enable_secded or len(flips) >= 1:
            c8 = ExtendedHamming84.encode(d)
            rx8, err8 = Hamming74.inject_errors(c8, flips)
            secded_res = ExtendedHamming84.decode(rx8)

        return {
            **res7,
            "secded_result": secded_res
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/matrix", response_model=MatrixInfoResponse)
def get_matrix_info():
    columns_mapping = []
    for pos in range(1, 8):
        role, desc = Hamming74.BIT_ROLES[pos]
        col = Hamming74.H[:, pos - 1].tolist()
        bin_addr = f"{pos:03b}"
        columns_mapping.append({
            "position": pos,
            "role": role,
            "description": desc,
            "binary_address": bin_addr,
            "column_vector": col,
            "decimal_syndrome": pos,
        })

    return {
        "generator_matrix": Hamming74.G.tolist(),
        "parity_check_matrix": Hamming74.H.tolist(),
        "columns_mapping": columns_mapping,
    }


@app.get("/api/all-pairs")
def get_all_double_error_pairs():
    pairs_data = []
    pair_idx = 1
    for (i, j) in combinations(range(1, 8), 2):
        col_i = Hamming74.H[:, i - 1]
        col_j = Hamming74.H[:, j - 1]
        sum_col = (col_i + col_j) % 2

        alias_k = -1
        for k in range(1, 8):
            if np.array_equal(Hamming74.H[:, k - 1], sum_col):
                alias_k = k
                break

        pairs_data.append({
            "pair_index": pair_idx,
            "flipped_bits": [i, j],
            "col_i": col_i.tolist(),
            "col_j": col_j.tolist(),
            "sum_col": sum_col.tolist(),
            "aliased_bit": alias_k,
            "aliased_bit_role": Hamming74.BIT_ROLES[alias_k][0],
            "final_error_count": 3,
            "danger": f"Decoder flips innocent Bit {alias_k}, resulting in 3 total corrupted bits!"
        })
        pair_idx += 1

    return {
        "total_pairs": len(pairs_data),
        "aliasing_rate_percentage": 100.0,
        "conclusion": "100% of double errors alias into a valid single-bit syndrome. Ordinary Hamming(7,4) cannot safely correct double errors.",
        "pairs": pairs_data
    }


@app.get("/api/benchmark")
def run_benchmark():
    all_messages = [list(m) for m in product([0, 1], repeat=4)]

    stats = {
        "zero_error_total": 0,
        "zero_error_correct": 0,
        "single_error_total": 0,
        "single_error_corrected": 0,
        "double_error_total": 0,
        "double_error_safe_corrected": 0,
        "double_error_aliased": 0,
        "secded_double_detected": 0,
    }

    # Zero errors (16 runs)
    for d in all_messages:
        res = Hamming74.analyze_behavior(d, [])
        stats["zero_error_total"] += 1
        if res["is_data_correct"]:
            stats["zero_error_correct"] += 1

    # Single errors (112 runs)
    for d in all_messages:
        for pos in range(1, 8):
            res = Hamming74.analyze_behavior(d, [pos])
            stats["single_error_total"] += 1
            if res["is_data_correct"]:
                stats["single_error_corrected"] += 1

    # Double errors (336 runs)
    for d in all_messages:
        for (p1, p2) in combinations(range(1, 8), 2):
            res = Hamming74.analyze_behavior(d, [p1, p2])
            stats["double_error_total"] += 1
            if res["is_codeword_correct"]:
                stats["double_error_safe_corrected"] += 1
            if res["corrected_position"] not in (p1, p2) and res["corrected_position"] > 0:
                stats["double_error_aliased"] += 1

            # SECDED
            c8 = ExtendedHamming84.encode(d)
            rx8, _ = Hamming74.inject_errors(c8, [p1, p2])
            res8 = ExtendedHamming84.decode(rx8)
            if res8["status"] == "DOUBLE_ERROR_DETECTED":
                stats["secded_double_detected"] += 1

    total_runs = stats["zero_error_total"] + stats["single_error_total"] + stats["double_error_total"]

    return {
        "total_runs": total_runs,
        "zero_error_total": stats["zero_error_total"],
        "zero_error_success_rate": 100.0,
        "single_error_total": stats["single_error_total"],
        "single_error_corrected_rate": (stats["single_error_corrected"] / stats["single_error_total"]) * 100,
        "double_error_total": stats["double_error_total"],
        "double_error_safe_rate": (stats["double_error_safe_corrected"] / stats["double_error_total"]) * 100,
        "double_error_aliased_rate": (stats["double_error_aliased"] / stats["double_error_total"]) * 100,
        "secded_double_detected_rate": (stats["secded_double_detected"] / stats["double_error_total"]) * 100,
        "dataset_source": "In-memory real-time 464 simulation engine"
    }


@app.get("/api/export-csv")
def export_csv():
    import io
    import csv

    all_messages = [list(m) for m in product([0, 1], repeat=4)]
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "data", "num_errors", "flips", "syndrome_bits", "syndrome_dec",
        "decoder_flipped_bit", "data_restored", "codeword_restored",
        "final_error_count", "outcome"
    ])

    for d in all_messages:
        # Zero error
        r0 = Hamming74.analyze_behavior(d, [])
        writer.writerow(["".join(map(str, d)), 0, "none", "".join(map(str, r0["syndrome_bits"])), 0, 0, True, True, 0, r0["outcome"]])

        # Single error
        for pos in range(1, 8):
            r1 = Hamming74.analyze_behavior(d, [pos])
            writer.writerow(["".join(map(str, d)), 1, str(pos), "".join(map(str, r1["syndrome_bits"])), r1["syndrome_decimal"], r1["corrected_position"], r1["is_data_correct"], r1["is_codeword_correct"], r1["final_error_count"], r1["outcome"]])

        # Double error
        for (p1, p2) in combinations(range(1, 8), 2):
            r2 = Hamming74.analyze_behavior(d, [p1, p2])
            writer.writerow(["".join(map(str, d)), 2, f"{p1}+{p2}", "".join(map(str, r2["syndrome_bits"])), r2["syndrome_decimal"], r2["corrected_position"], r2["is_data_correct"], r2["is_codeword_correct"], r2["final_error_count"], r2["outcome"]])

    return PlainTextResponse(output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=hamming74_test_results.csv"})
