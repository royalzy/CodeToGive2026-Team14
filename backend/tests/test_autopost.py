from datetime import datetime, timedelta

from app.services.autopost import _is_due

NOW = datetime(2026, 8, 2, 12, 0, 0)


def entry(**overrides):
    base = {
        "id": "abc123",
        "platforms": ["website"],
        "scheduled_for": (NOW - timedelta(minutes=1)).isoformat(timespec="minutes"),
    }
    return {**base, **overrides}


def test_publishes_a_website_post_that_is_due():
    assert _is_due(entry(), NOW) is True


def test_leaves_a_website_post_that_is_not_due_yet():
    future = (NOW + timedelta(hours=1)).isoformat(timespec="minutes")
    assert _is_due(entry(scheduled_for=future), NOW) is False


def test_publishes_exactly_on_the_scheduled_minute():
    assert _is_due(entry(scheduled_for=NOW.isoformat(timespec="minutes")), NOW) is True


def test_never_auto_publishes_anything_targeting_meta():
    # The whole point of the restriction: a Meta call must stay manual.
    for platforms in (["instagram"], ["facebook"], ["website", "instagram"]):
        assert _is_due(entry(platforms=platforms), NOW) is False


def test_ignores_an_entry_with_an_unreadable_time():
    assert _is_due(entry(scheduled_for="not a date"), NOW) is False
    assert _is_due(entry(scheduled_for=""), NOW) is False


def test_handles_a_timezone_aware_time():
    aware = "2026-08-02T11:00:00+00:00"
    # Must not raise on comparison; naive/aware mixing would be a TypeError.
    assert _is_due(entry(scheduled_for=aware), NOW) in (True, False)
