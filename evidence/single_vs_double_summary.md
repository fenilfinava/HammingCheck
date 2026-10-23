# Experimental Evidence: Hamming(7,4) Single vs Double Error

## Test Suite Execution Summary
- **Total Test Vectors Evaluated**: 464 distinct scenarios
- **Data Patterns**: All $2^4 = 16$ possible 4-bit combinations (`0000` to `1111`)
- **Single Error Injections**: 112 runs ($16 \times 7$)
- **Double Error Injections**: 336 runs ($16 \times 21$)

## Performance Comparison Table

| Metric | Zero Error | Single Error (1-bit) | Double Error (2-bit) Ordinary Hamming(7,4) | Double Error (2-bit) Extended SECDED(8,4) |
|---|---|---|---|---|
| **Test Cases** | 16 | 112 | 336 | 336 |
| **Syndrome $S = 0$** | 16 (100%) | 0 (0%) | 0 (0%) | 0 (0%) |
| **Syndrome $S \neq 0$** | 0 (0%) | 112 (100%) | 336 (100%) | 336 (100%) |
| **Safe Error Correction** | **16 (100%)** | **112 (100.0%)** | **0 (0.0%)** | N/A (Detect only) |
| **Miscorrection / Aliasing** | 0 (0%) | 0 (0.0%) | **336 (100.0%)** | **0 (0.0%)** |
| **Reliable Error Detection** | N/A | 112 (100%) | **0 (Silent failure)** | **336 (100.0%)** |
| **Final Codeword Error Count** | 0 bits | 0 bits | **3 bits** | 2 bits (unaltered) |

## Key Empirical Findings
1. **Single Error Invariant**:
   For all 112 test cases, the calculated syndrome $S$ strictly equaled the binary representation of the flipped bit position ($S = \text{pos}$). In 100% of cases, the original codeword and data payload were perfectly reconstructed.

2. **Double Error Aliasing Theorem Verified**:
   Across all 336 double-error tests, the syndrome $S = H \cdot (e_i \oplus e_j)^T = \text{col}_i(H) \oplus \text{col}_j(H)$ was **always non-zero** and matched an uncorrupted 3rd bit $\text{col}_k(H)$.
   The decoder flipped the innocent bit $k$, expanding the 2-bit channel error into a **3-bit catastrophic corruption**. In zero cases was the error safely corrected.

3. **SECDED Safeguard**:
   Extended Hamming(8,4) detected 100% of the 336 double-error cases via the overall parity equation $P = 0$ combined with $S \neq 0$, completely halting decoder aliasing.
