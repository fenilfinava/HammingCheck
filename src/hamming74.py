"""
hamming74.py
============
Reference implementation of the classical Hamming(7,4) Single-Error-Correcting (SEC) Code.

Key Parameters:
- Codeword length (n): 7 bits
- Message length (k): 4 data bits
- Parity bits (r = n - k): 3 bits
- Code rate R = k / n = 4 / 7 ≈ 0.571
- Minimum Hamming distance (d_min): 3
  -> Error detection capability: t_det <= d_min - 1 = 2
  -> Error correction capability: t_corr <= floor((d_min - 1) / 2) = 1

Bit Arrangement (1-indexed power-of-2 parity positions):
  Index:   1    2    3    4    5    6    7
  Type:   p1   p2   d1   p4   d2   d3   d4
  Binary: 001  010  011  100  101  110  111

Parity Equations (Even Parity, mod 2):
  p1 = d1 ⊕ d2 ⊕ d4   (checks indices with 1st bit = 1: {1, 3, 5, 7})
  p2 = d1 ⊕ d3 ⊕ d4   (checks indices with 2nd bit = 1: {2, 3, 6, 7})
  p4 = d2 ⊕ d3 ⊕ d4   (checks indices with 3rd bit = 1: {4, 5, 6, 7})

Syndrome Calculation:
  S = H · r^T (mod 2) = [s1, s2, s3]^T
  Syndrome Decimal = s1 * 1 + s2 * 2 + s3 * 4
  If S == 0: No error detected.
  If S != 0: S points to the exact bit index to flip.
"""

from typing import List, Tuple, Dict, Any, Union
import numpy as np


class Hamming74:
    """
    Hamming(7,4) Codec with comprehensive step-by-step diagnostic capabilities.
    """

    # Parity check matrix H (3 x 7)
    # Columns correspond to binary representations of 1 to 7:
    # col 1 = [1, 0, 0]^T (1 = 001)
    # col 2 = [0, 1, 0]^T (2 = 010)
    # col 3 = [1, 1, 0]^T (3 = 011)
    # col 4 = [0, 0, 1]^T (4 = 100)
    # col 5 = [1, 0, 1]^T (5 = 101)
    # col 6 = [0, 1, 1]^T (6 = 110)
    # col 7 = [1, 1, 1]^T (7 = 111)
    H = np.array([
        [1, 0, 1, 0, 1, 0, 1],  # Row checks indices with bit 0 set: 1, 3, 5, 7
        [0, 1, 1, 0, 0, 1, 1],  # Row checks indices with bit 1 set: 2, 3, 6, 7
        [0, 0, 0, 1, 1, 1, 1],  # Row checks indices with bit 2 set: 4, 5, 6, 7
    ], dtype=int)

    # Generator matrix G (4 x 7) such that c = d * G (mod 2)
    # Data vector d = [d1, d2, d3, d4]
    # Codeword c = [p1, p2, d1, p4, d2, d3, d4]
    # p1 = d1 ⊕ d2 ⊕ d4 -> col 1: [1, 1, 0, 1]
    # p2 = d1 ⊕ d3 ⊕ d4 -> col 2: [1, 0, 1, 1]
    # d1 = d1           -> col 3: [1, 0, 0, 0]
    # p4 = d2 ⊕ d3 ⊕ d4 -> col 4: [0, 1, 1, 1]
    # d2 = d2           -> col 5: [0, 1, 0, 0]
    # d3 = d3           -> col 6: [0, 0, 1, 0]
    # d4 = d4           -> col 7: [0, 0, 0, 1]
    G = np.array([
        [1, 1, 1, 0, 0, 0, 0],  # coefficients for d1
        [1, 0, 0, 1, 1, 0, 0],  # coefficients for d2
        [0, 1, 0, 1, 0, 1, 0],  # coefficients for d3
        [1, 1, 0, 1, 0, 0, 1],  # coefficients for d4
    ], dtype=int)

    # Bit role mapping: position (1-7) -> description
    BIT_ROLES = {
        1: ("p1", "Parity 1 (checks 1, 3, 5, 7)"),
        2: ("p2", "Parity 2 (checks 2, 3, 6, 7)"),
        3: ("d1", "Data 1"),
        4: ("p4", "Parity 4 (checks 4, 5, 6, 7)"),
        5: ("d2", "Data 2"),
        6: ("d3", "Data 3"),
        7: ("d4", "Data 4"),
    }

    # Data bit indices in the 7-bit codeword (1-indexed: 3, 5, 6, 7 -> 0-indexed: 2, 4, 5, 6)
    DATA_INDICES_0BASED = [2, 4, 5, 6]
    PARITY_INDICES_0BASED = [0, 1, 3]

    @classmethod
    def encode(cls, data_bits: List[int]) -> List[int]:
        """
        Encodes a 4-bit data vector [d1, d2, d3, d4] into a 7-bit Hamming codeword.

        Parameters:
            data_bits: list of 4 integers (each 0 or 1).

        Returns:
            codeword: list of 7 integers [p1, p2, d1, p4, d2, d3, d4].
        """
        if len(data_bits) != 4 or not all(b in (0, 1) for b in data_bits):
            raise ValueError("Data bits must be a list of 4 binary values (0 or 1).")

        d = np.array(data_bits, dtype=int)
        # c = d * G (mod 2)
        c = np.dot(d, cls.G) % 2
        return c.tolist()

    @classmethod
    def calculate_parity_explicit(cls, d1: int, d2: int, d3: int, d4: int) -> Tuple[int, int, int]:
        """
        Explicit parity computation using XOR formulas.
        """
        p1 = d1 ^ d2 ^ d4
        p2 = d1 ^ d3 ^ d4
        p4 = d2 ^ d3 ^ d4
        return p1, p2, p4

    @classmethod
    def inject_errors(cls, codeword: List[int], flip_positions: List[int]) -> Tuple[List[int], List[int]]:
        """
        Injects bit flips at specified 1-indexed positions (1 to 7).

        Parameters:
            codeword: 7-bit codeword list.
            flip_positions: list of 1-based indices to flip (e.g. [3] for single error, [3, 5] for double).

        Returns:
            received_vector: corrupted 7-bit vector.
            error_vector: 7-bit vector with 1s at flipped positions.
        """
        if len(codeword) != 7:
            raise ValueError("Codeword must have length 7.")

        corrupted = list(codeword)
        error_vector = [0] * 7

        for pos in flip_positions:
            if not (1 <= pos <= 7):
                raise ValueError(f"Flip position {pos} is out of range [1, 7].")
            idx = pos - 1
            corrupted[idx] ^= 1
            error_vector[idx] ^= 1

        return corrupted, error_vector

    @classmethod
    def calculate_syndrome(cls, received: List[int]) -> Tuple[List[int], int]:
        """
        Calculates the 3-bit syndrome S = H · r^T (mod 2) and its decimal value.

        Parameters:
            received: 7-bit received vector.

        Returns:
            syndrome_bits: [s1, s2, s3] where s1 is mod 2 sum of {1,3,5,7}, etc.
            syndrome_decimal: integer 0..7 pointing to the detected error position.
        """
        if len(received) != 7:
            raise ValueError("Received vector must have length 7.")

        r = np.array(received, dtype=int)
        # S = H * r^T (mod 2)
        s = np.dot(cls.H, r) % 2
        syndrome_bits = s.tolist()

        # Decimal value = s1*1 + s2*2 + s3*4
        syndrome_decimal = int(syndrome_bits[0] * 1 + syndrome_bits[1] * 2 + syndrome_bits[2] * 4)
        return syndrome_bits, syndrome_decimal

    @classmethod
    def correct(cls, received: List[int], syndrome_decimal: int) -> Tuple[List[int], int]:
        """
        Corrects the received vector based on the syndrome.
        If syndrome == 0, returns received unchanged.
        If syndrome != 0, flips the bit at index = syndrome_decimal (1-indexed).

        Returns:
            corrected_vector: 7-bit vector after correction.
            flipped_index: 1-indexed position flipped (0 if no flip).
        """
        corrected = list(received)
        if syndrome_decimal == 0:
            return corrected, 0

        idx = syndrome_decimal - 1
        corrected[idx] ^= 1
        return corrected, syndrome_decimal

    @classmethod
    def extract_data(cls, codeword: List[int]) -> List[int]:
        """
        Extracts the 4 data bits [d1, d2, d3, d4] from positions [3, 5, 6, 7].
        """
        return [codeword[i] for i in cls.DATA_INDICES_0BASED]

    @classmethod
    def decode(cls, received: List[int]) -> Dict[str, Any]:
        """
        Full decoding pipeline on a received 7-bit word.
        Returns a dictionary with syndrome, corrected codeword, extracted data, and diagnosis.
        """
        syndrome_bits, syndrome_decimal = cls.calculate_syndrome(received)
        corrected_vector, corrected_pos = cls.correct(received, syndrome_decimal)
        extracted_data = cls.extract_data(corrected_vector)

        return {
            "received_vector": list(received),
            "syndrome_bits": syndrome_bits,
            "syndrome_decimal": syndrome_decimal,
            "has_error": syndrome_decimal != 0,
            "corrected_position": corrected_pos,
            "corrected_vector": corrected_vector,
            "decoded_data": extracted_data,
        }

    @classmethod
    def analyze_behavior(
        cls,
        data_bits: List[int],
        flip_positions: List[int]
    ) -> Dict[str, Any]:
        """
        End-to-end simulation comparing true transmitted codeword with decoded result.
        Explicitly flags whether single-error correction succeeded or double-error aliasing occurred.

        Parameters:
            data_bits: original 4-bit message.
            flip_positions: 1-indexed list of injected bit flips.

        Returns:
            Comprehensive diagnostic dictionary.
        """
        tx_codeword = cls.encode(data_bits)
        rx_vector, error_vector = cls.inject_errors(tx_codeword, flip_positions)
        decode_result = cls.decode(rx_vector)

        num_flips = len(flip_positions)
        syndrome_dec = decode_result["syndrome_decimal"]
        decoded_data = decode_result["decoded_data"]
        corrected_vector = decode_result["corrected_vector"]

        # Evaluation metrics
        is_data_correct = (decoded_data == data_bits)
        is_codeword_correct = (corrected_vector == tx_codeword)
        final_errors_in_codeword = sum(
            c != t for c, t in zip(corrected_vector, tx_codeword)
        )

        # Categorize behavior
        if num_flips == 0:
            outcome = "CORRECT_NO_ERROR"
            interpretation = "Zero errors transmitted. Syndrome is [0,0,0]. Codeword accepted as pristine."
        elif num_flips == 1:
            if is_data_correct and is_codeword_correct:
                outcome = "SINGLE_ERROR_SUCCESSFULLY_CORRECTED"
                interpretation = (
                    f"Single error injected at bit {flip_positions[0]}. "
                    f"Syndrome {syndrome_dec} pinpointed exact bit. Corrected with 100% fidelity."
                )
            else:
                outcome = "SINGLE_ERROR_FAILED"
                interpretation = "Unexpected single error failure."
        elif num_flips == 2:
            # Ordinary Hamming(7,4) CANNOT detect or correct double error safely.
            # It always aliases into a single-bit error at col_i XOR col_j!
            outcome = "DOUBLE_ERROR_MISCORRECTION_ALIASING"
            interpretation = (
                f"TWO errors injected at bits {flip_positions}. "
                f"Ordinary Hamming(7,4) falsely calculated syndrome {syndrome_dec} (which equals col_{flip_positions[0]} ⊕ col_{flip_positions[1]}). "
                f"Decoder mistakenly flipped bit {syndrome_dec}. "
                f"Result: Final codeword now has {final_errors_in_codeword} bit errors! "
                f"Decoded data is {'WRONG' if not is_data_correct else 'COINCIDENTALLY MATCHING DATA BITS BUT CODEWORD HAS 3 CORRUPTIONS'}."
            )
        else:
            outcome = f"MULTI_ERROR_{num_flips}"
            interpretation = f"{num_flips} errors injected. Beyond Hamming(7,4) specifications."

        return {
            "transmitted_data": data_bits,
            "transmitted_codeword": tx_codeword,
            "flip_positions": flip_positions,
            "num_flips": num_flips,
            "error_vector": error_vector,
            "received_vector": rx_vector,
            "syndrome_bits": decode_result["syndrome_bits"],
            "syndrome_decimal": syndrome_dec,
            "corrected_position": decode_result["corrected_position"],
            "corrected_vector": corrected_vector,
            "decoded_data": decoded_data,
            "is_data_correct": is_data_correct,
            "is_codeword_correct": is_codeword_correct,
            "final_error_count": final_errors_in_codeword,
            "outcome": outcome,
            "interpretation": interpretation,
        }
