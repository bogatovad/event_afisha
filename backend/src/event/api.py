from ninja_extra import NinjaExtraAPI

from http import HTTPStatus
from ninja_extra import api_controller, route
from event.models import Tags, Content
from event.schemas import TagSchema, ContentSchema


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
    def get_content(self, tag: str):
        content = Content.objects.filter(tags__name=tag)
        return content


api = NinjaExtraAPI(title="afisha", version="0.0.1")
api.register_controllers(
    HealthController,
    TagsController,
    ContentController
)