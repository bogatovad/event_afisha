from ninja import Schema
from datetime import datetime

class TagSchema(Schema):
    name: str
    description: str
    image: str | None = None

class ContentSchema(Schema):
    name: str
    description: str
    image: str
    contact: str
    date: datetime