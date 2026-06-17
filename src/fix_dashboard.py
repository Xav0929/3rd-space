#!/usr/bin/env python3
"""
3rd Space — Fix UTF-8 encoding corruption in dashboard/page.tsx
Run from your project root:
    python fix_dashboard.py
"""

import sys
import os

# ── install ftfy if missing ──────────────────────────────────────────────────
try:
    import ftfy
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "ftfy"])
    import ftfy

# ── target file ─────────────────────────────────────────────────────────────
TARGET = os.path.join("src", "app", "admin", "dashboard", "page.tsx")

if not os.path.exists(TARGET):
    print(f"ERROR: File not found: {TARGET}")
    print("Make sure you run this from the project root (where src/ lives).")
    sys.exit(1)

# ── fix function ─────────────────────────────────────────────────────────────
def fix_encoding(text: str) -> str:
    # First pass: ftfy handles most double-encoded UTF-8
    out = ftfy.fix_text(text)

    # Second pass: manual replacements for triple-encoded sequences
    # (these are what ftfy can't fully resolve — mapped from inspecting residues)
    POST_FTFY = [
        # em dash  —
        ("\u00e2\u20ac\u00e2\u20ac\u00c2",       "\u2014"),
        # × (times / multiply)
        ("\u00c3\u00c6\u0027\u00e2\u20ac\u00e2\u20ac", "\u00d7"),
        # é  (café, Café Latte placeholders)
        ("\u00c3\u00c6\u0027\u00a9",              "\u00e9"),
        # ─  (box-drawing separator in comments)
        ("\u00e2\u00e2\u20ac\u00e2\u20ac\u00c3\u00a2\u00e2\u20ac\u00c3\u00a2\u20ac",
         "\u2500"),
        # Clean up leftover ÃÆ' artifact (windows-1252 0x83 residue)
        ("\u00c3\u00c6\u0027",                    ""),
    ]
    for bad, good in POST_FTFY:
        out = out.replace(bad, good)

    return out

# ── read ─────────────────────────────────────────────────────────────────────
print(f"Reading  {TARGET} ...")
with open(TARGET, "r", encoding="utf-8", errors="replace") as f:
    original = f.read()

# ── fix ──────────────────────────────────────────────────────────────────────
fixed = fix_encoding(original)

# ── backup + write ───────────────────────────────────────────────────────────
backup = TARGET + ".bak"
with open(backup, "w", encoding="utf-8") as f:
    f.write(original)
print(f"Backup   {backup}")

with open(TARGET, "w", encoding="utf-8", newline="\n") as f:
    f.write(fixed)
print(f"Fixed    {TARGET}")
print("Done. Reload your dev server and the mojibake should be gone.")