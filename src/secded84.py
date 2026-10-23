"""
secded84.py
===========
Extended Hamming(8,4) SECDED (Single Error Correction, Double Error Detection) Implementation.

Contrasted directly with ordinary Hamming(7,4):
- Ordinary Hamming(7,4) has d_min = 3. When 2 errors occur, it ALIASES into a 1-bit error and miscorrects.
- Extended Hamming(8,4) adds an 8th overall parity bit p0 covering all 7 bits:
    p0 = p1 ⊕ p2 ⊕ d1 ⊕ p4 ⊕ d2 ⊕ d3 ⊕ d4
- d_min increases from 3 to 4.
  -> t_corr = 1 (single error correction)
  -> t_det = 2 (double error detection)

Decoding Rule:
  Overall Parity Check: P = (sum of all 8 received bits) mod 2
  Syndrome S from first 7 bits = H · r_7^T (mod 2)

  Cases:
  1. S == 0 and P == 0:
     -> No errors detected. Pristine codeword.
  2. S != 0 and P == 1:
     -> Single error occurred within the 7 Hamming bits at position S.
     -> SAFE TO CORRECT: Flip bit at position S.
  3. S == 0 and P == 1:
     -> Single error occurred on the 8th parity bit (p0) itself.
     -> Data bits are completely untouched and correct.
  4. S != 0 and P == 0:
     -> DOUBLE ERROR DETECTED!
     -> Two bit flips occurred. SECDED recognizes that S is an aliased syndrome.
     -> The system raises an alarm and REFUSES to perform a false correction!
"""

from typing import List, Tuple, Dict, Any
import numpy as np
from src.hamming74 import Hamming74


class ExtendedHamming84:
    """
    Extended Hamming(8,4) SECDED Codec.
    """

    @classmethod
    def encode(cls, data_bits: List[int]) -> List[int]:
        """
        Encodes 4 data bits into an 8-bit SECDED codeword:
        [p1, p2, d1, p4, d2, d3, d4, p0]
        where p0 is the overall parity bit (position 8, 1-indexed).
        """
        c7 = Hamming74.encode(data_bits)
        p0 = sum(c7) % 2
        return c7 + [p0]

    @classmethod
    def inject_errors(cls, codeword8: List[int], flip_positions: List[int]) -> Tuple[List[int], List[int]]:
        """
        Injects bit flips at 1-indexed positions 1..8.
        """
        if len(codeword8) != 8:
            raise ValueError("Codeword must have length 8.")

        corrupted = list(codeword8)
        error_vector = [0] * 8
        for pos in flip_positions:
            if not (1 <= pos <= 8):
                raise ValueError(f"Position {pos} out of range [1, 8].")
            corrupted[pos - 1] ^= 1
            error_vector[pos - 1] ^= 1

        return corrupted, error_vector

    @classmethod
    def decode(cls, received8: List[int]) -> Dict[str, Any]:
        """
        Decodes an 8-bit SECDED received vector.
        Differentiates between:
        - NO_ERROR
        - SINGLE_ERROR_CORRECTED (positions 1..7)
        - SINGLE_PARITY_ERROR_CORRECTED (position 8)
        - DOUBLE_ERROR_DETECTED (system flags uncorrectable error, prevents aliasing)
        """
        if len(received8) != 8:
            raise ValueError("Received vector must have length 8.")

        r7 = received8[:7]
        r_p0 = received8[7]

        # Calculate 7-bit syndrome
        syndrome_bits, syndrome_dec = Hamming74.calculate_syndrome(r7)

        # Calculate overall parity check over all 8 bits
        overall_parity = sum(received8) % 2

        corrected7 = list(r7)
        corrected_p0 = r_p0
        status = ""
        action = ""
        is_safe = False

        if syndrome_dec == 0 and overall_parity == 0:
            status = "NO_ERROR"
            action = "Accept codeword without changes."
            is_safe = True

        elif syndrome_dec != 0 and overall_parity == 1:
            status = "SINGLE_ERROR_CORRECTED"
            corrected7[syndrome_dec - 1] ^= 1
            action = f"Flipped corrupted bit at position {syndrome_dec}. Data fully restored."
            is_safe = True

        elif syndrome_dec == 0 and overall_parity == 1:
            status = "PARITY_BIT_ERROR"
            corrected_p0 ^= 1
            action = "Bit 8 (overall parity bit p0) was corrupted. Data bits are pristine."
            is_safe = True

        elif syndrome_dec != 0 and overall_parity == 0:
            status = "DOUBLE_ERROR_DETECTED"
            action = (
                f"Double error detected! Syndrome {syndrome_dec} is an alias. "
                "SECDED refuses to corrupt a 3rd bit. Retransmission / uncorrectable fault raised!"
            )
            is_safe = False  # Detected, but not correctable

        extracted_data = Hamming74.extract_data(corrected7)

        return {
            "received8": received8,
            "syndrome_bits": syndrome_bits,
            "syndrome_decimal": syndrome_dec,
            "overall_parity": overall_parity,
            "status": status,
            "action": action,
            "is_safe": is_safe,
            "corrected8": corrected7 + [corrected_p0],
            "decoded_data": extracted_data,
        }
