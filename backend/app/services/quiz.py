"""Myth-buster round service.

Serves the hero "spot the myth" round from a sourced fact bank and grades
answers server-side so the answer key (``is_myth`` / ``reveal``) never
reaches the client before an answer is submitted.
"""

import json
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from app.db import get_connection

BANK_PATH = Path(__file__).resolve().parent.parent / "data" / "question_bank.json"

TWIST_PUNCHLINES = {
    "all_myths": "Gotcha — all three are myths.",
    "all_true": "Surprise — all three are true.",
}


def load_bank() -> dict:
    with BANK_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)


def validate_bank(bank: dict) -> list[str]:
    """Data-quality checks over the fact bank. Returns a list of issues."""
    issues: list[str] = []
    round_ids: set[str] = set()
    for round_ in bank.get("rounds", []):
        rid = round_.get("id")
        if not rid:
            issues.append("round without id")
            continue
        if rid in round_ids:
            issues.append(f"duplicate round id {rid}")
        round_ids.add(rid)

        statements = round_.get("statements", [])
        if len(statements) != 3:
            issues.append(f"round {rid}: expected 3 statements, got {len(statements)}")

        twist = round_.get("twist")
        if twist not in TWIST_PUNCHLINES:
            issues.append(f"round {rid}: unknown twist {twist!r}")

        statement_ids: set[str] = set()
        for st in statements:
            sid = st.get("id")
            if not sid:
                issues.append(f"round {rid}: statement without id")
                continue
            if sid in statement_ids:
                issues.append(f"round {rid}: duplicate statement id {sid}")
            statement_ids.add(sid)

            if not st.get("text"):
                issues.append(f"statement {sid}: empty text")
            if not st.get("reveal"):
                issues.append(f"statement {sid}: empty reveal")
            if st.get("status") not in {"verified", "needs-verify", "unverified"}:
                issues.append(f"statement {sid}: invalid status {st.get('status')!r}")
            source = st.get("source") or {}
            if not source.get("label") or not source.get("url"):
                issues.append(f"statement {sid}: source needs label and url")

            is_myth = bool(st.get("is_myth"))
            if twist == "all_myths" and not is_myth:
                issues.append(f"statement {sid}: twist is all_myths but is_myth=false")
            if twist == "all_true" and is_myth:
                issues.append(f"statement {sid}: twist is all_true but is_myth=true")
    return issues


def get_hero_round() -> dict:
    """The first verified round, sanitized for public consumption.

    The answer key (``is_myth``, ``reveal``, ``source``) is stripped.
    """
    bank = load_bank()
    for round_ in bank["rounds"]:
        statements = round_["statements"]
        if any(st["status"] != "verified" for st in statements):
            continue
        return {
            "id": round_["id"],
            "theme": round_.get("theme"),
            "kick": round_.get("kick"),
            "twist": round_["twist"],
            "statements": [{"id": st["id"], "text": st["text"]} for st in statements],
        }
    return {}


def grade_hero_round(round_id: str, selected_statement_id: str, lang: str = "en") -> dict | None:
    """Grade an answer, persist the attempt (PII-free), and return the reveal."""
    bank = load_bank()
    round_ = next((r for r in bank["rounds"] if r["id"] == round_id), None)
    if round_ is None:
        return None

    statements = round_["statements"]
    if selected_statement_id not in {st["id"] for st in statements}:
        return None

    reference = f"QA-{uuid4().hex[:8].upper()}"
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO quiz_attempts"
            " (id, reference, round_id, selected_statement_id, lang, answered_at)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            (
                reference,
                reference,
                round_id,
                selected_statement_id,
                lang,
                datetime.now(UTC).replace(tzinfo=None).isoformat(),
            ),
        )

    return {
        "round_id": round_id,
        "twist": round_["twist"],
        "punchline": TWIST_PUNCHLINES[round_["twist"]],
        "selected_statement_id": selected_statement_id,
        "statements": [
            {
                "id": st["id"],
                "is_myth": st["is_myth"],
                "reveal": st["reveal"],
                "source": st["source"],
            }
            for st in statements
        ],
    }
