#!/usr/bin/env python3
"""
demo_runner.py
==============
Interactive CLI Demonstration for Hamming(7,4) Single vs Double Error Behavior.

Usage:
  python3 demo_runner.py                # Runs the complete guided presentation demo
  python3 demo_runner.py --interactive  # Interactive mode with custom data and error flips
  python3 demo_runner.py --matrix       # Displays G and H matrices and syndrome theory
  python3 demo_runner.py --all-pairs    # Shows exhaustive 21-pair double-error aliasing table
"""

import sys
import argparse
from typing import List
import numpy as np
from src.hamming74 import Hamming74
from src.secded84 import ExtendedHamming84
from src.utils import (
    Colors,
    colorize,
    banner,
    format_bits_table,
    format_syndrome_calculation,
    format_venn_diagram,
    format_aliasing_proof,
)


def run_stage(title: str, stage_num: int, total_stages: int = 4):
    """Prints a styled stage divider."""
    print("\n" + "=" * 76)
    stage_header = f"STAGE {stage_num}/{total_stages}: {title.upper()}"
    print(colorize(f" >>> {stage_header}", Colors.BOLD + Colors.CYAN))
    print("=" * 76)


def demo_guided():
    """
    Carefully staged 4-part presentation walkthrough:
    1. Pristine transmission
    2. Single-error injection & perfect correction
    3. Double-error injection & disastrous false correction (aliasing)
    4. Extended Hamming(8,4) SECDED solution
    """
    print(banner(
        "HAMMING(7,4) SINGLE VS DOUBLE ERROR DEMONSTRATION",
        "Linear Block Codes - Error Correction vs Decoder Aliasing"
    ))

    # Shared sample data: [1, 0, 1, 1]
    data = [1, 0, 1, 1]
    d1, d2, d3, d4 = data

    print(colorize("Input Message Configuration:", Colors.BOLD))
    print(f"  Data bits: d = [d1={d1}, d2={d2}, d3={d3}, d4={d4}] (decimal: {d1*8 + d2*4 + d3*2 + d4*1})")
    p1, p2, p4 = Hamming74.calculate_parity_explicit(d1, d2, d3, d4)
    print(f"  Parity computations (Even Parity):")
    print(f"    p1 = d1 ⊕ d2 ⊕ d4 = {d1} ⊕ {d2} ⊕ {d4} = {p1}")
    print(f"    p2 = d1 ⊕ d3 ⊕ d4 = {d1} ⊕ {d3} ⊕ {d4} = {p2}")
    print(f"    p4 = d2 ⊕ d3 ⊕ d4 = {d2} ⊕ {d3} ⊕ {d4} = {p4}")

    codeword = Hamming74.encode(data)
    print(f"  Encoded 7-bit Codeword: c = {codeword}")
    print(f"  Bit mapping: [p1={codeword[0]}, p2={codeword[1]}, d1={codeword[2]}, "
          f"p4={codeword[3]}, d2={codeword[4]}, d3={codeword[5]}, d4={codeword[6]}]\n")

    # -------------------------------------------------------------
    # STAGE 1: NO ERROR
    # -------------------------------------------------------------
    run_stage("Zero Errors (Pristine Channel)", 1)
    res0 = Hamming74.analyze_behavior(data, flip_positions=[])
    print(format_bits_table(
        res0["transmitted_codeword"],
        res0["received_vector"],
        res0["corrected_vector"],
        res0["flip_positions"],
        res0["corrected_position"],
    ))
    print(format_syndrome_calculation(res0["received_vector"]))
    print(colorize("\n[DECODER VERDICT]:", Colors.BOLD + Colors.GREEN))
    print(f"  Syndrome is [0, 0, 0] (decimal 0).")
    print(f"  Result: {colorize('NO ERROR DETECTED', Colors.BOLD + Colors.GREEN)}. Transmitted data decoded with 100% integrity.")

    input(colorize("\n[Press Enter to proceed to Stage 2: Single Error Correction...]", Colors.YELLOW))

    # -------------------------------------------------------------
    # STAGE 2: SINGLE ERROR CORRECTION
    # -------------------------------------------------------------
    run_stage("Single Error Injection (Safe Correction)", 2)
    flip_single = [3]  # Flipping bit 3 (d1)
    print(f"Injecting single bit flip at position {colorize(str(flip_single[0]), Colors.BOLD + Colors.RED)} (Bit d1)...")
    res1 = Hamming74.analyze_behavior(data, flip_positions=flip_single)

    print(format_bits_table(
        res1["transmitted_codeword"],
        res1["received_vector"],
        res1["corrected_vector"],
        res1["flip_positions"],
        res1["corrected_position"],
    ))
    print(format_syndrome_calculation(res1["received_vector"]))
    print(colorize("\n[DECODER VERDICT]:", Colors.BOLD + Colors.GREEN))
    print(f"  Calculated syndrome: S = {res1['syndrome_bits']} -> Decimal {res1['syndrome_decimal']}.")
    print(f"  Action: Decoder flips bit at position {res1['corrected_position']} ({Hamming74.BIT_ROLES[res1['corrected_position']][0]}).")
    print(f"  Transmitted Data: {res1['transmitted_data']}")
    print(f"  Decoded Data:     {res1['decoded_data']}")
    print(f"  Status: {colorize('SUCCESS! Single error corrected perfectly without data loss.', Colors.BOLD + Colors.GREEN)}")

    input(colorize("\n[Press Enter to proceed to Stage 3: Double Error Miscorrection...]", Colors.YELLOW))

    # -------------------------------------------------------------
    # STAGE 3: DOUBLE ERROR MISCORRECTION (ALIASING)
    # -------------------------------------------------------------
    run_stage("Double Error Injection (Decoder Aliasing / Catastrophic Failure)", 3)
    flip_double = [3, 5]  # Flipping bit 3 (d1) and bit 5 (d2)
    print(f"Injecting TWO bit flips simultaneously at positions {colorize(str(flip_double), Colors.BOLD + Colors.RED)} (Bits d1 and d2)...")
    res2 = Hamming74.analyze_behavior(data, flip_positions=flip_double)

    print(format_bits_table(
        res2["transmitted_codeword"],
        res2["received_vector"],
        res2["corrected_vector"],
        res2["flip_positions"],
        res2["corrected_position"],
    ))
    print(format_syndrome_calculation(res2["received_vector"]))

    print(colorize("\n[DECODER VERDICT - THE CRITICAL FLAW OF ORDINARY HAMMING(7,4)]:", Colors.BOLD + Colors.RED))
    print(f"  Calculated syndrome: S = {res2['syndrome_bits']} -> Decimal {res2['syndrome_decimal']}!")
    print(f"  Because d_min = 3, Hamming(7,4) decoder assumes EVERY non-zero syndrome is a SINGLE error.")
    print(f"  It misidentifies bit {res2['corrected_position']} as the culprit and flips it!")
    print(f"  Transmitted Data: {res2['transmitted_data']}")
    print(f"  Decoded Data:     {res2['decoded_data']}  <-- {colorize('CORRUPTED / WRONG!', Colors.BOLD + Colors.RED)}")
    print(f"  Total errors in final codeword: {colorize(str(res2['final_error_count']) + ' bits corrupted', Colors.BOLD + Colors.BG_RED)}")
    print(f"  The receiver has {colorize('ZERO AWARENESS', Colors.BOLD + Colors.RED)} of the corruption (Silent Failure)!\n")

    print(format_aliasing_proof(flip_double[0], flip_double[1], Hamming74.H))

    input(colorize("\n[Press Enter to proceed to Stage 4: SECDED Solution Comparison...]", Colors.YELLOW))

    # -------------------------------------------------------------
    # STAGE 4: EXTENDED HAMMING(8,4) SECDED
    # -------------------------------------------------------------
    run_stage("The Engineering Solution: Extended Hamming(8,4) SECDED", 4)
    print("How do modern mission-critical systems (ECC RAM, Aerospace) solve this?")
    print("They append an 8th overall parity bit: p0 = ⊕(all 7 bits). This increases d_min from 3 to 4!\n")

    c8 = ExtendedHamming84.encode(data)
    print(f"Transmitted 8-bit SECDED Codeword: {c8}")

    print("\nCase A: SECDED with 1 bit flip at position 3:")
    rx8_single, _ = ExtendedHamming84.inject_errors(c8, [3])
    dec8_single = ExtendedHamming84.decode(rx8_single)
    print(f"  Syndrome = {dec8_single['syndrome_decimal']}, Overall Parity P = {dec8_single['overall_parity']}")
    print(f"  Status: {colorize(dec8_single['status'], Colors.BOLD + Colors.GREEN)} -> {dec8_single['action']}")

    print("\nCase B: SECDED with 2 bit flips at positions [3, 5]:")
    rx8_double, _ = ExtendedHamming84.inject_errors(c8, [3, 5])
    dec8_double = ExtendedHamming84.decode(rx8_double)
    print(f"  Syndrome = {dec8_double['syndrome_decimal']}, Overall Parity P = {dec8_double['overall_parity']}")
    print(f"  Status: {colorize(dec8_double['status'], Colors.BOLD + Colors.BG_YELLOW)} -> {dec8_double['action']}")

    print("\n" + "=" * 76)
    print(colorize("  DEMONSTRATION COMPLETE: KEY TAKEAWAYS", Colors.BOLD + Colors.CYAN))
    print("=" * 76)
    print("  1. Hamming(7,4) achieves d_min = 3, allowing guaranteed 1-bit error correction.")
    print("  2. When 2 errors occur, ordinary Hamming(7,4) CANNOT detect or correct them safely.")
    print("  3. Instead, the 2 errors ALIAS into a 3rd bit, causing the decoder to flip an")
    print("     uncorrupted bit, resulting in 3 corrupted bits and silent data loss.")
    print("  4. Safe double-error handling requires SECDED Hamming(8,4) with d_min = 4.")
    print("=" * 76 + "\n")


def demo_interactive():
    """Interactive mode allowing user-specified data and flip positions."""
    print(banner("HAMMING(7,4) INTERACTIVE LAB"))
    print("Enter custom 4-bit binary data (e.g., 1011) or press enter for default [1, 0, 1, 1]:")

    try:
        user_input = input(">> 4-bit data: ").strip()
        if not user_input:
            data = [1, 0, 1, 1]
        else:
            data = [int(b) for b in user_input.replace(" ", "")]
            if len(data) != 4 or not all(b in (0, 1) for b in data):
                raise ValueError("Must be exactly 4 binary bits (0 or 1).")
    except Exception as e:
        print(colorize(f"Invalid input: {e}. Using default [1, 0, 1, 1].", Colors.RED))
        data = [1, 0, 1, 1]

    tx_cw = Hamming74.encode(data)
    print(f"\nTransmitted 4-bit data:    {data}")
    print(f"Generated 7-bit codeword:  {tx_cw}")
    print(f"Bit positions:             [p1, p2, d1, p4, d2, d3, d4]")
    print(f"Indices:                   [ 1,  2,  3,  4,  5,  6,  7 ]")

    print("\nChoose error scenario to simulate:")
    print("  0: No errors (0 flips)")
    print("  1: Single error (1 flip at position 1..7)")
    print("  2: Double error (2 flips at positions 1..7)")
    print("  c: Custom flip list (e.g. 2 6)")

    choice = input(">> Scenario (0/1/2/c): ").strip().lower()

    if choice == "0":
        flips = []
    elif choice == "1":
        pos_str = input(">> Enter bit position to flip (1 to 7) [default 3]: ").strip()
        flips = [int(pos_str)] if pos_str else [3]
    elif choice == "2":
        pos_str = input(">> Enter TWO bit positions to flip separated by space (e.g., 3 5): ").strip()
        flips = [int(x) for x in pos_str.split()] if pos_str else [3, 5]
    elif choice == "c":
        pos_str = input(">> Enter positions separated by space: ").strip()
        flips = [int(x) for x in pos_str.split()]
    else:
        print("Unknown option. Running with flips [3, 5] (double error).")
        flips = [3, 5]

    res = Hamming74.analyze_behavior(data, flips)

    print("\n" + "-" * 76)
    print(format_bits_table(
        res["transmitted_codeword"],
        res["received_vector"],
        res["corrected_vector"],
        res["flip_positions"],
        res["corrected_position"],
    ))
    print(format_syndrome_calculation(res["received_vector"]))
    print("-" * 76)

    print(colorize(f"Outcome: {res['outcome']}", Colors.BOLD + (Colors.GREEN if res['is_data_correct'] else Colors.RED)))
    print(f"Details: {res['interpretation']}")
    if len(flips) == 2:
        print("\n" + format_aliasing_proof(flips[0], flips[1], Hamming74.H))


def demo_matrix():
    """Displays the generator and parity-check matrices and syndrome mappings."""
    print(banner("HAMMING(7,4) MATHEMATICAL STRUCTURE"))

    print(colorize("1. Generator Matrix G (4 x 7):", Colors.BOLD + Colors.CYAN))
    print("   c = d · G (mod 2)")
    print("      p1  p2  d1  p4  d2  d3  d4")
    for i, row in enumerate(Hamming74.G):
        print(f"  d{i+1}: {row.tolist()}")

    print(colorize("\n2. Parity-Check Matrix H (3 x 7):", Colors.BOLD + Colors.CYAN))
    print("   S = H · r^T (mod 2)")
    print("      c1  c2  c3  c4  c5  c6  c7")
    for i, row in enumerate(Hamming74.H):
        print(f"  s{i+1}: {row.tolist()}")

    print(colorize("\n3. Column Syndrome Mapping (Binary to Decimal):", Colors.BOLD + Colors.CYAN))
    print("   Bit Index (i) | Bit Role | Binary col_i(H) | Syndrome S = [s1, s2, s3]")
    print("   " + "-" * 65)
    for pos in range(1, 8):
        role, desc = Hamming74.BIT_ROLES[pos]
        col = Hamming74.H[:, pos - 1].tolist()
        bin_rep = f"{pos:03b}"
        print(f"        {pos}        |    {role:<4}  |       {bin_rep}       | {col} -> Decimal {pos}")
    print("   " + "-" * 65)
    print("   Notice: Every column corresponds to the binary representation of its 1-based index!\n")


def demo_all_pairs():
    """Exhaustive table of all 21 possible 2-bit error combinations and their aliased syndrome."""
    from itertools import combinations

    print(banner("ALL 21 DOUBLE-ERROR PAIRS AND THEIR ALIASED SYNDROMES"))
    print("Ordinary Hamming(7,4) with 7 bit positions has C(7,2) = 21 double-error combinations.")
    print("Below is the exact aliasing behavior for EVERY possible 2-bit error pair:\n")

    print("  Pair # | Injected Flips | col_i ⊕ col_j = Sum Column | Aliased Bit | Resulting State")
    print("  " + "-" * 75)

    pair_idx = 1
    for (i, j) in combinations(range(1, 8), 2):
        col_i = Hamming74.H[:, i - 1]
        col_j = Hamming74.H[:, j - 1]
        sum_col = (col_i + col_j) % 2

        # Find match
        alias_k = -1
        for k in range(1, 8):
            if np.array_equal(Hamming74.H[:, k - 1], sum_col):
                alias_k = k
                break

        print(f"    {pair_idx:02d}   |   Bits [{i}, {j}]    |    {col_i.tolist()} ⊕ {col_j.tolist()} = {sum_col.tolist()}   |    Bit {alias_k}    | Decoder corrupts bit {alias_k} (3 errors!)")
        pair_idx += 1

    print("  " + "-" * 75)
    print(colorize("  MATHEMATICAL FACT: 100% of double errors alias into another valid 1-bit syndrome!", Colors.BOLD + Colors.RED))
    print(colorize("  Not a single 2-bit error can be safely corrected by ordinary Hamming(7,4)!", Colors.BOLD + Colors.RED))
    print()


def main():
    parser = argparse.ArgumentParser(description="Hamming(7,4) Demonstration Runner")
    parser.add_argument("--interactive", action="store_true", help="Launch interactive bit-flip testing")
    parser.add_argument("--matrix", action="store_true", help="Display G, H matrices and syndrome mapping")
    parser.add_argument("--all-pairs", action="store_true", help="Display all 21 double-error aliasing pairs")
    parser.add_argument("--lecture", action="store_true", help="30-Minute lecture mode with step-by-step pauses")
    args = parser.parse_args()

    if args.interactive:
        demo_interactive()
    elif args.matrix:
        demo_matrix()
    elif args.all_pairs:
        demo_all_pairs()
    else:
        demo_guided()


if __name__ == "__main__":
    main()
