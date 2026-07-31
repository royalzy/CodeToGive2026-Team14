"""Test isolation: point SQLite at a fresh temp database before app imports."""

import os
import tempfile
from pathlib import Path

os.environ["LOVE21_DB_PATH"] = str(Path(tempfile.mkdtemp()) / "test.db")
