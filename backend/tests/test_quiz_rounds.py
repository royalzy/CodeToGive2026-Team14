from app.services.quiz import (
    TWIST_PUNCHLINES,
    get_hero_round,
    get_quiz_stats,
    grade_hero_round,
    load_bank,
    validate_bank,
)


def test_bank_passes_data_quality_checks():
    assert validate_bank(load_bank()) == []


def test_hero_round_is_sanitized_no_answer_key_leak():
    round_ = get_hero_round()
    assert round_["id"] == "rw-001"
    assert len(round_["statements"]) == 3
    for st in round_["statements"]:
        assert set(st) == {"id", "text"}
        assert "is_myth" not in st
        assert "reveal" not in st
        assert "source" not in st


def test_grading_reveals_all_statements_and_punchline():
    reveal = grade_hero_round("rw-001", "st-001a", lang="en")
    assert reveal is not None
    assert reveal["twist"] == "all_myths"
    assert reveal["punchline"] == TWIST_PUNCHLINES["all_myths"]["en"]
    assert len(reveal["statements"]) == 3
    assert all(st["is_myth"] for st in reveal["statements"])
    assert all(st["reveal"] and st["source"]["label"] for st in reveal["statements"])


def test_hero_round_is_localized():
    en_round = get_hero_round(lang="en")
    zh_round = get_hero_round(lang="zh-Hant")
    assert en_round["kick"] != zh_round["kick"]
    for en_st, zh_st in zip(en_round["statements"], zh_round["statements"], strict=True):
        assert en_st["text"] != zh_st["text"]


def test_grading_reveal_is_localized():
    reveal = grade_hero_round("rw-001", "st-001a", lang="zh")
    assert reveal is not None
    assert reveal["punchline"] == TWIST_PUNCHLINES["all_myths"]["zh"]
    for st in reveal["statements"]:
        assert st["reveal"]
        assert st["source"]["label"]


def test_unknown_round_or_statement_returns_none():
    assert grade_hero_round("nope", "st-001a") is None
    assert grade_hero_round("rw-001", "st-999") is None


def test_attempt_is_persisted_pii_free():
    reveal = grade_hero_round("rw-001", "st-001c", lang="zh")
    assert reveal is not None

    from app.db import get_connection

    with get_connection() as conn:
        rows = conn.execute(
            "SELECT round_id, selected_statement_id, lang FROM quiz_attempts"
            " WHERE round_id = ? AND selected_statement_id = ? AND lang = ?",
            ("rw-001", "st-001c", "zh"),
        ).fetchall()
    assert len(rows) == 1
    assert rows[0]["lang"] == "zh"


def test_quiz_stats_aggregates_attempts():
    grade_hero_round("rw-001", "st-001a", lang="en")
    grade_hero_round("rw-001", "st-001b", lang="en")
    grade_hero_round("rw-001", "st-001c", lang="zh")

    stats = get_quiz_stats()
    row = next((r for r in stats if r["round_id"] == "rw-001"), None)
    assert row is not None
    assert row["attempts"] >= 3
    assert row["languages"] >= 2
    assert {s["statement_id"] for s in row["statements"]} >= {
        "st-001a",
        "st-001b",
        "st-001c",
    }
