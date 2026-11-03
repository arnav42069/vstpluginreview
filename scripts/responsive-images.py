"""Create smaller WebP delivery variants without changing the editorial image.

Requires Pillow (also used by editorial-images.py). Full-size source images remain
unchanged and are always used by the accessible enlargement links.
"""
from pathlib import Path
import json
from PIL import Image

root = Path(__file__).resolve().parent.parent
manifest = {}
for image_path in sorted((root / "public/media/articles").glob("*/*.webp")):
    with Image.open(image_path) as image:
        width, height = image.size
        variants = []
        output_dir = image_path.parent / "responsive"
        output_dir.mkdir(exist_ok=True)
        for target_width in (480, 800, 1200):
            if target_width >= width:
                continue
            target_height = round(height * target_width / width)
            output = output_dir / f"{image_path.stem}-{target_width}.webp"
            image.resize((target_width, target_height), Image.Resampling.LANCZOS).save(
                output, "WEBP", quality=90, method=6
            )
            variants.append({"src": "/" + output.relative_to(root / "public").as_posix(), "width": target_width})
        src = "/" + image_path.relative_to(root / "public").as_posix()
        variants.append({"src": src, "width": width})
        manifest[src] = {"width": width, "height": height, "variants": variants}
(root / "src/lib/image-variants.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(f"Prepared responsive delivery for {len(manifest)} original images.")
