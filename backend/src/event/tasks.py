import time

from celery import shared_task
from celery.utils.log import get_task_logger
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

from event.models import Content, User, Like
from datetime import datetime, date
from asgiref.sync import async_to_sync
import requests

logger = get_task_logger(__name__)

import asyncio
from aiogram import Bot

# Укажите токен вашего бота
API_TOKEN = '7517129777:AAFyHsU_fM15AqXQHdBt-e9ytG3JQJXOIqg'

# Список пользователей
USERS = [
    "adbogatov"
]

# todo: 1) Реализовать класс который умеет делать рассылку
# todo: 2) Реализвовать периодическую задачу которая осматривает избранное у всех пользователей и делает рассылку (напоминания)


from pyrogram import Client
from pyrogram.raw.functions.contacts import ResolveUsername

BOT_TOKEN = "7517129777:AAFyHsU_fM15AqXQHdBt-e9ytG3JQJXOIqg"
bot = Bot(token=API_TOKEN)

pyrogram_client = Client(
    "bot",
    api_id=6,
    api_hash="eb06d4abfb49dc3eeb1aeb98ae0f581e",
    bot_token=BOT_TOKEN,
    app_version="7.7.2",
    device_model="Lenovo Z6 Lite",
    system_version="11 R"
)


def resolve_username_to_user_id(username: str) -> int | None:
    with pyrogram_client:
        try:
            r = pyrogram_client.invoke(ResolveUsername(username=username))
            if r.users:
                return r.users[0].id
            return None
        except:
            return None


@shared_task
def sample_task():
    """Task to delete old events."""
    datetime_now = datetime.now()
    content = Content.objects.filter(date__lt=datetime_now).all()
    for event in content:
        event.delete()


@shared_task
def notification_task():
    users = User.objects.all()
    today = date.today()
    for user in users:
        # todo: проверить что по датам все корректно отрабатывает
        likes = Like.objects.filter(user=user, value=True, content__date=today)
        if likes:
            for like in likes:
                link = f"https://t.me/EventAfishaBot/strelka?startapp={like.content.id}"
                message = f"Привет! Сегодня у тебя запланировано мероприятие, напоминаю!\n\n{link}\n\n" \
                          "Хорошо тебе провести время!"
                chat_id = resolve_username_to_user_id(user.username)
                time.sleep(1)
                try:
                    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage?chat_id={chat_id}&text={message}"
                    response = requests.get(url)
                    print(f"{response}")
                except:
                    pass
