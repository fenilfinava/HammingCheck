#!/usr/bin/env python3
"""
build_word_doc.py
=================
Generates the definitive 30-35 minute video recording and examination defense script:
PRESENTATION_SCRIPT.docx

Specifically tailored for the Next.js + FastAPI Clean White UI Web Application Suite.
Features:
- Complete Website Plan Breakdown (7 Pages/Tabs matching user plan)
- 7 Chapters calibrated for 30 to 35 minutes video recording (0:00 to 35:00)
- Exact On-Screen Web UI Click Instructions (tabs, buttons, dropdowns, stepper)
- Word-for-Word Spoken English Narration for every minute
- In-depth Conceptual Explanation in Gujarati (સમજૂતી)
- Full Model Exam Paper Worked Numerical Solution
- Oral Exam Defense Q&A Section
"""

import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn


def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tc_pr.append(shd)


def build_35min_web_doc():
    doc = Document()

    # 1-inch margins
    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)

    # Document Header Title
    tp = doc.add_paragraph()
    tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    trun = tp.add_run("Hamming(7,4) Single vs Double Error Dynamics\n30-35 Minute Master Presentation & Defense Script")
    trun.font.size = Pt(22)
    trun.font.bold = True
    trun.font.color.rgb = RGBColor(30, 58, 138)  # Deep Navy Blue

    # Subtitle
    sp = doc.add_paragraph()
    sp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    srun = sp.add_run("Target Evaluation: 20 / 20 Marks | Total Video Presentation Duration: 30 to 35 Minutes\nNext.js 14 Frontend + Python FastAPI Backend | Clean White UI Architecture | Model Exam Solution")
    srun.font.size = Pt(11)
    srun.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph()

    # Section 1: Target Evaluation Rubric
    doc.add_heading("1. Target Evaluation Rubric (20 Marks Breakdown)", level=2)

    table = doc.add_table(rows=6, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'

    headers = ["Rubric Criteria", "Marks", "How Our Next.js + Python Web Suite Secures Full Marks"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.text = h
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(cell, "1E3A8A")

    rows_data = [
        ("Conceptual understanding & technical correctness", "5 Marks", "Galois Field GF(2), G (4x7) and H (3x7) matrices, orthogonality G·H^T=0, d_min=3 algebraic proof, and Hamming sphere packing bound (128=128)."),
        ("Visualisation/simulation or executable demo", "5 Marks", "Next.js 14 Clean White UI: live interactive Venn diagram, 7-step wizard stepper, clickable bit flippers, live matrix multiplication tables, and on-screen teleprompter."),
        ("Technical explanation & interpretation", "4 Marks", "Col_i ⊕ col_j = col_k aliasing proof, parity cancellation in shared circles (1⊕1=0), Silent Data Corruption (SDC) demonstration, and Extended SECDED boundary."),
        ("Recorded technical presentation", "3 Marks", "30-35 minute calibrated timeline, professional spoken English narration, explicit on-screen actions, Gujarati concept guidance, and oral defense Q&A."),
        ("Supporting files and documentation", "3 Marks", "FastAPI Python backend, 464-test benchmark suite, CSV evidence export, Docker multi-container deployment, and model university exam paper solution."),
    ]

    for i, row in enumerate(rows_data):
        for j, val in enumerate(row):
            cell = table.cell(i + 1, j)
            cell.text = val
            cell.paragraphs[0].runs[0].font.size = Pt(9.5)
            if i % 2 == 1:
                set_cell_background(cell, "F1F5F9")

    doc.add_paragraph()

    # Section 2: Website Structure Plan
    doc.add_heading("2. Website Architecture & Navigation Plan (6 Clean Demonstration Pages)", level=2)

    web_plan_table = doc.add_table(rows=7, cols=3)
    web_plan_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    web_plan_table.style = 'Table Grid'

    w_headers = ["Page / Tab Name", "Shu Batavvanu? (Purpose & Content)", "Features & Interactive Controls"]
    for j, h in enumerate(w_headers):
        cell = web_plan_table.cell(0, j)
        cell.text = h
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(cell, "0F766E")

    w_data = [
        ("1. Home", "Project introduction, Shannon capacity (1948), Richard Hamming (1950), error detection vs correction table.", "Hero banner, comparison matrix, 4 application cards (ECC RAM, Satellite, SSD, RAID-2), objectives."),
        ("2. Learn Hamming Code", "4 data bits, 3 parity bits, bit positions 1 to 7, even parity calculation, G and H matrices.", "Interactive 4-bit encoder sandbox, bit position table (powers of 2), live parity equations, d_min=3 proof."),
        ("3. Single Error Demo", "Single-bit error demonstration, syndrome calculation S=[s1,s2,s3], error localization, 100% bit repair.", "7 clickable bit flip selectors with pulsing red animations, and 7-Step Mode (Wizard) with Previous/Next buttons."),
        ("4. Double Error Demo", "Single error vs double error comparison, wrong correction demonstration, decoder aliasing proof.", "Side-by-side Case A vs Case B cards, 2-bit flip selector, cancellation formula (1⊕1=0), modulo-2 column addition."),
        ("5. Interactive Simulator", "Main highlight: Full master simulator sandbox for live unrestricted experimentation.", "4-bit input toggles, 7-bit codeword pills, live SVG Venn diagram with interactive circles, matrix table, presets."),
        ("6. Results & Exam Answer", "Automated test cases panel, model exam paper worked answer, limitations, applications & CSV download.", "Interactive filterable test cases table (clean, single, double), step-by-step written exam paper solution (Parts a-d)."),
    ]

    for i, row in enumerate(w_data):
        for j, val in enumerate(row):
            cell = web_plan_table.cell(i + 1, j)
            cell.text = val
            cell.paragraphs[0].runs[0].font.size = Pt(9.5)
            if i % 2 == 1:
                set_cell_background(cell, "F8FAFC")

    doc.add_paragraph()

    # Section 3: Master 30-35 Minute Spoken Script
    doc.add_heading("3. Master 30-35 Minute Video Presentation Script (Chapter-by-Chapter)", level=2)

    chapters = [
        {
            "num": "Chapter 1",
            "time": "0:00 - 4:30 (4.5 min)",
            "title": "Home: Introduction, Shannon Capacity & Historical Background",
            "tab": "Navbar -> Click 'Home (Intro)' Tab",
            "actions": (
                "1. Open browser at http://localhost:3000.\n"
                "2. Show the clean white navbar: 'Hamming(7,4) Demonstration Suite' and green 'Python Backend Connected (FastAPI:8000)' badge.\n"
                "3. In the Hero Banner, point out the 'Academic Defense & Simulation Suite' badge, project title, and the 3 animated CTA buttons ('Launch Interactive Simulator', 'Single Error Demo', 'Double Error Aliasing Demo').\n"
                "4. Scroll down to the 'Error Detection vs. Error Correction' comparison table and highlight the differences between Parity, Hamming, and SECDED.\n"
                "5. Hover over the 4 real-life application cards: DDR5 ECC RAM, Deep-Space Telemetry, SSD Flash, and RAID-2."
            ),
            "spoken": (
                "Good morning respected evaluators, professors, and peers. Welcome to this comprehensive 35-minute technical seminar "
                "and demonstration on 'Hamming(7,4) Single vs Double Error Dynamics: From Linear Block Formalism to the Catastrophic Failure "
                "of Decoder Aliasing and the SECDED Solution'.\n\n"
                "In all digital communications—from interplanetary radio links to high-bandwidth DDR5 server memory and solid-state drives—physical "
                "channels suffer from thermal noise, electromagnetic crosstalk, and cosmic ray Single-Event Upsets (SEUs). In 1948, Claude Shannon "
                "proved in his landmark mathematical theory of communication that error-free transmission is achievable up to channel capacity, "
                "provided we introduce structured mathematical redundancy.\n\n"
                "In 1950, Richard W. Hamming at Bell Telephone Laboratories tackled a frustrating practical bottleneck: electro-mechanical relay computers "
                "would halt over weekend unattended runs whenever a relay spark flipped a single bit. The simple single parity bit used at the time "
                "could detect an odd number of errors, but it had ZERO localization—it could never tell which bit was corrupted, providing zero correction. "
                "Furthermore, an even number of errors cancelled out completely!\n\n"
                "Hamming's breakthrough was to arrange multiple parity checks geometrically, giving each bit a coordinate in a multi-dimensional hypercube. "
                "This produced the Hamming(7,4) code, which protects 4 information payload bits with 3 parity check bits.\n\n"
                "On screen, look at our comparison table: a single parity bit requires low overhead but provides zero correction. Hamming(7,4) introduces "
                "3 parity bits to guarantee 100% single-error correction. However, as we will demonstrate today, when two errors occur simultaneously, "
                "ordinary Hamming(7,4) miscorrects an innocent third bit! Let us navigate to our 'Learn Hamming Code' tab to understand the structure."
            ),
            "gujarati": (
                "સમજૂતી (0:00 - 4:30):\n"
                "વિડીયોની શરૂઆત 'Home (Intro)' પેજથી કરો. ક્લાઉડ શેનોન (1948) અને રિચાર્ડ હેમિંગ (1950) નો ઇતિહાસ કહો. "
                "સાદી પેરિટી ફક્ત એરર પકડે છે પણ સુધારી શકતી નથી. હેમિંગ કોડમાં 4 ડેટા અને 3 પેરિટી બીટ્સ હોય છે. "
                "એરર ડિટેક્શન વિ. એરર કરેક્શનનું ટેબલ અને ECC RAM, સેટેલાઇટ ના ઉપયોગો માઉસથી બતાવો. "
                "આજના વિડીયોનો મુખ્ય ગોલ: 1-error કેમ સુધરે છે અને 2-errors માં કેમ ડીકોડર ફેલ થઈને 3rd સાચો બીટ પણ બગાડે છે તે સાબિત કરવું."
            )
        },
        {
            "num": "Chapter 2",
            "time": "4:30 - 9:30 (5.0 min)",
            "title": "Learn Hamming Code: Bit Positions, Parity Equations & Matrices",
            "tab": "Navbar -> Click 'Learn Hamming Code' Tab",
            "actions": (
                "1. Click the 'Learn Hamming Code' tab in the navbar.\n"
                "2. Point to the 1-indexed bit position table. Highlight that positions 1, 2, and 4 are powers of 2 (001, 010, 100).\n"
                "3. In the 'Live Encoder Demo' sandbox, click data bits d1, d2, d3, d4 to show parity bits recomputing dynamically.\n"
                "4. Point to the Generator Matrix G (4x7) and Parity-Check Matrix H (3x7).\n"
                "5. Highlight the minimum distance proof d_min = 3 and the sphere packing formula (16 * 8 = 128 = 2^7)."
            ),
            "spoken": (
                "Let us examine the mathematical architecture on our 'Learn Hamming Code' tab.\n\n"
                "All operations in Hamming(7,4) are defined over Galois Field GF(2), where addition is bitwise XOR and multiplication is AND. "
                "A codeword c belongs to vector space F_2^7. We have parameters (n, k) = (7, 4), meaning total codeword length n = 7, message dimension k = 4, "
                "and redundancy r = 3 parity bits. The code rate is R = 4/7 ≈ 0.5714.\n\n"
                "Notice our 1-indexed bit arrangement on screen: parity bits are strictly placed at integer powers of 2:\n"
                "- Position 1 (001 in binary) holds p1.\n"
                "- Position 2 (010 in binary) holds p2.\n"
                "- Position 4 (100 in binary) holds p4.\n"
                "Positions 3, 5, 6, and 7 carry data bits d1, d2, d3, and d4.\n\n"
                "Each parity bit balances its binary coordinates:\n"
                "- p1 checks indices with bit 0 set: {1, 3, 5, 7} -> p1 = d1 ⊕ d2 ⊕ d4.\n"
                "- p2 checks indices with bit 1 set: {2, 3, 6, 7} -> p2 = d1 ⊕ d3 ⊕ d4.\n"
                "- p4 checks indices with bit 2 set: {4, 5, 6, 7} -> p4 = d2 ⊕ d3 ⊕ d4.\n\n"
                "In our Live Encoder sandbox, for input payload d = [1, 0, 1, 1], our parity bits compute to p1 = 0, p2 = 1, p4 = 0, "
                "yielding codeword c = [0, 1, 1, 0, 0, 1, 1].\n\n"
                "Looking at our Generator Matrix G (4x7): codeword c = d · G (mod 2). Looking at Parity-Check Matrix H (3x7): Column i is precisely the 3-bit "
                "binary representation of index i! By construction, G · H^T ≡ 0 (mod 2).\n\n"
                "Now, what is the minimum Hamming distance d_min? All columns of H are non-zero and pairwise distinct, so d_min > 2. "
                "However, columns 1, 2, and 3 sum to [0,0,0]^T! Therefore, d_min is strictly 3. This yields error correction capability t = floor((3-1)/2) = 1.\n\n"
                "Furthermore, look at the Hamming Bound: 2^k · (1 + n) = 16 · 8 = 128 = 2^7. Because strict equality holds, Hamming(7,4) is a PERFECT CODE: "
                "every vector in the 128-dimensional space belongs to the radius-1 sphere of some valid codeword! Now let us test single-bit errors."
            ),
            "gujarati": (
                "સમજૂતી (4:30 - 9:30):\n"
                "'Learn Hamming Code' ટેબ પર જાઓ. 1, 2, 4 સ્થાનો પર પેરિટી કેમ છે? કારણ કે તેમના બાઈનરી કોઓર્ડિનેટ્સ (001, 010, 100) છે. "
                "લાઈવ એનકોડર સેન્ડબોક્સમાં ડેટા બદલીને લાઈવ પેરિટી ગણતરી બતાવો. મેટ્રિક્સ G અને H સમજાવો અને સાબિત કરો કે d_min = 3 કેમ છે "
                "અને Perfect Code (16 x 8 = 128 = 2^7) નો અર્થ શું છે."
            )
        },
        {
            "num": "Chapter 3",
            "time": "9:30 - 15:00 (5.5 min)",
            "title": "Single Error Demo: Live Bit Flip & Step-by-Step Stepper Walkthrough",
            "tab": "Navbar -> Click 'Single Error Demo' Tab",
            "actions": (
                "1. Switch to 'Single Error Demo' tab.\n"
                "2. In the 7-bit selector, click Bit 3. Show the red corrupted highlight and strikethrough value.\n"
                "3. Point to the quick verdict alert banner showing syndrome [1, 1, 0] = Decimal 3.\n"
                "4. Scroll down to the 'Step-by-Step Mode (Wizard)'.\n"
                "5. Click 'Next Step' through all 7 steps:\n"
                "   - Step 1: Input Data [1, 0, 1, 1]\n"
                "   - Step 2: Parity Calculation (p1=0, p2=1, p4=0)\n"
                "   - Step 3: Codeword Assembly [0, 1, 1, 0, 0, 1, 1]\n"
                "   - Step 4: Channel Noise Injection (Bit 3 flips)\n"
                "   - Step 5: Parity Checks Evaluation (s1=1, s2=1, s3=0)\n"
                "   - Step 6: Syndrome Binary-to-Decimal Translation (Decimal 3)\n"
                "   - Step 7: Decoder Inversion & 100% Restored Payload"
            ),
            "spoken": (
                "Now let us navigate to our 'Single Error Demo' tab. Here, we demonstrate the step-by-step mathematical mechanics of single-bit error correction.\n\n"
                "We transmit 4-bit data d = [1, 0, 1, 1], which generates 7-bit codeword [0, 1, 1, 0, 0, 1, 1]. In the top selector, I click Bit 3 (data bit d1): "
                "notice how the UI animates the corrupted bit with a pulsing red highlight! Original bit 1 is received as 0.\n\n"
                "Now let us walk through our Step-by-Step Mode below using the 'Next Step' controller:\n"
                "- Step 1 shows our selected 4-bit input data.\n"
                "- Step 2 calculates the 3 parity bits using modulo-2 XOR.\n"
                "- Step 3 assembles the 7-bit codeword vector.\n"
                "- Step 4 simulates the noisy physical channel: Bit 3 is flipped.\n"
                "- Step 5 evaluates parity checks on the received vector r: Row 1 tests {1,3,5,7}, giving s1 = 1; Row 2 tests {2,3,6,7}, giving s2 = 1; "
                "and Row 3 tests {4,5,6,7}, giving s3 = 0.\n"
                "- Step 6 converts syndrome vector [1, 1, 0] to decimal: s1*1 + s2*2 + s3*4 = 1*1 + 1*2 + 0*4 = 3! The syndrome vector directly isolated "
                "the exact corrupted position: Bit 3!\n"
                "- Step 7 shows decoder correction: the decoder inverts bit 3 from 0 back to 1. Original data [1, 0, 1, 1] is 100% restored without data loss!\n\n"
                "Notice that even if I change the selector to flip a parity bit (e.g. Bit 1), syndrome equals 1, and the decoder repairs the parity bit without "
                "affecting the data payload. Single-Error Correction is 100% verified!"
            ),
            "gujarati": (
                "સમજૂતી (9:30 - 15:00):\n"
                "'Single Error Demo' ટેબ ખોલો. બીટ 3 પર ક્લિક કરીને લાલ ફ્લિપ બતાવો. પછી નીચે આપેલા Step-by-Step Mode માં 'Next Step' દબાવતા જાઓ: "
                "Step 1 થી Step 7 સુધી દરેક ગણતરી સમજાવો. સિન્ડ્રોમ 3 આવ્યો: s1=1, s2=1, s3=0 -> 1 + 2 + 0 = 3. ડીકોડરે બીટ 3 સુધારીને ઓરિજિનલ ડેટા "
                "100% પાછો મેળવી લીધો."
            )
        },
        {
            "num": "Chapter 4",
            "time": "15:00 - 21:00 (6.0 min)",
            "title": "Double Error Demo: Single vs Double Comparison & Aliasing Catastrophe",
            "tab": "Navbar -> Click 'Double Error Demo' Tab",
            "actions": (
                "1. Switch to 'Double Error Demo' tab.\n"
                "2. Compare Case A (Single Error at Bit 3) against Case B (Double Error at Bits 3 and 5) side-by-side.\n"
                "3. In Case B, show how the calculated syndrome evaluates to Decimal 6.\n"
                "4. Point to the large red catastrophic failure verdict: '🚨 Miscorrection Catastrophe (3 Corrupted Bits)'.\n"
                "5. Scroll down to the two explanation boxes:\n"
                "   - Reason 1: Parity Cancellation in Shared Circles (1 ⊕ 1 = 0 in Circle 1).\n"
                "   - Reason 2: Vector Aliasing in F_2^3 (col_i ⊕ col_j = col_k).\n"
                "6. Change the dropdowns in the interactive equation to show col_2 ⊕ col_4 = col_6."
            ),
            "spoken": (
                "Now we arrive at the central technical dilemma of our seminar: What happens when TWO bit errors occur simultaneously?\n\n"
                "Navigate to our 'Double Error Demo' tab. On screen, we compare Case A (Single Error at Bit 3) against Case B (Double Error at Bits 3 and 5).\n\n"
                "In Case A, the syndrome was 3, and the decoder repaired Bit 3 with 100% success. But look at Case B when two bits flip simultaneously:\n"
                "Bit 3 and Bit 5 both flip during transmission. Look at the calculated syndrome:\n"
                "- Check 1 tests indices {1, 3, 5, 7}. Because BOTH bits 3 and 5 belong to check 1, their two flips cancel each other out under modulo-2 arithmetic: "
                "1 ⊕ 1 = 0! Check 1 falsely passes (s1 = 0)!\n"
                "- Check 2 tests {2, 3, 6, 7}: it fails due to bit 3 (s2 = 1)!\n"
                "- Check 3 tests {4, 5, 6, 7}: it fails due to bit 5 (s3 = 1)!\n\n"
                "The resulting syndrome vector is binary [0, 1, 1], which converts to DECIMAL 6!\n\n"
                "Now trace the decoder's fatal blind spot: The ordinary Hamming(7,4) decoder has no awareness of how many errors occurred. It sees syndrome 6, "
                "and because it is hard-coded to assume single errors, it concludes: 'Bit 6 is corrupted! Let me invert it!'\n"
                "The decoder FLIPS Bit 6! But Bit 6 was completely innocent and uncorrupted!\n\n"
                "Look at our red disaster banner: Bits 3 and 5 were corrupted by channel noise; Bit 6 was corrupted by the decoder itself! The codeword now "
                "contains THREE CORRUPTED BITS! The decoded payload is completely ruined, and worst of all: the receiver has ZERO AWARENESS that anything went wrong. "
                "This is Silent Data Corruption (SDC)!\n\n"
                "Look at the algebraic proof below: S = col_3(H) ⊕ col_5(H) = [1,1,0]^T ⊕ [1,0,1]^T = [0,1,1]^T = col_6(H). "
                "Because H contains ALL 7 non-zero vectors in F_2^3, the sum of ANY two distinct columns is GUARANTEED to equal a third column. "
                "In 100% of all 21 possible double-error pairs, ordinary Hamming(7,4) aliases into an innocent third bit!"
            ),
            "gujarati": (
                "સમજૂતી (15:00 - 21:00):\n"
                "આ પ્રેઝન્ટેશનનો સૌથી મોટો ક્લાઈમેક્સ છે (5+4 marks)! 'Double Error Demo' ટેબમાં Case A અને Case B ની સરખામણી બતાવો. "
                "બીટ 3 અને 5 બગડ્યા, ત્યારે સર્કલ 1 માં 1 ⊕ 1 = 0 થઈને કેન્સલ થઈ ગયું! સિન્ડ્રોમ 6 આવ્યો કારણ કે col 3 + col 5 = col 6 થાય છે! "
                "ડીકોડરે માન્યું કે બીટ 6 ખરાબ છે એટલે એણે સાચા બીટ 6 ને પણ ફ્લિપ કરી નાખ્યો. આમ 2 ની જગ્યાએ 3 ભૂલો થઈ ગઈ. "
                "લાલ કલરનું એલર્ટ બેનર બતાવીને સમજાવો કે આને 'Silent Data Corruption' કહેવાય."
            )
        },
        {
            "num": "Chapter 5",
            "time": "21:00 - 26:30 (5.5 min)",
            "title": "Interactive Simulator: Master Sandbox, Clickable Codeword & Live Venn",
            "tab": "Navbar -> Click 'Interactive Simulator' Tab",
            "actions": (
                "1. Switch to 'Interactive Simulator' tab.\n"
                "2. Click '🟢 Pristine (0 Errors)' preset -> show all circles blue and syndrome [0,0,0].\n"
                "3. Click '🔵 Single Error (Bit 3)' preset -> show Bit 3 red in codeword, Circles 1 and 2 red in Venn diagram.\n"
                "4. Click '🔴 Double Error (Bits 3 & 5)' preset -> show Circle 1 blue (cancellation!), Circles 2 and 3 red, intersecting at Bit 6.\n"
                "5. Trace the live matrix multiplication row checks table below.\n"
                "6. Point to the Extended SECDED Hamming(8,4) status card showing how overall parity p0 protects against double errors."
            ),
            "spoken": (
                "Let us now enter the main highlight of our platform: the 'Interactive Simulator'. Here, evaluators and students can test any arbitrary "
                "channel condition in real time.\n\n"
                "On screen, we have our 4-bit data input toggles, a 7-bit channel codeword bar, and our interactive geometric Venn Diagram on the right.\n\n"
                "First, look at our baseline: Pristine Channel. All three parity checks evaluate to zero: s1=0, s2=0, s3=0. The syndrome is [0, 0, 0]. "
                "All Venn circles are blue, and the green banner confirms pristine transmission.\n\n"
                "Now, I click the preset: 'Single Error (Bit 3)'.\n"
                "Immediately, look at the channel codeword bar: Bit 3 turns red. Look at our Venn Diagram: Circles 1 and 2 violate even parity and turn red! "
                "Their overlapping intersection uniquely isolates Bit 3. The decoder repairs Bit 3 with 100% fidelity.\n\n"
                "Now watch the magic when I click 'Double Error (Bits 3 & 5)':\n"
                "Look at Circle 1 in the Venn diagram: both bit 3 and bit 5 are inside Circle 1, so their flips cancel out: 1 ⊕ 1 = 0! Circle 1 turns blue! "
                "Circles 2 and 3 remain red, and their failing intersection highlights Bit 6! The live syndrome table below computes S = [0, 1, 1] = Decimal 6.\n\n"
                "Look at our Extended SECDED card: evaluating overall parity bit p0 across all 8 bits gives P = 0 (Even). SECDED sees that S ≠ 0 and P = 0, "
                "identifies that S is an aliased double error, halts false correction, and triggers an uncorrectable error interrupt! This interactive sandbox "
                "makes the abstract mathematics visually crystal clear!"
            ),
            "gujarati": (
                "સમજૂતી (21:00 - 26:30):\n"
                "'Interactive Simulator' ટેબ પર જાઓ. આ વેબસાઈટનો મુખ્ય હાઈલાઈટ છે! 'Pristine' બટન દબાવીને 000 બતાવો. "
                "પછી 'Single Error' દબાવો -> Venn Diagram માં સર્કલ 1 અને 2 લાલ થયા. પછી 'Double Error' દબાવો -> સર્કલ 1 બ્લુ (કેન્સલ) થયું "
                "અને સર્કલ 2 અને 3 નું છેદબિંદુ બીટ 6 બન્યું. નીચેનું લાઈવ મેટ્રિક્સ ગુણાકાર ટેબલ માઉસથી બતાવો. "
                "SECDED નું કાર્ડ બતાવીને સમજાવો કે 8મો બીટ p0 કેવી રીતે 2-error પકડી પાડે છે."
            )
        },
        {
            "num": "Chapter 6",
            "time": "26:30 - 31:30 (5.0 min)",
            "title": "Results & Exam Answer: Test Cases Panel & Worked University Paper",
            "tab": "Navbar -> Click 'Results & Exam Answer' Tab",
            "actions": (
                "1. Switch to 'Results & Exam Answer' tab.\n"
                "2. In the Test Cases Panel, click the 'Single Errors' filter, then the 'Double Errors' filter.\n"
                "3. Highlight that in 100% of double errors, final errors increase to 3 bits.\n"
                "4. Scroll down to the 'Model Exam Paper Answer (Worked Example)'.\n"
                "5. Walk through the 4 solution parts:\n"
                "   - Part (a): Codeword Generation [0, 1, 1, 0, 0, 1, 1]\n"
                "   - Part (b): Single Error Detection at Bit 3 (S=3)\n"
                "   - Part (c): Double Error Aliasing at Bits 3 & 5 (S=6, 3 corrupted bits)\n"
                "   - Part (d): SECDED Overall Parity Safeguard\n"
                "6. Click the 'Export CSV Evidence' button to download the empirical test suite."
            ),
            "spoken": (
                "Now navigate to 'Results & Exam Answer'. This tab provides empirical benchmarking and complete academic documentation.\n\n"
                "In our Automated Test Cases Panel, we systematically evaluated 15 representative channel vectors across multiple payloads:\n"
                "- Clean channels pass with zero errors.\n"
                "- All 7 single-bit error permutations (Bit 1 through Bit 7) achieve 100.0% successful correction.\n"
                "- When I click 'Double Errors', look at the outcome column: EVERY SINGLE double-error case results in 3 corrupted bits due to decoder aliasing!\n\n"
                "Below our benchmark, we provide a complete, university-standard Model Exam Paper Solution:\n"
                "- Part (a) shows codeword generation for message d = [1, 0, 1, 1], computing parity bits p1=0, p2=1, p4=0, yielding c = [0, 1, 1, 0, 0, 1, 1].\n"
                "- Part (b) demonstrates single error detection: received vector r has bit 3 flipped. Parity checks yield s1=1, s2=1, s3=0 -> Decimal 3. "
                "The decoder inverts bit 3 and restores original data.\n"
                "- Part (c) proves the double-error disaster: bits 3 and 5 flip simultaneously. Parity check s1 cancels to 0. Syndrome evaluates to Decimal 6. "
                "The decoder miscorrects Bit 6, producing 3 corrupted bits.\n"
                "- Part (d) provides the Extended SECDED solution: p0 detects that overall parity is even (P=0) while syndrome S ≠ 0, successfully halting false correction.\n\n"
                "I click 'Export CSV Evidence' to download the complete test dataset for archival and laboratory grading."
            ),
            "gujarati": (
                "સમજૂતી (26:30 - 31:30):\n"
                "'Results & Exam Answer' ટેબ ખોલો. ઉપરનું ટેસ્ટ કેસોનું ટેબલ બતાવો અને ફિલ્ટર બટન દબાવો. "
                "પછી નીચે આપેલું 'Model Exam Paper Answer' બતાવો: Part (a) માં કોડવર્ડ કેવી રીતે બન્યો, "
                "Part (b) માં 1-error કેવી રીતે સુધરી, Part (c) માં 2-errors માં કેમ 3 ભૂલો થઈ, "
                "અને Part (d) માં SECDED કેવી રીતે બચાવે છે તે સ્ટેપ-બાય-સ્ટેપ સમજાવો. 'Export CSV Evidence' બટન દબાવો."
            )
        },
        {
            "num": "Chapter 7",
            "time": "31:30 - 35:00 (3.5 min)",
            "title": "Conclusion, Practical Applications & Oral Viva Defense",
            "tab": "Stay on 'Results & Exam Answer' or switch to 'Home'",
            "actions": (
                "1. Review the 'Error Correction Limitations & Mathematical Boundaries' cards at the bottom of the page.\n"
                "2. Reiterate the real-world applications in DDR5 ECC RAM and NASA spacecraft.\n"
                "3. Answer the 2 Viva Defense questions with confidence.\n"
                "4. Thank the evaluator and conclude the presentation."
            ),
            "spoken": (
                "In conclusion, our technical defense and demonstration establish three fundamental principles of error-control coding:\n"
                "1. Hamming(7,4) is an elegant, mathematically optimal linear block code that achieves guaranteed single-error correction as a perfect code.\n"
                "2. Under two simultaneous bit errors, ordinary Hamming(7,4) experiences universal decoder aliasing because the sum of any two columns in H "
                "identically matches a third column, resulting in Silent Data Corruption.\n"
                "3. Mission-critical systems—such as server ECC RAM, aerospace telemetry, and solid-state flash memory—strictly require Extended Hamming(8,4) "
                "SECDED to ensure double errors are detected and never miscorrected.\n\n"
                "Before closing, let us answer two key oral examination defense questions:\n"
                "Question 1: 'Can ordinary Hamming(7,4) detect 2 errors?'\n"
                "Answer: Yes, but ONLY if error correction is disabled! Because t_det = d_min - 1 = 3 - 1 = 2. However, to simultaneously correct 1 error and detect 2 errors, "
                "minimum distance must be at least 4, which requires the 8th parity bit in SECDED.\n\n"
                "Question 2: 'Why is Hamming(7,4) classified as a linear code?'\n"
                "Answer: Because any linear combination—meaning the bitwise XOR sum—of any two valid codewords is also a valid codeword. The 16 valid codewords form "
                "a 4-dimensional linear subspace of vector space F_2^7.\n\n"
                "Thank you very much for your time, attention, and evaluation!"
            ),
            "gujarati": (
                "સમજૂતી (31:30 - 35:00):\n"
                "છેલ્લી 3.5 મિનિટમાં કન્ક્લુઝન આપો. હેમિંગ કોડ 1-error માટે પરફેક્ટ છે પણ 2-errors માટે હંમેશા SECDED (8-bit) જ વપરાય છે. "
                "Viva ના બંને પ્રશ્નો કોન્ફિડન્સથી બોલી જાઓ. આ રીતે સંપૂર્ણ 35 મિનિટમાં તમારો વિડીયો પૂરો થશે અને 20 માંથી પૂરા 20 માર્ક્સ મળશે!"
            )
        }
    ]

    for ch in chapters:
        h3 = doc.add_heading(f"{ch['num']}: {ch['title']} ({ch['time']})", level=3)
        h3.paragraph_format.space_before = Pt(14)

        # Web Tab
        p_tab = doc.add_paragraph()
        r_tab = p_tab.add_run(f"🌐 Web UI Tab to Display: {ch['tab']}\n")
        r_tab.bold = True
        r_tab.font.color.rgb = RGBColor(15, 118, 110)

        # Web Screen Actions
        p_act = doc.add_paragraph()
        r_act_lbl = p_act.add_run("🖥️ On-Screen Web Actions (તમારે સ્ક્રીન પર શું ક્લિક કરવું):\n")
        r_act_lbl.bold = True
        r_act_lbl.font.color.rgb = RGBColor(14, 116, 144)
        p_act.add_run(ch["actions"])

        # Spoken Narration
        p_spk = doc.add_paragraph()
        r_spk_lbl = p_spk.add_run("🗣️ Spoken Narration Script (Word-for-Word English to Speak in Video):\n")
        r_spk_lbl.bold = True
        r_spk_lbl.font.color.rgb = RGBColor(30, 58, 138)
        p_spk.add_run(f'"{ch["spoken"]}"')

        # Gujarati Explanation
        p_guj = doc.add_paragraph()
        r_guj_lbl = p_guj.add_run(f"{ch['gujarati']}\n")
        r_guj_lbl.font.italic = True
        r_guj_lbl.font.color.rgb = RGBColor(71, 85, 105)

        doc.add_paragraph()

    # Section 4: Oral Exam Defense Q&A
    doc.add_heading("4. Oral Examination Defense Q&A (પ્રોફેસર પૂછી શકે તેવા સવાલો અને જવાબો)", level=2)

    qa_list = [
        ("Q1: Why is Hamming(7,4) called a 'linear' block code?",
         "Because any linear combination (XOR sum) of two valid codewords is also a valid codeword. The set of all 16 codewords forms a 4-dimensional linear subspace of F_2^7.",
         "સમજૂતી: કારણ કે કોઈપણ 2 સાચા કોડવર્ડ્સનો XOR સરવાળો પણ એક સાચો કોડવર્ડ જ બને છે. તે F_2^7 નો 4-પરિમાણીય સબસ્પેસ છે."),

        ("Q2: What is the code rate and bandwidth overhead of Hamming(7,4)?",
         "The code rate is R = k / n = 4 / 7 ≈ 0.5714 (57.1% efficiency). The redundancy overhead is r / n = 3 / 7 ≈ 42.86%.",
         "સમજૂતી: કોડ રેટ 4/7 = 57.1% છે અને પેરિટી ઓવરહેડ 3/7 = 42.9% છે."),

        ("Q3: Why can't ordinary Hamming(7,4) simply flag an error when two bits flip instead of miscorrecting?",
         "Because the decoder only sees the syndrome vector S = col_i ⊕ col_j. Since this sum identically matches col_k, the syndrome contains NO mathematical marker indicating whether it arose from 1 error at k or 2 errors at (i, j). It is mathematically indistinguishable without an overall parity bit.",
         "સમજૂતી: કારણ કે ડીકોડરને ફક્ત સિન્ડ્રોમ S દેખાય છે. બે કોલમ નો સરવાળો ત્રીજો કોલમ જ બની જાય છે, એટલે સિન્ડ્રોમ જોઈને ખબર જ ના પડે કે 1 ભૂલ થઈ છે કે 2! આના માટે 8મો પેરિટી બીટ જ જોઈએ."),

        ("Q4: If 3 errors occur, what happens in Hamming(7,4)?",
         "If 3 errors occur such that their columns sum to [0,0,0]^T (e.g. bits 1, 2, 3), the syndrome is 0! The decoder falsely assumes NO error occurred! If their columns sum to a non-zero vector, it miscorrects.",
         "સમજૂતી: જો 3 ભૂલો થાય અને તેમનો સરવાળો 000 થઈ જાય, તો સિસ્ટમ એમ માને છે કે કોઈ એરર નથી! આને undetected error કહેવાય."),

        ("Q5: What is the Hamming Bound and why is Hamming(7,4) 'perfect'?",
         "The Hamming bound states 2^k * (1 + n) <= 2^n. For n=7, k=4: 16 * (1 + 7) = 128 = 2^7. Since equality holds, every possible 7-bit vector is within distance 1 of exactly one codeword, leaving no unused vectors.",
         "સમજૂતી: હેમિંગ બાઉન્ડ 16 * 8 = 128 = 2^7 બરાબર સરખું થાય છે, એટલે કે 128 એ 128 વેક્ટર્સ કોઈ ને કોઈ કોડવર્ડ ના 1-ડિસ્ટન્સ સ્ફિયર માં પેક થયેલા છે.")
    ]

    for q, ans, guj in qa_list:
        p_q = doc.add_paragraph()
        p_q.add_run(f"📌 {q}\n").bold = True
        p_q.add_run(f"Answer (English): {ans}\n")
        p_q.add_run(f"{guj}\n").font.italic = True
        doc.add_paragraph()

    output_path = "PRESENTATION_SCRIPT.docx"
    doc.save(output_path)
    print(f"Successfully generated 35-minute Master Word document: {output_path}")


if __name__ == "__main__":
    build_35min_web_doc()
