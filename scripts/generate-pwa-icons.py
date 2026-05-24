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
# Air around mascot — blue fills squircle like native icons
FILL = 0.68
# Upscale + center-crop compensates for iOS web-clip inset on home screen
IOS_BLEED = 1.22
PWA_BLEED = 1.18


def compose_icon(src: Image.Image, size: int, *, bleed: float = 1.0) -> Image.Image:
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

    if bleed > 1.0:
        bigger = int(size * bleed)
        canvas = canvas.resize((bigger, bigger), Image.Resampling.LANCZOS)
        offset = (bigger - size) // 2
        canvas = canvas.crop((offset, offset, offset + size, offset + size))

    return canvas.convert("RGB")


def main() -> None:
    base = Image.open(SRC)
    out: list[tuple[Path, int, float]] = [
        (ROOT / "public" / "apple-touch-icon-v6.png", 180, IOS_BLEED),
        (ROOT / "public" / "icon-192.png", 192, PWA_BLEED),
        (ROOT / "public" / "icon-512.png", 512, PWA_BLEED),
        (ROOT / "app" / "apple-icon.png", 180, IOS_BLEED),
        (ROOT / "app" / "icon.png", 32, 1.0),
    ]
    for path, dim, bleed in out:
        img = compose_icon(base, dim, bleed=bleed)
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "PNG", optimize=True)
        print(f"Wrote {path} ({dim}x{dim}, bleed={bleed}, mode={img.mode})")

    legacy = ROOT / "public" / "apple-touch-icon.png"
    shutil.copy2(ROOT / "public" / "apple-touch-icon-v6.png", legacy)
    print(f"Copied apple-touch-icon-v6.png -> {legacy}")


if __name__ == "__main__":
    main()
