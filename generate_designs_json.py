import os, json

BASE = os.path.join("assets", "designs")
OUT = os.path.join("data", "designs.json")
VALID_EXT = (".jpg", ".jpeg", ".png", ".webp")

items = []
for collection in sorted(os.listdir(BASE)):
    folder = os.path.join(BASE, collection)
    if not os.path.isdir(folder):
        continue

    for fname in sorted(os.listdir(folder)):
        if not fname.lower().endswith(VALID_EXT):
            continue

        design_id = os.path.splitext(fname)[0]
        items.append({
            "id": design_id,
            "name": f"Design {design_id}",
            "collection": collection,
            "file": fname,
            "tags": []
        })

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(items, f, indent=2)

print(f"✅ Created {OUT} with {len(items)} designs")
