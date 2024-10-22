from ninja import Schema
from datetime import date


class TagSchema(Schema):
    name: str
    description: str
    image: str | None = None


class ContentSchema(Schema):
    id: int
    name: str
    description: str
    image: str
    contact: str
    date: date


class LikeSchema(Schema):
    user: str
    content: int
    value: bool


class LikeRequestSchema(Schema):
    username: str
    content_id: int
