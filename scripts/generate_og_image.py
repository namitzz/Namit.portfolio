"""
Generate the Open Graph preview image for the portfolio.

Output: public/og-image.png at exactly 1200 x 630, matching the portfolio's
base theme (#08070d -> #160f18 dark gradient, #FF7A59 accent).

Run from the repo root:
    python scripts/generate_og_image.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ---------- Layout constants ----------
WIDTH, HEIGHT = 1200, 630
BG_FROM = (8, 7, 13)
BG_TO = (22, 15, 24)
ACCENT = (255, 122, 89)
ACCENT_2 = (107, 227, 214)
INK = (245, 245, 245)
MUTED = (160, 160, 175)
CHIP_BG = (255, 255, 255, 18)   # white at ~7% alpha
CHIP_BORDER = (255, 255, 255, 38)

PROJECTS = [
    "UniWise",
    "Posture AI",
    "Cloud Seven Realty",
    "Crime Prediction",
    "Course Companion",
]


def find_font(candidates, size):
    """Return the first font in `candidates` that loads, else Pillow default."""
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def text_width(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]


def text_height(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[3] - bbox[1]


def build():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_FROM)

    # Diagonal gradient (BG_FROM -> BG_TO).
    grad = Image.new("RGB", (WIDTH, HEIGHT))
    for y in range(HEIGHT):
        t = y / HEIGHT
        r = int(BG_FROM[0] + (BG_TO[0] - BG_FROM[0]) * t)
        g = int(BG_FROM[1] + (BG_TO[1] - BG_FROM[1]) * t)
        b = int(BG_FROM[2] + (BG_TO[2] - BG_FROM[2]) * t)
        for x in range(WIDTH):
            tx = x / WIDTH
            # tiny right-side warmth so the accent glow reads
            mix = 0.6 * t + 0.4 * tx
            rr = int(BG_FROM[0] + (BG_TO[0] - BG_FROM[0]) * mix)
            gg = int(BG_FROM[1] + (BG_TO[1] - BG_FROM[1]) * mix)
            bb = int(BG_FROM[2] + (BG_TO[2] - BG_FROM[2]) * mix)
            grad.putpixel((x, y), (rr, gg, bb))
    img = grad

    # Accent radial glow (top-left). Painted as a blurred circle.
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-200, -240, 700, 540], fill=(*ACCENT, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(140))
    img = Image.alpha_composite(img.convert("RGBA"), glow)

    # Secondary cool glow (bottom-right).
    glow2 = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g2d = ImageDraw.Draw(glow2)
    g2d.ellipse([WIDTH - 600, HEIGHT - 480, WIDTH + 200, HEIGHT + 200],
                fill=(*ACCENT_2, 45))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(160))
    img = Image.alpha_composite(img, glow2)

    img = img.convert("RGB")
    draw = ImageDraw.Draw(img, "RGBA")

    # ---------- Fonts ----------
    # Prefer Inter / Space Grotesk if present; fall back to common Windows fonts.
    display = find_font(
        ["SpaceGrotesk-SemiBold.ttf", "SpaceGrotesk-Bold.ttf",
         "Inter-SemiBold.ttf", "segoeuib.ttf", "arialbd.ttf"],
        size=92,
    )
    subtitle = find_font(
        ["Inter-Medium.ttf", "segoeui.ttf", "arial.ttf"],
        size=30,
    )
    tagline = find_font(
        ["Inter-Regular.ttf", "segoeui.ttf", "arial.ttf"],
        size=34,
    )
    eyebrow = find_font(
        ["Inter-SemiBold.ttf", "segoeuib.ttf", "arialbd.ttf"],
        size=18,
    )
    chip_font = find_font(
        ["Inter-Medium.ttf", "segoeui.ttf", "arial.ttf"],
        size=20,
    )
    url_font = find_font(
        ["JetBrainsMono-Regular.ttf", "consola.ttf", "courier.ttf"],
        size=22,
    )

    # ---------- Padding ----------
    pad_x = 80
    y = 70

    # Top row: accent dot + PORTFOLIO label
    dot_r = 7
    draw.ellipse(
        [pad_x, y + 8, pad_x + dot_r * 2, y + 8 + dot_r * 2],
        fill=ACCENT,
    )
    draw.text(
        (pad_x + 26, y + 2),
        "PORTFOLIO  ·  AI, FULL-STACK,HUMAN-CENTRED TECH",
        font=eyebrow,
        fill=(200, 200, 215),
        spacing=4,
    )

    # Name
    y_name = 150
    draw.text((pad_x, y_name), "Namit Singh Sarna", font=display, fill=INK)

    # Subtitle
    subtitle_text = "Final-year Computer Science  ·  University of Leicester"
    y_sub = y_name + 120
    draw.text((pad_x, y_sub), subtitle_text, font=subtitle, fill=MUTED)

    # Accent rule under subtitle
    y_rule = y_sub + 56
    draw.rectangle(
        [pad_x, y_rule, pad_x + 64, y_rule + 3],
        fill=ACCENT,
    )

    # Tagline (two lines if needed)
    tagline_lines = [
        "Practical AI and software for learning, trust,",
        "and real-world decisions.",
    ]
    y_tag = y_rule + 28
    for line in tagline_lines:
        draw.text((pad_x, y_tag), line, font=tagline, fill=INK)
        y_tag += 46

    # Project chips row
    chip_y = HEIGHT - 140
    chip_h = 38
    gap = 12
    cx = pad_x
    for name in PROJECTS:
        w = text_width(draw, name, chip_font) + 30
        # rounded rect
        draw.rounded_rectangle(
            [cx, chip_y, cx + w, chip_y + chip_h],
            radius=999,
            fill=(255, 255, 255, 18),
            outline=(255, 255, 255, 50),
            width=1,
        )
        # text
        text_h = text_height(draw, name, chip_font)
        draw.text(
            (cx + 15, chip_y + (chip_h - text_h) // 2 - 2),
            name,
            font=chip_font,
            fill=(225, 225, 235),
        )
        cx += w + gap

    # Bottom-right URL
    url = "namit-portfolio-theta.vercel.app"
    url_w = text_width(draw, url, url_font)
    url_h = text_height(draw, url, url_font)
    draw.text(
        (WIDTH - pad_x - url_w, HEIGHT - 60 - url_h),
        url,
        font=url_font,
        fill=(200, 200, 215),
    )

    # Bottom rule
    draw.rectangle(
        [pad_x, HEIGHT - 38, WIDTH - pad_x, HEIGHT - 37],
        fill=(255, 255, 255, 25),
    )

    return img


def main():
    out_dir = Path(__file__).resolve().parents[1] / "public"
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / "og-image.png"
    img = build()
    img.save(out, "PNG", optimize=True)
    print(f"Wrote {out} ({out.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
