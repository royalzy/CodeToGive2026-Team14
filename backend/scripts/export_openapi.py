import json
from pathlib import Path

from app.main import app

project_root = Path(__file__).resolve().parents[1]
output_path = project_root / "openapi.json"
output_path.write_text(
    json.dumps(app.openapi(), indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)
print(f"Wrote {output_path}")
