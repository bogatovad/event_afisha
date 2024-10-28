from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
import asyncio

from aiogram.types import ReplyKeyboardMarkup
from minio import Minio
import django
import os
from aiogram import F
from aiogram.types.input_file import BufferedInputFile
from aiogram.utils.keyboard import ReplyKeyboardBuilder
import aioredis
from aiogram.exceptions import TelegramBadRequest
from event.text_analisys import LLMTextAnalysis

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()


from event.models import Content, Tags, Like, User


bot = Bot(os.getenv("BOT_TOKEN"))
dp = Dispatcher()
global_counter: dict[tuple[str, str]] = {}
history_user_button = {}

client: Minio = Minio(
        os.getenv("MINIO_URL", "minio:9000"),
        access_key=os.getenv("ACCESS_KEY"),
        secret_key=os.getenv("SECRET_KEY"),
        secure=False,
    )
redis = aioredis.from_url("redis://redis")


class DjangoObject:
    def __init__(self):
        self.user = User.objects
        self.content = Content.objects
        self.tags = Tags.objects
        self.like = Like.objects


django_object = DjangoObject()


def create_username(message: types.Message) -> str:
    if message.chat.username is None:
        return str(message.from_user.id)
    return message.chat.username


async def check_user(message: types.Message):
    username = create_username(message)
    exists = await django_object.user.filter(username=username).aexists()

    if not exists:
        await django_object.user.acreate(username=username)


@dp.message(F.photo)
async def any_message(message: types.Message):
    from datetime import datetime
    from io import BytesIO

    image = BytesIO()
    llm_text_analysis = LLMTextAnalysis()
    #print(message.photo)

    from django.db import models
    from django.core.files import File
    from PIL import Image

    file = message.photo[0]
    file_tg = await bot.get_file(file.file_id)
    download_file = await bot.download_file(file_tg.file_path)

    image = Image.open(download_file)

    print('file', File(download_file))
    tag = Tags.objects.filter(name='Кино').first()

    #mage = File(download_file)
    content = Content(
        name='test_name',
        description='test_desc',
        #image=image,
        contact='test_contact',
        date=datetime.fromisoformat('2024-10-28')
    )
    content.image.save(name='test.jpg', content=File(download_file))
    content.save()
    content.tags.add(tag)

    # date = llm_text_analysis.extract_date(message.caption)
    # date_datetime = datetime.fromisoformat(date)
    # time.sleep(5)
    # category = llm_text_analysis.extract_category(message.caption)
    # time.sleep(5)
    # description = llm_text_analysis.shorten_text(message.caption)
    # time.sleep(5)
    # name = llm_text_analysis.extract_name_event(message.caption)
    #
    # print(name)
    # print(description)
    # print(date_datetime)
    # print(category)


    await message.answer(
        "Hello, world!",
    )


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await check_user(message)

    tags = django_object.tags.all()
    builder = ReplyKeyboardBuilder()

    for tag in tags:
        if tag.contents.count() > 0:
            builder.add(types.KeyboardButton(text=tag.name))

    builder.adjust(2)
    await message.answer("Привет! Давай подберем тебе мероприятия, выбери категорию",
                         reply_markup=builder.as_markup(resize_keyboard=True))


async def get_back_or_go_keyboard(message: types.Message):
    kb = [
        [
            types.KeyboardButton(text="GO"),
            types.KeyboardButton(text="🔙")
        ],
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    await message.answer('Больше нет событий в этой категории, начинаем смотреть сначала, либо вернемся к категориям!',
                         reply_markup=keyboard)


def get_keyboard_scroll() -> ReplyKeyboardMarkup:
    kb = [
        [
            types.KeyboardButton(text="💚",),
            types.KeyboardButton(text="👎"),
            types.KeyboardButton(text="🔙"),
        ],
    ]
    return types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )


async def replay_message(message: types.Message, category: str, in_keyboard=None):
    """Message response handler."""
    key: str = create_username(message) + category
    index = await redis.get(key)
    if not index:
        index = 0
        await redis.set(key, index)

    index = int(index)

    content = django_object.content.prefetch_related('tags').filter(tags__name=category)

    if index >= content.count():
        await redis.set(key, 0)
        await get_back_or_go_keyboard(message)
        return

    content = content[index]
    index += 1
    await redis.set(key, index)
    data = client.get_object(bucket_name="afisha-files", object_name=str(content.image)).data

    # todo: тут можно формировать более удобное сообщение используя все поля из бд
    try:
        await message.answer_photo(photo=BufferedInputFile(data, filename=f"{str(content.image)}"),
                               caption=content.description, reply_markup=in_keyboard)
    except TelegramBadRequest:
        caption = content.description[:1024]
        await message.answer_photo(photo=BufferedInputFile(data, filename=f"{str(content.image)}"),
                                   caption=caption, reply_markup=in_keyboard)


@dp.message(F.text.regexp('^[А-Яа-я_]{1,20}$'))
async def reply_button_category(message: types.Message):
    await check_user(message)

    category: str = message.text
    key = create_username(message)
    await redis.set(key, category)
    keyboard = get_keyboard_scroll()
    await replay_message(message, category, keyboard)


@dp.message(F.text == "🔙")
async def reply_back(message: types.Message):
    tags = django_object.tags.all()
    builder = ReplyKeyboardBuilder()

    for tag in tags:
        if tag.contents.count() > 0:
            builder.add(types.KeyboardButton(text=tag.name))

    builder.adjust(2)
    await message.answer("Привет! Давай подберем тебе мероприятия",
                         reply_markup=builder.as_markup(resize_keyboard=True))


@dp.message(F.text == "GO")
async def reply_go(message: types.Message):
    keyboard = get_keyboard_scroll()
    key = create_username(message)
    category = await redis.get(key)
    category = category.decode()
    await replay_message(message, category, keyboard)


async def next_reply_message(message: types.Message):
    key = create_username(message)
    category = await redis.get(key)
    category = category.decode()
    await replay_message(message, category)


async def set_like(message: types.Message, value: bool):
    key_username: str = create_username(message)
    category: bytes = await redis.get(key_username)
    category: str = category.decode()
    key: str = key_username + category
    index = await redis.get(key)

    # так как в replay_message мы увеличили счетчик на следующую запись,
    # а тут нам надо работать с текущей, то корректируем index
    correct_index = int(index) - 1

    if correct_index >= 0:
        content = django_object.content.prefetch_related('tags').filter(tags__name=category)[correct_index]
        user_obj = await django_object.user.filter(username=key_username).afirst()
        await django_object.like.aupdate_or_create(user=user_obj, content=content, defaults={"value": value})


@dp.message(F.text == "💚")
async def reply_like(message: types.Message):
    await set_like(message, value=True)
    link = "https://forms.yandex.ru/u/66dc5de42530c2501299acb8/"
    await message.answer(f"Рады что событие тебя заинтересовало! Давай зарегистрируемся на него прямо сейчас! {link}")
    await next_reply_message(message)


@dp.message(F.text == "👎")
async def reply_dislike(message: types.Message):
    await set_like(message, value=False)
    await next_reply_message(message)


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
