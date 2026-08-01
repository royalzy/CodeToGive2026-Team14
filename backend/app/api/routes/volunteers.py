from fastapi import APIRouter, BackgroundTasks, status

from app.schemas.volunteer import (
    VolunteerApplicationRequest,
    VolunteerApplicationResponse,
)
from app.services.umami import track_event

router = APIRouter(prefix="/volunteer-applications", tags=["volunteer"])


@router.post(
    "",
    response_model=VolunteerApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_volunteer_application(
    application: VolunteerApplicationRequest,
    background_tasks: BackgroundTasks,
) -> VolunteerApplicationResponse:
    # The prototype deliberately validates and discards the submitted data.
    # Avoid logging `application`: it contains personally identifiable information.
    background_tasks.add_task(
        track_event,
        "volunteer_application",
        {
            "interests": list(application.interests),
            "availability": application.availability,
        },
        url="https://love21.org/volunteer",
    )
    return VolunteerApplicationResponse.create()

