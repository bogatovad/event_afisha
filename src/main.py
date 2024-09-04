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

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()


from event.models import Content, Tags, Like, User


bot = Bot("5245004618:AAGBgb3tY32qzzBwdT4ltyEc6IDjn6Azj3A")
dp = Dispatcher()
global_counter: dict[tuple[str, str]] = {}
history_user_button = {}

client: Minio = Minio(
        os.getenv("MINIO_URL", "minio:9000"),
        access_key=os.getenv("ACCESS_KEY"),
        secret_key=os.getenv("SECRET_KEY"),
        secure=False,
    )


# todo: Задачи
# todo: 2. Наполнить базу из разных источников на >= 8 сентября;
# todo: 3. Сделать фильтрацию событий по дате;
# todo: 5. Сделать красивое оформление в виде карточки;
# todo: 7. Сфурмулировать какие гипотезы мы проверяем через бота, что будет являться проверкой гипотезы, что нет;


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    exists = await User.objects.filter(username=message.chat.username).aexists()

    if not exists:
        await User.objects.acreate(username=message.chat.username)

    tags = Tags.objects.all()
    builder = ReplyKeyboardBuilder()

    for tags in tags:
        builder.add(types.KeyboardButton(text=tags.name))

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
            types.KeyboardButton(text="💚"),
            types.KeyboardButton(text="👎"),
            types.KeyboardButton(text="🔙")
        ],
    ]
    return types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )


async def replay_message(message: types.Message, category: str, in_keyboard=None):
    """Message response handler."""
    global global_counter
    global client

    key: tuple[str, str] = (message.chat.username, category)

    if key not in global_counter:
        global_counter[key] = 1
    else:
        global_counter[key] += 1

    if global_counter[key] > Content.objects.all().filter(tags__name=category).count():
        del global_counter[key]
        await get_back_or_go_keyboard(message)
        return

    content = Content.objects.all().filter(tags__name=category)[global_counter[key] - 1]

    if content is None:
        return

    data = client.get_object(bucket_name="afisha-files", object_name=str(content.image)).data

    await message.answer_photo(photo=BufferedInputFile(data, filename=f"{str(content.image)}"),
                               caption=content.description, reply_markup=in_keyboard)


@dp.message(F.text.regexp('^[А-Яа-я_]{1,20}$'))
async def reply_button_category(message: types.Message):
    global history_user_button

    category: str = message.text
    history_user_button[message.chat.username] = category
    keyboard = get_keyboard_scroll()
    await replay_message(message, category, keyboard)


@dp.message(F.text == "🔙")
async def reply_back(message: types.Message):
    global history_user_button

    if message.chat.username in history_user_button:
        del history_user_button[message.chat.username]

    tags = Tags.objects.all()
    builder = ReplyKeyboardBuilder()

    for tags in tags:
        builder.add(types.KeyboardButton(text=tags.name))

    builder.adjust(2)
    await message.answer("Привет! Давай подберем тебе мероприятия",
                         reply_markup=builder.as_markup(resize_keyboard=True))


@dp.message(F.text == "GO")
async def reply_go(message: types.Message):
    global history_user_button

    keyboard = get_keyboard_scroll()
    category = history_user_button[message.chat.username]
    await replay_message(message, category, keyboard)


async def next_reply_message(message: types.Message):
    global history_user_button

    category = history_user_button[message.chat.username]
    await replay_message(message, category)


async def set_like(message: types.Message, value: bool):
    category = history_user_button[message.chat.username]
    key: tuple[str, str] = (message.chat.username, category)
    content = Content.objects.filter(tags__name=category)[global_counter[key] - 1]
    user = User.objects.filter(username=message.chat.username)

    if not user.exists():
        await User.objects.acreate(username=message.chat.username)

    user_obj = await user.afirst()
    like = await Like.objects.filter(user=user_obj, content=content, value=value).afirst()

    if not like:
        await Like.objects.acreate(user=user_obj, content=content, value=value)


@dp.message(F.text == "💚")
async def reply_like(message: types.Message):
    await set_like(message, value=True)
    await next_reply_message(message)


@dp.message(F.text == "👎")
async def reply_dislike(message: types.Message):
    await set_like(message, value=False)
    await next_reply_message(message)


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
