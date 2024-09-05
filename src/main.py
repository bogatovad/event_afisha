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


# todo: Задачи
# todo: 2. Наполнить базу из разных источников на >= 8 сентября;
# todo: 3. Сделать фильтрацию событий по дате;
# todo: 5. Сделать красивое оформление в виде карточки;
# todo: 7. Сфурмулировать какие гипотезы мы проверяем через бота, что будет являться проверкой гипотезы, что нет;


class DjangoObject:
    def __init__(self):
        self.user = User.objects
        self.content = Content.objects
        self.tags = Tags.objects
        self.like = Like.objects


django_object = DjangoObject()


async def check_user(message: types.Message):
    exists = await django_object.user.filter(username=message.chat.username).aexists()

    if not exists:
        await django_object.user.acreate(username=message.chat.username)


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await check_user(message)

    tags = django_object.tags.all()
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
            types.KeyboardButton(text="💚",),
            types.KeyboardButton(text="👎"),
            types.KeyboardButton(text="🔙"),
        ],
    ]
    return types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )

# todo: отваливается база
# todo: File "/usr/local/lib/python3.10/site-packages/psycopg2/__init__.py", line 122, in connect
# todo: 2024-09-05 00:43:49     conn = _connect(dsn, connection_factory=connection_factory, **kwasync)
# todo: 2024-09-05 00:43:49 django.db.utils.OperationalError: connection to server at "pgbouncer" (172.19.0.4),
# todo: port 6432 failed: FATAL:  no more connections allowed (max_client_conn)


async def replay_message(message: types.Message, category: str, in_keyboard=None):
    """Message response handler."""
    global client

    key: str = message.chat.username + category
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
    await message.answer_photo(photo=BufferedInputFile(data, filename=f"{str(content.image)}"),
                               caption=content.description, reply_markup=in_keyboard)


@dp.message(F.text.regexp('^[А-Яа-я_]{1,20}$'))
async def reply_button_category(message: types.Message):
    await check_user(message)

    category: str = message.text
    await redis.set(message.chat.username, category)
    keyboard = get_keyboard_scroll()
    await replay_message(message, category, keyboard)


@dp.message(F.text == "🔙")
async def reply_back(message: types.Message):
    tags = django_object.tags.all()
    builder = ReplyKeyboardBuilder()

    for tags in tags:
        builder.add(types.KeyboardButton(text=tags.name))

    builder.adjust(2)
    await message.answer("Привет! Давай подберем тебе мероприятия",
                         reply_markup=builder.as_markup(resize_keyboard=True))


@dp.message(F.text == "GO")
async def reply_go(message: types.Message):
    keyboard = get_keyboard_scroll()
    category = await redis.get(message.chat.username)
    category = category.decode()
    await replay_message(message, category, keyboard)


async def next_reply_message(message: types.Message):
    category = await redis.get(message.chat.username)
    category = category.decode()
    await replay_message(message, category)


async def set_like(message: types.Message, value: bool):
    category = await redis.get(message.chat.username)
    category = category.decode()
    key = message.chat.username + category
    index = await redis.get(key)

    # так как в replay_message мы увеличили счетчик на следующую запись,
    # а тут нам надо работать с текущей, то корректируем index
    correct_index = int(index) - 1

    if correct_index >= 0:
        content = django_object.content.prefetch_related('tags').filter(tags__name=category)[correct_index]
        user_obj = await django_object.user.filter(username=message.chat.username).afirst()
        like = await django_object.like.select_related('user', 'content').filter(user=user_obj, content=content, value=value).afirst()

        if not like:
            await django_object.like.acreate(user=user_obj, content=content, value=value)


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
