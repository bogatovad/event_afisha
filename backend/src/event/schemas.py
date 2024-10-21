from ninja import Schema
from datetime import date


class TagSchema(Schema):
    name: str
    description: str
    image: str | None = None


class ContentSchema(Schema):
    name: str
    description: str
    image: str
    contact: str
    date: date