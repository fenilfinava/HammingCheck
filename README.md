# 🎓 Hamming(7,4) Single vs. Double Error Dynamics
### Academic Defense & Interactive Demonstration Suite

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)](https://docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Project Overview

This repository hosts the definitive academic demonstration and experimental benchmarking suite for **Hamming(7,4) Linear Block Error-Control Coding**.

The platform mathematically proves and interactively demonstrates why ordinary Hamming(7,4) guarantees **100% Single-Error Correction (SEC)**, but catastrophically fails under **Double-Bit Errors** due to **Decoder Aliasing**—leading to **Silent Data Corruption (SDC)** where an innocent third bit is miscorrected, increasing total errors from 2 to 3. It also demonstrates how **Extended Hamming(8,4) SECDED** resolves this vulnerability.

Designed and formatted for a **20 / 20 Marks** academic defense and a **30–35 minute video presentation**.

---

## 🚀 Deployment Guide (Step-by-Step)

You can deploy this project in **3 different ways**:

### Option 1: Deploy Frontend on Vercel (Recommended — Fastest, Free)

Because the Next.js frontend has self-contained client-side GF(2) parity and syndrome engines, you can deploy the complete interactive suite to Vercel in 1 minute:

1. Push this repository to your GitHub account:
   ```bash
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in with GitHub.
3. Click **"Add New Project"** and select **`HammingCheck`**.
4. Set **Root Directory** to: `frontend`
5. Keep Framework Preset as **Next.js**.
6. (Optional) Under Environment Variables, add:
   - `BACKEND_URL`: `https://your-backend.railway.app` (if you also deploy the Python backend)
7. Click **"Deploy"**. Your interactive web suite will be live with a free SSL `.vercel.app` domain!

---

### Option 2: Deploy Fullstack (Next.js + Python FastAPI) on Render / Railway

To deploy both the frontend and the Python backend together:

#### A. Deploy the Backend:
1. Go to [render.com](https://render.com) or [railway.app](https://railway.app).
2. Create a new **Web Service** connected to your `HammingCheck` repository.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Copy the assigned URL (e.g., `https://hamming-backend.onrender.com`).

#### B. Deploy the Frontend on Vercel:
1. In your Vercel project settings, set Environment Variable:
   - `BACKEND_URL` = `https://hamming-backend.onrender.com`
2. Redeploy. The "Python Backend Connected" indicator on the navbar will turn green!

---

### Option 3: 1-Command Local or Cloud Docker Deployment

To run both services locally or on any Linux VPS with Docker:

```bash
# Clone the repository
git clone https://github.com/fenilfinava/HammingCheck.git
cd HammingCheck

# Build and start both containers
docker-compose up --build -d
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Local Development Setup

### 1. Run the Python Backend
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run FastAPI server
cd backend
uvicorn app.main:app --reload --port 8000
```

### 2. Run the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Deliverables & Documentation

| File | Format | Description |
| :--- | :---: | :--- |
| **[`TECHNICAL_REPORT.docx`](./TECHNICAL_REPORT.docx)** | Word (.docx) | Comprehensive 11-section formal academic technical report for 20/20 marks evaluation. |
| **[`TECHNICAL_REPORT.md`](./TECHNICAL_REPORT.md)** | Markdown | Markdown version of the technical report with full mathematical derivations and proofs. |
| **[`PRESENTATION_SCRIPT.docx`](./PRESENTATION_SCRIPT.docx)** | Word (.docx) | 30–35 minute master video presentation script with chapter timestamps, spoken English narration, and on-screen click instructions. |
| **[`evidence/test_results.csv`](./evidence/test_results.csv)** | CSV | Exhaustive empirical benchmark dataset across all 464 test scenarios. |
| **[`run_experiments.py`](./run_experiments.py)** | Python | Automated benchmark script verifying all 16 message vectors under 0, 1, and 2-error channels. |

---

## 📐 Mathematical Summary

### Hamming(7,4) Parameters:
- **Codeword length ($n$):** 7 bits
- **Message length ($k$):** 4 bits ($d_1, d_2, d_3, d_4$)
- **Parity bits ($r$):** 3 bits ($p_1, p_2, p_4$)
- **Minimum distance ($d_{\min}$):** 3 (linear block code)
- **Error-correction capability ($t_{\text{corr}}$):** $\lfloor (3-1)/2 \rfloor = 1$ bit

### Even Parity Equations over $\text{GF}(2)$:
- $p_1 = d_1 \oplus d_2 \oplus d_4$ (Checks positions $\{1, 3, 5, 7\}$)
- $p_2 = d_1 \oplus d_3 \oplus d_4$ (Checks positions $\{2, 3, 6, 7\}$)
- $p_4 = d_2 \oplus d_3 \oplus d_4$ (Checks positions $\{4, 5, 6, 7\}$)

### The Double-Error Aliasing Failure:
When two bits $i$ and $j$ flip simultaneously, the syndrome vector evaluates to:
$$S = \text{col}_i(H) \oplus \text{col}_j(H) = \text{col}_k(H)$$
Because the columns of $H$ comprise **all 7 non-zero vectors in $\mathbb{F}_2^3$**, the XOR sum of ANY two columns strictly equals a third column $\text{col}_k(H)$ where $k \notin \{i, j\}$. The decoder falsely inverts innocent bit $k$, leaving **3 corrupted bits** ($\{i, j, k\}$) without any alert.

### Extended SECDED Hamming(8,4) Solution:
Appends an 8th overall parity bit $p_0 = \bigoplus_{i=1}^7 c_i$. Minimum distance expands to **$d_{\min} = 4$**.
- $S \neq 0$ and $P = 1 \implies$ **Single Error** (Safe to correct bit $S$)
- $S \neq 0$ and $P = 0 \implies$ **Double Error Detected!** (Halts false inversion and triggers interrupt)

---

## 📊 Evaluation Rubric (20 Marks Breakdown)

| Rubric Criteria | Marks | Project Implementation |
| :--- | :---: | :--- |
| **Conceptual understanding & technical correctness** | **5 Marks** | $\text{GF}(2)$ arithmetic, $G$ ($4 \times 7$) & $H$ ($3 \times 7$) matrices, $d_{\min} = 3$ proof, Hamming sphere bound ($128 = 128$). |
| **Visualisation/simulation or executable demo** | **5 Marks** | Interactive SVG Venn diagram, live syndrome table, 7-step wizard stepper, tactile bit flippers. |
| **Technical explanation & interpretation** | **4 Marks** | Full algebraic proof of aliasing ($\text{col}_i \oplus \text{col}_j = \text{col}_k$), parity cancellation ($1 \oplus 1 = 0$), SDC breakdown. |
| **Recorded technical presentation** | **3 Marks** | 35-minute calibrated video script in `PRESENTATION_SCRIPT.docx` with timestamps and click guidance. |
| **Supporting files and documentation** | **3 Marks** | FastAPI backend, 464-test benchmark suite, CSV evidence, Dockerfile, and formal technical report. |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
