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
    "all_myths": {
        "en": "Gotcha — all three are myths.",
        "zh": "答對了——三項全部都是迷思。",
    },
    "all_true": {
        "en": "Surprise — all three are true.",
        "zh": "意外吧——三項全部都是事實。",
    },
}

SUPPORTED_LANGS = ("en", "zh")


def normalize_lang(lang: str) -> str:
    """Any zh-* variant (zh-Hant, zh-Hans, ...) collapses to "zh"."""
    return "zh" if lang.startswith("zh") else "en"


def localized(value: dict, lang: str) -> str:
    lang = normalize_lang(lang)
    return value.get(lang) or value.get("en", "")


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

            for lang in SUPPORTED_LANGS:
                if not (st.get("text") or {}).get(lang):
                    issues.append(f"statement {sid}: missing {lang} text")
                if not (st.get("reveal") or {}).get(lang):
                    issues.append(f"statement {sid}: missing {lang} reveal")
            if st.get("status") not in {"verified", "needs-verify", "unverified"}:
                issues.append(f"statement {sid}: invalid status {st.get('status')!r}")
            source = st.get("source") or {}
            label = source.get("label") or {}
            if not all(label.get(lang) for lang in SUPPORTED_LANGS) or not source.get("url"):
                langs = "/".join(SUPPORTED_LANGS)
                issues.append(f"statement {sid}: source needs label ({langs}) and url")

            is_myth = bool(st.get("is_myth"))
            if twist == "all_myths" and not is_myth:
                issues.append(f"statement {sid}: twist is all_myths but is_myth=false")
            if twist == "all_true" and is_myth:
                issues.append(f"statement {sid}: twist is all_true but is_myth=true")
    return issues


def get_hero_round(lang: str = "en") -> dict:
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
            "kick": localized(round_.get("kick") or {}, lang),
            "twist": round_["twist"],
            "statements": [
                {"id": st["id"], "text": localized(st["text"], lang)} for st in statements
            ],
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
        "punchline": localized(TWIST_PUNCHLINES[round_["twist"]], lang),
        "selected_statement_id": selected_statement_id,
        "statements": [
            {
                "id": st["id"],
                "is_myth": st["is_myth"],
                "reveal": localized(st["reveal"], lang),
                "source": {
                    "label": localized(st["source"]["label"], lang),
                    "url": st["source"]["url"],
                },
            }
            for st in statements
        ],
    }


def get_quiz_stats() -> list[dict]:
    """Aggregate quiz attempts from SQLite for the analytics demo (PII-free)."""
    with get_connection() as conn:
        rounds = conn.execute(
            "SELECT round_id, COUNT(*) AS attempts, COUNT(DISTINCT lang) AS languages"
            " FROM quiz_attempts GROUP BY round_id ORDER BY round_id"
        ).fetchall()
        statements = conn.execute(
            "SELECT round_id, selected_statement_id, COUNT(*) AS count"
            " FROM quiz_attempts"
            " GROUP BY round_id, selected_statement_id"
            " ORDER BY count DESC"
        ).fetchall()

    by_round: dict[str, dict] = {}
    for row in rounds:
        by_round[row["round_id"]] = {
            "round_id": row["round_id"],
            "attempts": row["attempts"],
            "languages": row["languages"],
            "statements": [],
        }
    for row in statements:
        by_round[row["round_id"]]["statements"].append(
            {"statement_id": row["selected_statement_id"], "count": row["count"]}
        )
    return list(by_round.values())
