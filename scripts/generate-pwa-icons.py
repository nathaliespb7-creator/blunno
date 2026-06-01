#!/usr/bin/env python3
"""Generate PWA icons: blue background + centered mascot sized for iOS home screen."""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "blunno-mascot-make-v23.png"
# Deep app blue — reads clearly on iOS/Android home screens
BG = (21, 48, 102)  # #153066
# Fits inside iOS squircle / Android circle — mascot sits on blue pad, not clipped at edges
FILL = 0.66
# No bleed zoom — keeps blue padding visible under iOS squircle / Android mask
IOS_BLEED = 1.0
PWA_BLEED = 1.0
# Android adaptive icon safe zone (~66% diameter inner circle)
MASKABLE_FILL = 0.44


def compose_icon(
    src: Image.Image,
    size: int,
    *,
    bleed: float = 1.0,
    fill: float = FILL,
) -> Image.Image:
    im = src.convert("RGBA")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    w, h = im.size
    scale = min(size * fill / w, size * fill / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (*BG, 255))
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.paste(im, (x, y), im)

    if bleed > 1.0:
        bigger = int(size * bleed)
        canvas = canvas.resize((bigger, bigger), Image.Resampling.LANCZOS)
        offset = (bigger - size) // 2
        canvas = canvas.crop((offset, offset, offset + size, offset + size))

    return canvas.convert("RGB")


def main() -> None:
    base = Image.open(SRC)
    out: list[tuple[Path, int, float, float]] = [
        (ROOT / "public" / "apple-touch-icon-v10.png", 180, IOS_BLEED, FILL),
        (ROOT / "public" / "icon-192.png", 192, PWA_BLEED, FILL),
        (ROOT / "public" / "icon-512.png", 512, PWA_BLEED, FILL),
        (ROOT / "public" / "icon-512-maskable.png", 512, 1.0, MASKABLE_FILL),
        (ROOT / "app" / "apple-icon.png", 180, IOS_BLEED, FILL),
        (ROOT / "app" / "icon.png", 32, 1.0, 0.62),
    ]
    for path, dim, bleed, fill in out:
        img = compose_icon(base, dim, bleed=bleed, fill=fill)
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "PNG", optimize=True)
        print(f"Wrote {path} ({dim}x{dim}, fill={fill}, bleed={bleed}, mode={img.mode})")

    legacy = ROOT / "public" / "apple-touch-icon.png"
    shutil.copy2(ROOT / "public" / "apple-touch-icon-v10.png", legacy)
    print(f"Copied apple-touch-icon-v10.png -> {legacy}")


if __name__ == "__main__":
    main()
