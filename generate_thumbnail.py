import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_youtube_thumbnail(output_path="youtube_thumbnail.png"):
    width = 1280
    height = 720
    
    # 1. Base Image - Deep Midnight Blue / Slate Gradient
    img = Image.new("RGBA", (width, height), (11, 15, 25, 255))
    draw = ImageDraw.Draw(img)
    
    # Gradient overlay
    for y in range(height):
        ratio = y / height
        r = int(11 + (17 - 11) * ratio)
        g = int(15 + (24 - 15) * ratio)
        b = int(25 + (39 - 25) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        
    # Grid pattern & subtle glowing nodes
    grid_spacing = 40
    for x in range(0, width, grid_spacing):
        draw.line([(x, 0), (x, height)], fill=(30, 41, 59, 45), width=1)
    for y in range(0, height, grid_spacing):
        draw.line([(0, y), (width, y)], fill=(30, 41, 59, 45), width=1)
        
    # Glowing ambient circles in background
    glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    # Cyan glow on top-left
    glow_draw.ellipse([(-100, -100), (450, 450)], fill=(14, 165, 233, 40))
    # Red glow on bottom-right
    glow_draw.ellipse([(850, 350), (1450, 900)], fill=(239, 68, 68, 45))
    # Green glow on bottom-left
    glow_draw.ellipse([(100, 350), (600, 850)], fill=(16, 185, 129, 35))
    
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, glow_layer)
    draw = ImageDraw.Draw(img)

    # Load Fonts
    font_dir = "/System/Library/Fonts/Supplemental/"
    try:
        font_massive = ImageFont.truetype(os.path.join(font_dir, "Arial Black.ttf"), 68)
        font_submassive = ImageFont.truetype(os.path.join(font_dir, "Impact.ttf"), 54)
        font_large_bold = ImageFont.truetype(os.path.join(font_dir, "Arial Bold.ttf"), 36)
        font_med_bold = ImageFont.truetype(os.path.join(font_dir, "Arial Bold.ttf"), 26)
        font_med = ImageFont.truetype(os.path.join(font_dir, "Arial.ttf"), 22)
        font_small_bold = ImageFont.truetype(os.path.join(font_dir, "Arial Bold.ttf"), 18)
        font_mono = ImageFont.truetype("/System/Library/Fonts/Monaco.ttf", 20)
    except Exception:
        font_massive = ImageFont.load_default()
        font_submassive = ImageFont.load_default()
        font_large_bold = ImageFont.load_default()
        font_med_bold = ImageFont.load_default()
        font_med = ImageFont.load_default()
        font_small_bold = ImageFont.load_default()
        font_mono = ImageFont.load_default()

    # 2. Top Badges
    # Left Badge
    badge_left_w, badge_left_h = 360, 42
    draw.rounded_rectangle([(45, 30), (45 + badge_left_w, 30 + badge_left_h)], radius=21, fill=(15, 23, 42, 220), outline=(56, 189, 248, 180), width=2)
    draw.text((70, 41), "⚡ COMPUTER SCIENCE • CODING THEORY", fill=(56, 189, 248), font=font_small_bold)
    
    # Right Badge
    badge_right_w, badge_right_h = 320, 42
    badge_rx = width - 45 - badge_right_w
    draw.rounded_rectangle([(badge_rx, 30), (badge_rx + badge_right_w, 30 + badge_right_h)], radius=21, fill=(15, 23, 42, 220), outline=(245, 158, 11, 180), width=2)
    draw.text((badge_rx + 25, 41), "🏆 20 / 20 MARKS DEFENSE", fill=(251, 191, 36), font=font_small_bold)

    # 3. Main Title
    # Drop shadow for main title
    draw.text((49, 94), "HAMMING (7,4) CODE", fill=(2, 6, 23, 200), font=font_massive)
    draw.text((45, 90), "HAMMING (7,4) CODE", fill=(255, 255, 255), font=font_massive)
    
    # Subtitle with strong warning yellow / red
    draw.text((48, 172), "WHY 2 ERRORS DESTROY DATA?", fill=(2, 6, 23, 220), font=font_submassive)
    draw.text((45, 170), "WHY 2 ERRORS DESTROY DATA?", fill=(250, 204, 21), font=font_submassive)

    # 4. Comparison Cards (Left: 1-Error, Right: 2-Errors)
    card_y = 255
    card_h = 365
    card_w = 540
    card_left_x = 45
    card_right_x = width - 45 - card_w

    # --- LEFT CARD: 1-BIT ERROR (GREEN / SAFE) ---
    # Outer Glow / Border
    draw.rounded_rectangle(
        [(card_left_x, card_y), (card_left_x + card_w, card_y + card_h)],
        radius=24,
        fill=(15, 23, 42, 240),
        outline=(16, 185, 129, 255),
        width=3
    )
    # Header Pill (Green)
    draw.rounded_rectangle(
        [(card_left_x + 25, card_y + 25), (card_left_x + card_w - 25, card_y + 90)],
        radius=14,
        fill=(6, 78, 59, 220),
        outline=(16, 185, 129, 200),
        width=2
    )
    draw.text((card_left_x + 45, card_y + 38), "SINGLE BIT ERROR", fill=(52, 211, 153), font=font_large_bold)
    draw.text((card_left_x + 375, card_y + 42), "✓ 100% FIXED", fill=(209, 250, 229), font=font_med_bold)

    # Details
    draw.text((card_left_x + 35, card_y + 115), "1 Bit Flips:  c₃ (d₁) 1 → 0", fill=(226, 232, 240), font=font_med_bold)
    draw.text((card_left_x + 35, card_y + 160), "Syndrome Vector:", fill=(148, 163, 184), font=font_med)
    draw.text((card_left_x + 35, card_y + 195), "S = col₃(H) = [1, 1, 0]ᵀ (Position 3)", fill=(56, 189, 248), font=font_mono)
    
    # Action Box
    draw.rounded_rectangle(
        [(card_left_x + 25, card_y + 245), (card_left_x + card_w - 25, card_y + 335)],
        radius=14,
        fill=(16, 185, 129, 30),
        outline=(16, 185, 129, 150),
        width=1
    )
    draw.text((card_left_x + 45, card_y + 258), "Decoder Action: Invert Bit 3", fill=(255, 255, 255), font=font_med_bold)
    draw.text((card_left_x + 45, card_y + 295), "Result: 0 ERRORS REMAINING (SAFE)", fill=(52, 211, 153), font=font_med_bold)

    # --- RIGHT CARD: 2-BIT ERRORS (RED / CATASTROPHIC) ---
    draw.rounded_rectangle(
        [(card_right_x, card_y), (card_right_x + card_w, card_y + card_h)],
        radius=24,
        fill=(15, 23, 42, 240),
        outline=(239, 68, 68, 255),
        width=3
    )
    # Header Pill (Red)
    draw.rounded_rectangle(
        [(card_right_x + 25, card_y + 25), (card_right_x + card_w - 25, card_y + 90)],
        radius=14,
        fill=(127, 29, 29, 220),
        outline=(239, 68, 68, 200),
        width=2
    )
    draw.text((card_right_x + 45, card_y + 38), "DOUBLE BIT ERROR", fill=(248, 113, 113), font=font_large_bold)
    draw.text((card_right_x + 360, card_y + 42), "⚠ FAILS!", fill=(254, 202, 202), font=font_med_bold)

    # Details
    draw.text((card_right_x + 35, card_y + 115), "2 Bits Flip:  Bits 3 & 5 Corrupted", fill=(226, 232, 240), font=font_med_bold)
    draw.text((card_right_x + 35, card_y + 160), "Decoder Aliasing Trap:", fill=(148, 163, 184), font=font_med)
    draw.text((card_right_x + 35, card_y + 195), "col₃ ⊕ col₅ = col₆  (Misidentifies Bit 6!)", fill=(248, 113, 113), font=font_mono)

    # Action Box (Warning)
    draw.rounded_rectangle(
        [(card_right_x + 25, card_y + 245), (card_right_x + card_w - 25, card_y + 335)],
        radius=14,
        fill=(239, 68, 68, 30),
        outline=(239, 68, 68, 180),
        width=1
    )
    draw.text((card_right_x + 45, card_y + 258), "Decoder Flips Innocent Bit 6!", fill=(255, 255, 255), font=font_med_bold)
    draw.text((card_right_x + 45, card_y + 295), "Result: 3 CORRUPTED BITS! (SDC)", fill=(248, 113, 113), font=font_med_bold)

    # --- CENTER 'VS' BADGE ---
    vs_cx = width // 2
    vs_cy = card_y + (card_h // 2)
    vs_r = 44
    draw.ellipse(
        [(vs_cx - vs_r, vs_cy - vs_r), (vs_cx + vs_r, vs_cy + vs_r)],
        fill=(15, 23, 42, 255),
        outline=(250, 204, 21, 255),
        width=3
    )
    draw.text((vs_cx - 20, vs_cy - 18), "VS", fill=(250, 204, 21), font=font_large_bold)

    # 5. Bottom Solution Banner
    bar_y = height - 68
    bar_h = 48
    draw.rounded_rectangle(
        [(45, bar_y), (width - 45, bar_y + bar_h)],
        radius=14,
        fill=(30, 41, 59, 200),
        outline=(147, 51, 234, 180),
        width=2
    )
    draw.text(
        (65, bar_y + 12),
        "🛡️ THE FIX: Extended SECDED Hamming(8,4) with Overall Parity  (d_min = 4)",
        fill=(216, 180, 254),
        font=font_med_bold
    )
    draw.text(
        (width - 365, bar_y + 13),
        "Interactive Simulation + Math Proof",
        fill=(148, 163, 184),
        font=font_small_bold
    )

    # Save Thumbnail
    img.save(output_path, "PNG", quality=95)
    print(f"Thumbnail successfully created at: {output_path}")

if __name__ == "__main__":
    create_youtube_thumbnail("youtube_thumbnail.png")
    # Also save inside frontend/public so user can view/download it directly
    create_youtube_thumbnail("frontend/public/youtube_thumbnail.png")
