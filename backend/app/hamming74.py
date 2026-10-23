"""
backend/app/hamming74.py
========================
Core Hamming(7,4) Codec for FastAPI Backend.
"""

from typing import List, Tuple, Dict, Any
import numpy as np


class Hamming74:
    H = np.array([
        [1, 0, 1, 0, 1, 0, 1],
        [0, 1, 1, 0, 0, 1, 1],
        [0, 0, 0, 1, 1, 1, 1],
    ], dtype=int)

    G = np.array([
        [1, 1, 1, 0, 0, 0, 0],
        [1, 0, 0, 1, 1, 0, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [1, 1, 0, 1, 0, 0, 1],
    ], dtype=int)

    BIT_ROLES = {
        1: ("p1", "Parity 1 (checks 1, 3, 5, 7)"),
        2: ("p2", "Parity 2 (checks 2, 3, 6, 7)"),
        3: ("d1", "Data 1"),
        4: ("p4", "Parity 4 (checks 4, 5, 6, 7)"),
        5: ("d2", "Data 2"),
        6: ("d3", "Data 3"),
        7: ("d4", "Data 4"),
    }

    DATA_INDICES_0BASED = [2, 4, 5, 6]

    @classmethod
    def encode(cls, data_bits: List[int]) -> List[int]:
        if len(data_bits) != 4 or not all(b in (0, 1) for b in data_bits):
            raise ValueError("Data bits must be a list of 4 binary values (0 or 1).")
        d = np.array(data_bits, dtype=int)
        c = np.dot(d, cls.G) % 2
        return c.tolist()

    @classmethod
    def calculate_parity_explicit(cls, d1: int, d2: int, d3: int, d4: int) -> Tuple[int, int, int]:
        p1 = d1 ^ d2 ^ d4
        p2 = d1 ^ d3 ^ d4
        p4 = d2 ^ d3 ^ d4
        return p1, p2, p4

    @classmethod
    def inject_errors(cls, codeword: List[int], flip_positions: List[int]) -> Tuple[List[int], List[int]]:
        corrupted = list(codeword)
        error_vector = [0] * len(codeword)
        for pos in flip_positions:
            if 1 <= pos <= len(codeword):
                corrupted[pos - 1] ^= 1
                error_vector[pos - 1] ^= 1
        return corrupted, error_vector

    @classmethod
    def calculate_syndrome(cls, received: List[int]) -> Tuple[List[int], int]:
        r = np.array(received[:7], dtype=int)
        s = np.dot(cls.H, r) % 2
        syndrome_bits = s.tolist()
        syndrome_decimal = int(syndrome_bits[0] * 1 + syndrome_bits[1] * 2 + syndrome_bits[2] * 4)
        return syndrome_bits, syndrome_decimal

    @classmethod
    def correct(cls, received: List[int], syndrome_decimal: int) -> Tuple[List[int], int]:
        corrected = list(received[:7])
        if syndrome_decimal == 0:
            return corrected, 0
        idx = syndrome_decimal - 1
        corrected[idx] ^= 1
        return corrected, syndrome_decimal

    @classmethod
    def extract_data(cls, codeword: List[int]) -> List[int]:
        return [codeword[i] for i in cls.DATA_INDICES_0BASED]

    @classmethod
    def analyze_behavior(cls, data_bits: List[int], flip_positions: List[int]) -> Dict[str, Any]:
        tx_codeword = cls.encode(data_bits)
        rx_vector, error_vector = cls.inject_errors(tx_codeword, flip_positions)
        syndrome_bits, syndrome_dec = cls.calculate_syndrome(rx_vector)
        corrected_vector, corrected_pos = cls.correct(rx_vector, syndrome_dec)
        decoded_data = cls.extract_data(corrected_vector)

        is_data_correct = (decoded_data == data_bits)
        is_codeword_correct = (corrected_vector == tx_codeword)
        final_errors = sum(c != t for c, t in zip(corrected_vector, tx_codeword))

        # Equation breakdown
        r = rx_vector
        equations = [
            {
                "row": 1,
                "name": "s1",
                "indices": [1, 3, 5, 7],
                "formula": f"{r[0]} ⊕ {r[2]} ⊕ {r[4]} ⊕ {r[6]}",
                "result": syndrome_bits[0],
                "status": "PASS" if syndrome_bits[0] == 0 else "FAIL"
            },
            {
                "row": 2,
                "name": "s2",
                "indices": [2, 3, 6, 7],
                "formula": f"{r[1]} ⊕ {r[2]} ⊕ {r[5]} ⊕ {r[6]}",
                "result": syndrome_bits[1],
                "status": "PASS" if syndrome_bits[1] == 0 else "FAIL"
            },
            {
                "row": 3,
                "name": "s3",
                "indices": [4, 5, 6, 7],
                "formula": f"{r[3]} ⊕ {r[4]} ⊕ {r[5]} ⊕ {r[6]}",
                "result": syndrome_bits[2],
                "status": "PASS" if syndrome_bits[2] == 0 else "FAIL"
            }
        ]

        aliasing_proof = None
        if len(flip_positions) == 2:
            p1, p2 = flip_positions[0], flip_positions[1]
            col1 = cls.H[:, p1 - 1].tolist()
            col2 = cls.H[:, p2 - 1].tolist()
            sum_col = [(a + b) % 2 for a, b in zip(col1, col2)]
            aliasing_proof = {
                "bit1": p1,
                "bit2": p2,
                "col1": col1,
                "col2": col2,
                "sum_col": sum_col,
                "aliased_bit": syndrome_dec,
                "explanation": f"col_{p1} {col1} ⊕ col_{p2} {col2} = {sum_col} ≡ col_{syndrome_dec}!"
            }

        return {
            "transmitted_data": data_bits,
            "transmitted_codeword": tx_codeword,
            "flip_positions": flip_positions,
            "num_flips": len(flip_positions),
            "error_vector": error_vector,
            "received_vector": rx_vector,
            "syndrome_bits": syndrome_bits,
            "syndrome_decimal": syndrome_dec,
            "equations": equations,
            "corrected_position": corrected_pos,
            "corrected_vector": corrected_vector,
            "decoded_data": decoded_data,
            "is_data_correct": is_data_correct,
            "is_codeword_correct": is_codeword_correct,
            "final_error_count": final_errors,
            "aliasing_proof": aliasing_proof,
        }
