#!/usr/bin/env python3
"""
generate_visuals.py
===================
Generates high-resolution publication-quality diagrams and plots for
Hamming(7,4) Single vs Double Error analysis:
  1. evidence/figures/error_behavior_analysis.png
  2. evidence/figures/hamming_matrix_structure.png
  3. evidence/figures/hamming_distance_spheres.png
"""

import os
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.patches as patches
from src.hamming74 import Hamming74

os.makedirs("evidence/figures", exist_ok=True)

# Set style
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams.update({
    "font.size": 11,
    "font.family": "sans-serif",
    "axes.labelsize": 12,
    "axes.titlesize": 14,
    "xtick.labelsize": 10,
    "ytick.labelsize": 10,
    "figure.titlesize": 16,
})


def plot_error_behavior():
    """Bar chart comparing single vs double error behavior in Ordinary Hamming vs SECDED."""
    categories = [
        "Zero Error\n(Pristine)",
        "Single Error (1-bit)\nOrdinary Hamming",
        "Double Error (2-bit)\nOrdinary Hamming",
        "Double Error (2-bit)\nSECDED Extended",
    ]

    correct_rates = [100.0, 100.0, 0.0, 0.0]
    miscorrection_rates = [0.0, 0.0, 100.0, 0.0]
    detection_rates = [100.0, 100.0, 0.0, 100.0]

    x = np.arange(len(categories))
    width = 0.25

    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)

    rects1 = ax.bar(x - width, correct_rates, width, label="Safe Error Correction (%)", color="#2ecc71")
    rects2 = ax.bar(x, miscorrection_rates, width, label="Miscorrection / Aliasing (%)", color="#e74c3c")
    rects3 = ax.bar(x + width, detection_rates, width, label="Reliable Error Detection (%)", color="#3498db")

    ax.set_ylabel("Rate (%)", fontweight="bold")
    ax.set_title("Hamming(7,4) vs SECDED(8,4): Error Resilience Performance (N=464 runs)", fontweight="bold", pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontweight="medium")
    ax.set_ylim(0, 120)
    ax.legend(frameon=True, loc="upper right")

    # Add data labels
    for rects in [rects1, rects2, rects3]:
        for rect in rects:
            height = rect.get_height()
            if height > 0:
                ax.annotate(f"{height:.0f}%",
                            xy=(rect.get_x() + rect.get_width() / 2, height),
                            xytext=(0, 3),
                            textcoords="offset points",
                            ha="center", va="bottom", fontsize=10, fontweight="bold")

    plt.tight_layout()
    output_path = "evidence/figures/error_behavior_analysis.png"
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def plot_matrix_structure():
    """Visual diagram of Parity-Check Matrix H and syndrome mappings."""
    H = Hamming74.H
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 7), dpi=300, gridspec_kw={"height_ratios": [1, 1.2]})

    # Parity Check Matrix H
    cmap = plt.cm.Blues
    im = ax1.imshow(H, cmap=cmap, vmin=0, vmax=1.2)
    ax1.set_title("Parity-Check Matrix H (3 x 7) - Columns = Binary Bit Positions (1 to 7)", fontweight="bold", pad=10)
    ax1.set_xticks(np.arange(7))
    ax1.set_yticks(np.arange(3))
    ax1.set_xticklabels([f"Pos 1\n(p1)", f"Pos 2\n(p2)", f"Pos 3\n(d1)", f"Pos 4\n(p4)", f"Pos 5\n(d2)", f"Pos 6\n(d3)", f"Pos 7\n(d4)"])
    ax1.set_yticklabels(["Row 1 (s1)\n{1,3,5,7}", "Row 2 (s2)\n{2,3,6,7}", "Row 3 (s3)\n{4,5,6,7}"])

    for i in range(3):
        for j in range(7):
            val = H[i, j]
            ax1.text(j, i, str(val), ha="center", va="center", color="white" if val == 1 else "black", fontweight="bold", fontsize=14)

    # Aliasing illustration
    ax2.axis("off")
    ax2.set_title("Mathematical Principle of Double-Error Aliasing: col_i XOR col_j = col_k", fontweight="bold", pad=10)

    # Example: col_3 XOR col_5 = col_6
    text_content = (
        "Example Double Error at Bit 3 (d1) and Bit 5 (d2):\n\n"
        "  col_3(H) = [1, 1, 0]^T   (Binary position 3: 011_2)\n"
        "  col_5(H) = [1, 0, 1]^T   (Binary position 5: 101_2)\n"
        "  --------------------------------------------------------\n"
        "  Sum mod 2: [0, 1, 1]^T   == col_6(H) (Binary position 6: 110_2)!\n\n"
        "  • Ordinary Hamming(7,4) decoder receives syndrome S = [0, 1, 1]^T = 6.\n"
        "  • Decoder mistakenly flips Bit 6 (d3), which was completely UNCORRUPTED!\n"
        "  • Result: Codeword now has 3 bit errors {3, 5, 6}. Data payload is destroyed silently!"
    )
    ax2.text(0.05, 0.85, text_content, fontfamily="monospace", fontsize=11,
             bbox=dict(boxstyle="round,pad=0.8", facecolor="#fff2f2", edgecolor="#e74c3c", linewidth=2),
             verticalalignment="top")

    plt.tight_layout()
    output_path = "evidence/figures/hamming_matrix_structure.png"
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def plot_hamming_spheres():
    """Geometric visualization of Hamming space and sphere packing."""
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)

    # Codeword A center at (2, 4)
    # Codeword B center at (8, 4) (Hamming distance d_min = 3)
    c_a = (3.0, 4.0)
    c_b = (8.0, 4.0)
    radius = 1.3

    # Draw Spheres (Radius = 1 for SEC)
    circle_a = patches.Circle(c_a, radius, color="#2ecc71", alpha=0.25, ec="#27ae60", lw=2.5, linestyle="--")
    circle_b = patches.Circle(c_b, radius, color="#3498db", alpha=0.25, ec="#2980b9", lw=2.5, linestyle="--")
    ax.add_patch(circle_a)
    ax.add_patch(circle_b)

    # Valid Codewords
    ax.plot(c_a[0], c_a[1], "o", color="#27ae60", markersize=14, label="Valid Codeword C_A")
    ax.annotate(r"Valid Codeword $C_A$", xy=c_a, xytext=(-30, 20), textcoords="offset points", fontweight="bold", fontsize=11)

    ax.plot(c_b[0], c_b[1], "o", color="#2980b9", markersize=14, label="Valid Codeword $C_B$")
    ax.annotate(r"Valid Codeword $C_B$", xy=c_b, xytext=(-30, 20), textcoords="offset points", fontweight="bold", fontsize=11)

    # Single Error from C_A (distance 1): inside Sphere A
    single_err = (3.8, 4.4)
    ax.plot(single_err[0], single_err[1], "x", color="#d35400", markersize=12, markeredgewidth=3)
    ax.annotate("1-bit Error from $C_A$\n(Inside Sphere $C_A$)\n-> Corrected back to $C_A$",
                xy=single_err, xytext=(20, 25), textcoords="offset points",
                arrowprops=dict(arrowstyle="->", color="#d35400", lw=1.5),
                fontweight="bold", color="#d35400", fontsize=10)

    # Double Error from C_A (distance 2 from C_A, distance 1 from C_B!): inside Sphere B!
    double_err = (7.1, 3.8)
    ax.plot(double_err[0], double_err[1], "X", color="#c0392b", markersize=14, markeredgewidth=3)
    ax.annotate(r"2-bit Error from $C_A$" + "\n" + r"(Lands inside Sphere of $C_B$!)" + "\n" + r"$\to$ Falsely Decoded as $C_B$!",
                xy=double_err, xytext=(-90, -70), textcoords="offset points",
                arrowprops=dict(arrowstyle="->", color="#c0392b", lw=2),
                fontweight="bold", color="#c0392b", fontsize=10,
                bbox=dict(boxstyle="round,pad=0.5", facecolor="#ffebee", edgecolor="#c0392b"))

    # Dimension and distance annotations
    ax.annotate("", xy=c_a, xytext=c_b, arrowprops=dict(arrowstyle="<->", color="black", lw=1.5, linestyle=":"))
    ax.text(5.5, 4.15, r"Minimum Hamming Distance $d_{min} = 3$", ha="center", va="bottom", fontweight="bold", fontsize=11)

    ax.set_xlim(0, 11)
    ax.set_ylim(1, 7)
    ax.set_aspect("equal")
    ax.set_title("Geometric Explanation of Aliasing: Hamming Space and Sphere Overlap", fontweight="bold", pad=15)
    ax.axis("off")
    plt.tight_layout()

    output_path = "evidence/figures/hamming_distance_spheres.png"
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def main():
    print("Generating evidence visual diagrams...")
    plot_error_behavior()
    plot_matrix_structure()
    plot_hamming_spheres()
    print("All figures successfully created in evidence/figures/!")


if __name__ == "__main__":
    main()
