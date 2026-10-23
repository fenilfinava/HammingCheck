"""
backend/app/secded84.py
=======================
Extended Hamming(8,4) SECDED Codec for FastAPI Backend.
"""

from typing import List, Dict, Any
from .hamming74 import Hamming74


class ExtendedHamming84:
    @classmethod
    def encode(cls, data_bits: List[int]) -> List[int]:
        c7 = Hamming74.encode(data_bits)
        p0 = sum(c7) % 2
        return c7 + [p0]

    @classmethod
    def decode(cls, received8: List[int]) -> Dict[str, Any]:
        if len(received8) != 8:
            raise ValueError("Expected 8-bit vector for SECDED.")

        r7 = received8[:7]
        r_p0 = received8[7]

        syndrome_bits, syndrome_dec = Hamming74.calculate_syndrome(r7)
        overall_parity = sum(received8) % 2

        corrected7 = list(r7)
        corrected_p0 = r_p0
        status = ""
        action = ""
        is_safe = False

        if syndrome_dec == 0 and overall_parity == 0:
            status = "NO_ERROR"
            action = "Codeword pristine. 100% verified."
            is_safe = True
        elif syndrome_dec != 0 and overall_parity == 1:
            status = "SINGLE_ERROR_CORRECTED"
            corrected7[syndrome_dec - 1] ^= 1
            action = f"Single bit error at position {syndrome_dec} corrected."
            is_safe = True
        elif syndrome_dec == 0 and overall_parity == 1:
            status = "PARITY_BIT_ERROR"
            corrected_p0 ^= 1
            action = "Parity bit p0 corrupted. Data bits are pristine."
            is_safe = True
        elif syndrome_dec != 0 and overall_parity == 0:
            status = "DOUBLE_ERROR_DETECTED"
            action = f"Double error detected! Syndrome {syndrome_dec} is aliased. False correction halted!"
            is_safe = False

        decoded_data = Hamming74.extract_data(corrected7)

        return {
            "received8": received8,
            "syndrome_bits": syndrome_bits,
            "syndrome_decimal": syndrome_dec,
            "overall_parity": overall_parity,
            "status": status,
            "action": action,
            "is_safe": is_safe,
            "corrected8": corrected7 + [corrected_p0],
            "decoded_data": decoded_data,
        }
