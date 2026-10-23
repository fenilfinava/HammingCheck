"""
utils.py
========
Terminal formatting, ASCII visualizations, and matrix display helpers
for the Hamming(7,4) demonstration.
"""

from typing import List, Tuple, Dict, Any
import numpy as np


# ANSI Color formatting
class Colors:
    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    RESET = "\033[0m"
    BG_RED = "\033[41m\033[97m"
    BG_GREEN = "\033[42m\033[97m"
    BG_YELLOW = "\033[43m\033[30m"
    BG_BLUE = "\033[44m\033[97m"


def colorize(text: str, color: str) -> str:
    """Wraps text in ANSI color codes."""
    return f"{color}{text}{Colors.RESET}"


def banner(title: str, subtitle: str = "") -> str:
    """Returns a formatted CLI banner."""
    width = 76
    border = "=" * width
    lines = [
        "",
        colorize(border, Colors.CYAN),
        colorize(f"  {title.center(width - 4)}", Colors.BOLD + Colors.CYAN),
    ]
    if subtitle:
        lines.append(colorize(f"  {subtitle.center(width - 4)}", Colors.YELLOW))
    lines.append(colorize(border, Colors.CYAN))
    lines.append("")
    return "\n".join(lines)


def format_bits_table(
    tx: List[int],
    rx: List[int],
    corrected: List[int],
    flip_positions: List[int],
    decoder_flipped: int,
) -> str:
    """
    Renders an ASCII table comparing Transmitted, Received, and Corrected codewords bit by bit.
    """
    labels = ["p1", "p2", "d1", "p4", "d2", "d3", "d4"]
    positions = [1, 2, 3, 4, 5, 6, 7]

    header_pos = "  Index (1-7):   " + "   ".join(f"[{p}]" for p in positions)
    header_lbl = "  Bit Type:      " + "   ".join(f" {lbl}" for lbl in labels)

    # Transmitted
    tx_str = "  Transmitted:   "
    for b in tx:
        tx_str += f"  {colorize(str(b), Colors.GREEN)}  "

    # Received (highlight injected flips)
    rx_str = "  Received:      "
    for i, b in enumerate(rx):
        pos = i + 1
        if pos in flip_positions:
            rx_str += f" {colorize(f'[{b}]', Colors.BG_RED)} "
        else:
            rx_str += f"  {b}  "

    # Corrected (highlight decoder action)
    cor_str = "  Corrected:     "
    for i, b in enumerate(corrected):
        pos = i + 1
        if pos == decoder_flipped:
            cor_str += f" {colorize(f'({b})', Colors.BG_YELLOW)} "
        else:
            cor_str += f"  {b}  "

    divider = "  " + "-" * 62
    return "\n".join([divider, header_pos, header_lbl, divider, tx_str, rx_str, cor_str, divider])


def format_syndrome_calculation(received: List[int]) -> str:
    """
    Formats the detailed matrix multiplication S = H · r^T (mod 2) with explicit XOR operations.
    """
    r = received
    # p1 check: bits 1, 3, 5, 7 -> indices 0, 2, 4, 6
    s1_calc = f"r[1] ⊕ r[3] ⊕ r[5] ⊕ r[7] = {r[0]} ⊕ {r[2]} ⊕ {r[4]} ⊕ {r[6]} = {(r[0] ^ r[2] ^ r[4] ^ r[6])}"
    s1_val = r[0] ^ r[2] ^ r[4] ^ r[6]

    # p2 check: bits 2, 3, 6, 7 -> indices 1, 2, 5, 6
    s2_calc = f"r[2] ⊕ r[3] ⊕ r[6] ⊕ r[7] = {r[1]} ⊕ {r[2]} ⊕ {r[5]} ⊕ {r[6]} = {(r[1] ^ r[2] ^ r[5] ^ r[6])}"
    s2_val = r[1] ^ r[2] ^ r[5] ^ r[6]

    # p4 check: bits 4, 5, 6, 7 -> indices 3, 4, 5, 6
    s3_calc = f"r[4] ⊕ r[5] ⊕ r[6] ⊕ r[7] = {r[3]} ⊕ {r[4]} ⊕ {r[5]} ⊕ {r[6]} = {(r[3] ^ r[4] ^ r[5] ^ r[6])}"
    s3_val = r[3] ^ r[4] ^ r[5] ^ r[6]

    dec_val = s1_val * 1 + s2_val * 2 + s3_val * 4

    lines = [
        colorize("  Syndrome Vector Calculation: S = H · r^T (mod 2)", Colors.BOLD),
        f"    Row 1 (checks {{1, 3, 5, 7}}):  s1 = {s1_calc}",
        f"    Row 2 (checks {{2, 3, 6, 7}}):  s2 = {s2_calc}",
        f"    Row 3 (checks {{4, 5, 6, 7}}):  s3 = {s3_calc}",
        "",
        f"    Binary Syndrome  S = [s1, s2, s3] = [{s1_val}, {s2_val}, {s3_val}]",
        f"    Decimal Position = s1*(1) + s2*(2) + s3*(4) = {s1_val}*1 + {s2_val}*2 + {s3_val}*4 = {colorize(str(dec_val), Colors.BOLD + Colors.CYAN)}",
    ]
    return "\n".join(lines)


def format_venn_diagram(codeword: List[int]) -> str:
    """
    Renders an ASCII text-based Venn diagram showing the three parity circles
    and where bits {p1, p2, p4, d1, d2, d3, d4} reside.
    """
    # Bit values:
    p1, p2, d1, p4, d2, d3, d4 = codeword

    venn = f"""
  +--------------------------------------------------------------+
  |                   HAMMING(7,4) VENN DIAGRAM                  |
  +--------------------------------------------------------------+
  |                                                              |
  |             Circle 1 (p1)                 Circle 2 (p2)      |
  |          +------------------+         +------------------+   |
  |          |                  |         |                  |   |
  |          |     p1=[{p1}]      |  d1=[{d1}]  |     p2=[{p2}]      |   |
  |          |                  |         |                  |   |
  |          |        d2=[{d2}]   +---------+   d3=[{d3}]        |   |
  |          |                  | d4=[{d4}] |                  |   |
  |          +------------------+---------+------------------+   |
  |                             |         |                      |
  |                             |  p4=[{p4}]  |                      |
  |                             |         |                      |
  |                             +---------+                      |
  |                            Circle 3 (p4)                     |
  |                                                              |
  |  Circle 1 = {{p1, d1, d2, d4}} (pos 1, 3, 5, 7)              |
  |  Circle 2 = {{p2, d1, d3, d4}} (pos 2, 3, 6, 7)              |
  |  Circle 3 = {{p4, d2, d3, d4}} (pos 4, 5, 6, 7)              |
  +--------------------------------------------------------------+
    """
    return colorize(venn, Colors.BLUE)


def format_aliasing_proof(pos1: int, pos2: int, H: np.ndarray) -> str:
    """
    Mathematical proof display explaining why 2 errors alias into a single bit error.
    """
    col1 = H[:, pos1 - 1]
    col2 = H[:, pos2 - 1]
    sum_col = (col1 + col2) % 2

    # Find which column equals sum_col
    alias_pos = -1
    for i in range(7):
        if np.array_equal(H[:, i], sum_col):
            alias_pos = i + 1
            break

    lines = [
        colorize("  [MATHEMATICAL PROOF OF DOUBLE ERROR ALIASING]", Colors.BOLD + Colors.YELLOW),
        f"  1. Linear block property: S(e) = H · e^T (mod 2).",
        f"  2. Transmitted codeword c has H · c^T = 0.",
        f"  3. Received vector with 2 errors at positions {pos1} and {pos2}:",
        f"       r = c ⊕ e_{pos1} ⊕ e_{pos2}",
        f"  4. Syndrome calculation expands by linearity:",
        f"       S = H · (c ⊕ e_{pos1} ⊕ e_{pos2})^T",
        f"         = H·c^T ⊕ H·e_{pos1}^T ⊕ H·e_{pos2}^T",
        f"         = 0 ⊕ col_{pos1}(H) ⊕ col_{pos2}(H)",
        f"  5. Column vectors in H:",
        f"       col_{pos1}(H) = {col1.tolist()}^T",
        f"       col_{pos2}(H) = {col2.tolist()}^T",
        f"       Sum (mod 2)   = {sum_col.tolist()}^T",
        f"  6. Since H contains ALL 7 non-zero 3-bit binary patterns, the sum of",
        f"     any two distinct columns is GUARANTEED to match a 3rd column:",
        f"       col_{pos1}(H) ⊕ col_{pos2}(H) ≡ col_{colorize(str(alias_pos), Colors.BOLD + Colors.RED)}(H)",
        f"  7. CONSEQUENCE:",
        f"       The ordinary Hamming(7,4) decoder receives S = {sum_col.tolist()}^T (decimal {alias_pos}).",
        f"       It CANNOT know two errors occurred; it assumes a SINGLE error occurred at bit {alias_pos}!",
        f"       It flips bit {alias_pos}, turning 2 errors into {colorize('3 CORRUPTED BITS', Colors.BOLD + Colors.RED)}!",
        f"       Decoded data is corrupt, and NO WARNING is given!",
    ]
    return "\n".join(lines)
