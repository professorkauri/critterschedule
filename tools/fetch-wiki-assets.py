"""Download local assets from https://dreamlightvalleywiki.com/Critters-related file paths.
Run from the project folder with: python tools/fetch-wiki-assets.py
"""
from __future__ import annotations

import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://dreamlightvalleywiki.com/Special:FilePath/"


def asset_file(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9._-]", "", re.sub(r"\s+", "-", name.strip())).lower()


def download(file_name: str, folder: str) -> None:
    out = ROOT / "assets" / folder / asset_file(file_name)
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists() and out.stat().st_size > 0:
        return
    url = BASE + urllib.parse.quote(file_name.replace(" ", "_"))
    print(f"Downloading {file_name} -> {out.relative_to(ROOT)}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as response:
            out.write_bytes(response.read())
    except Exception as exc:
        print(f"  Could not download {file_name}: {exc}")


CRITTER_FILES = []
FOOD_FILES = []
AREA_FILES = [
    "Dreamlight Valley.png",
    "Eternity Isle.png",
    "Storybook Vale.png",
    "Wishblossom Mountains.png",
]
LOCATION_FILES = []

text = (ROOT / "critters.js").read_text(encoding="utf-8")
for match in re.finditer(r'c\([^,]+,\s*"[^"]+",\s*"([^"]+)"', text):
    CRITTER_FILES.append(match.group(1))
for match in re.finditer(r'"location",|', text):
    pass

for match in re.finditer(r'c\([^\n]+?"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"', text):
    area = match.group(3)
    location = match.group(4)
    food = match.group(5)
    if food.lower() in {
        "5-star meal",
        "5-star meals",
        "5-star dessert meal",
        "5-star vegetable meal",
    }:
        FOOD_FILES.append("Menu Icon Meals.png")
    elif "flowers" in food.lower():
        FOOD_FILES.append("Menu Icon Flowers.png")
    else:
        FOOD_FILES.append(f"{food}.png")
    AREA_FILES.append(f"{area}.png")
    LOCATION_FILES.append(f"{location}.png")

for folder, files in {
    "critters": CRITTER_FILES,
    "foods": FOOD_FILES,
    "areas": AREA_FILES,
    "locations": LOCATION_FILES,
}.items():
    for file_name in sorted(set(files)):
        download(file_name, folder)
