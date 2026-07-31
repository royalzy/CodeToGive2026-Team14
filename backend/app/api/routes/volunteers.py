from fastapi import APIRouter, status

from app.schemas.volunteer import (
    VolunteerApplicationRequest,
    VolunteerApplicationResponse,
)

router = APIRouter(prefix="/volunteer-applications", tags=["volunteer"])


@router.post(
    "",
    response_model=VolunteerApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_volunteer_application(
    application: VolunteerApplicationRequest,
) -> VolunteerApplicationResponse:
    # The prototype deliberately validates and discards the submitted data.
    # Avoid logging `application`: it contains personally identifiable information.
    return VolunteerApplicationResponse.create(application)
