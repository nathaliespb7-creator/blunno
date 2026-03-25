#!/usr/bin/env python3
"""Generate PWA icons from blunno.png: crop transparency, scale up, solid brand background."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "blunno.png"
# Brand lavender (matches UI); reads well on home screen grids
BG = (189, 178, 255)
# Fill ratio: larger = bigger mascot on tile (0.88–0.92 is typical for non-full-bleed art)
FILL = 0.9


def compose_icon(src: Image.Image, size: int) -> Image.Image:
    im = src.convert("RGBA")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    w, h = im.size
    scale = min(size * FILL / w, size * FILL / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (*BG, 255))
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.paste(im, (x, y), im)
    return canvas.convert("RGB")


def main() -> None:
    base = Image.open(SRC)
    out = [
        (ROOT / "public" / "apple-touch-icon.png", 180),
        (ROOT / "public" / "icon-192.png", 192),
        (ROOT / "public" / "icon-512.png", 512),
        (ROOT / "app" / "icon.png", 32),
    ]
    for path, dim in out:
        img = compose_icon(base, dim)
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "PNG", optimize=True)
        print(f"Wrote {path} ({dim}x{dim})")


if __name__ == "__main__":
    main()
