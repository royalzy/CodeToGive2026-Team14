from fastapi import APIRouter

from app.services.umami_report import fetch_report

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/report")
async def get_analytics_report() -> dict[str, object]:
    report = fetch_report()
    if report is None:
        return {
            "configured": False,
            "report": None,
            "error": (
                "Analytics reporting is not configured. Add UMAMI_API_KEY and "
                "UMAMI_WEBSITE_ID to enable the report."
            ),
        }
    return {"configured": True, "report": report, "error": None}
