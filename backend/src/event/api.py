from ninja_extra import NinjaExtraAPI

from http import HTTPStatus
from ninja_extra import api_controller, route
from event.models import Tags, Content
from event.schemas import TagSchema, ContentSchema
from datetime import datetime
from django.db.models import Q


@api_controller(
    prefix_or_class="/health",
)
class HealthController:
    @route.get(
        path="",
        response={
            200: None,
        },
    )
    def health_check(self):
        return HTTPStatus.OK


@api_controller(
    prefix_or_class="/api/v1",
)
class TagsController:
    @route.get(
        path="/tags",
        response={
            200: list[TagSchema],
        },
    )
    def get_tags(self):
        tags = Tags.objects.all()
        result = [tag for tag in tags if tag.contents.count() > 0]
        return result


@api_controller(
    prefix_or_class="/api/v1",
)
class ContentController:
    @route.get(
        path="/contents",
        response={
            200: list[ContentSchema],
        },
    )
    def get_content(self, tag: str, date_start: datetime | None = None, date_end: datetime | None = None) ->\
            list[ContentSchema]:
        q_filter = Q(tags__name=tag)
        if date_start and date_end:
            q_filter &= Q(date__gte=date_start) & Q(date__lte=date_end)
        if date_start and not date_end:
            q_filter &= Q(date=date_start)
        content = Content.objects.filter(q_filter)
        return content


api = NinjaExtraAPI(title="afisha", version="0.0.1")
api.register_controllers(
    HealthController,
    TagsController,
    ContentController
)
