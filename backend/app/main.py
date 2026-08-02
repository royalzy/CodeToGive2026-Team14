import asyncio
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.bookings import router as bookings_router
from app.api.routes.donations import router as donations_router
from app.api.routes.donors import router as donors_router
from app.api.routes.health import router as health_router
from app.api.routes.media import router as media_router
from app.api.routes.questionnaire import router as questionnaire_router
from app.api.routes.quiz import router as quiz_router
from app.api.routes.schedule import router as schedule_router
from app.api.routes.social import router as social_router
from app.api.routes.volunteers import router as volunteers_router
from app.core.config import settings
from app.services.autopost import run_scheduler


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Run the scheduled-post publisher alongside the API.

    Website-only posts that have reached their time are published here. The
    task is cancelled cleanly on shutdown so reloads do not leave it running.
    """
    stop = asyncio.Event()
    task = asyncio.create_task(run_scheduler(stop))
    try:
        yield
    finally:
        stop.set()
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task


app = FastAPI(
    lifespan=lifespan,
    title=settings.app_name,
    version="0.1.0",
    description=(
        "Demonstration API for the Love 21 volunteer, donation, and booking "
        "journeys. Volunteer data is discarded; donor profiles, linked demo "
        "donation intents, private wall previews, and bookings are persisted "
        "to a local SQLite store."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origin_list,
    # True on main: the donor session cookie needs credentialed requests.
    allow_credentials=True,
    # DELETE is needed so the admin can remove a website post from the browser.
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.include_router(health_router)
app.include_router(volunteers_router, prefix="/api/v1")
app.include_router(donations_router, prefix="/api/v1")
app.include_router(donors_router, prefix="/api/v1")
app.include_router(bookings_router, prefix="/api/v1")
app.include_router(questionnaire_router, prefix="/api/v1")
app.include_router(quiz_router, prefix="/api/v1")
app.include_router(social_router, prefix="/api/v1")
app.include_router(media_router, prefix="/api/v1")
app.include_router(schedule_router, prefix="/api/v1")
