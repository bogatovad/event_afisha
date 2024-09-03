from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
import asyncio
from minio import Minio
import django
import os
from aiogram import F
from aiogram.types.input_file import BufferedInputFile
from enum import Enum
from aiogram.utils.keyboard import ReplyKeyboardBuilder

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()


from event.models import Content, Tags, Like, User


bot = Bot("7517129777:AAFyHsU_fM15AqXQHdBt-e9ytG3JQJXOIqg")
dp = Dispatcher()
global_counter: dict[tuple[str, str]] = {}
history_user_button = {}

# todo: Задачи
# todo: 1. Cделать роутинг запросов;
# todo: 2. Наполнить базу из разных источников на >= 8 сентября;
# todo: 3. Сделать фильтрацию событий по дате;
# todo: 4. Сделать более детальные категории;
# todo: 5. Сделать красивое оформление в виде карточки;
# todo: 6. Обернуть бота в докер;
# todo: 7. Сфурмулировать какие гипотезы мы проверяем через бота, что будет являться проверкой гипотезы, что нет;
# todo: 8. Переехать на postgres.


class Category(str, Enum):
    education = 'Образование'
    art = 'Искусство'
    lecture = 'Лекция'
    music = 'Музыка'
    photo = 'Фотография'
    ha = 'История искусств'


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    print('starting bot ...')

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


async def replay_message(message: types.Message, category: str, in_keyboard = None):
    """Message response handler."""
    key: tuple[str, str] = (message.chat.username, category)

    if key not in global_counter:
        global_counter[key] = 1
    else:
        global_counter[key] += 1
    if global_counter[key] > Content.objects.all().filter(tags__name=category).count():
        del global_counter[key]

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
        await message.answer('Больше нет событий в этой категории, начинаем смотреть сначала, либо вернемся к категориям!', reply_markup=keyboard)
        return None, None

    content = Content.objects.all().filter(tags__name=category)[global_counter[key] - 1]
    if content is None:
        return

    client = Minio(
        os.getenv("MINIO_URL", "minio:9000"),
        access_key=os.getenv("ACCESS_KEY"),
        secret_key=os.getenv("SECRET_KEY"),
        secure=False,
    )
    data = client.get_object(bucket_name="afisha-files", object_name=str(content.image)).data
    await message.answer_photo(photo=BufferedInputFile(data, filename=f"{str(content.image)}"), caption=content.description, reply_markup=in_keyboard)


@dp.message(F.text == Category.education)
async def reply_education(message: types.Message):
    history_user_button[message.chat.username] = Category.education
    kb = [
        [
            types.KeyboardButton(text="💚", category=Category.education),
            types.KeyboardButton(text="👎", category=Category.education),
            types.KeyboardButton(text="🔙", category=Category.education)
        ],
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    await replay_message(message, Category.education, keyboard)


@dp.message(F.text == "🔙")
async def reply_education(message: types.Message):
    if message.chat.username in history_user_button:
        del history_user_button[message.chat.username]

    tags = Tags.objects.all()
    builder = ReplyKeyboardBuilder()

    for tags in tags:
        builder.add(types.KeyboardButton(text=tags.name))

    builder.adjust(2)
    await message.answer("Привет! Давай подберем тебе мероприятия",
                         reply_markup=builder.as_markup(resize_keyboard=True))


@dp.message(F.text == "👎")
async def reply_education(message: types.Message):
    category = history_user_button[message.chat.username]

    user = await User.objects.filter(username=message.chat.username).afirst()
    key: tuple[str, str] = (message.chat.username, category)
    content = Content.objects.filter(tags__name=category)[global_counter[key] - 1]

    dislike = await Like.objects.filter(user=user, content=content, value=False).afirst()

    if not dislike:
        await Like.objects.acreate(user=user, content=content, value=False)

    if category == Category.education:
        await replay_message(message, Category.education)
    if category == Category.art:
        await replay_message(message, Category.art)
    if category == Category.music:
        await replay_message(message, Category.music)
    if category == Category.lecture:
        await replay_message(message, Category.lecture)
    if category == Category.photo:
        await replay_message(message, Category.photo)


@dp.message(F.text == "GO")
async def reply_education(message: types.Message):
    kb = [
        [
            types.KeyboardButton(text="💚"),
            types.KeyboardButton(text="👎"),
            types.KeyboardButton(text="🔙")
        ],
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    category = history_user_button[message.chat.username]
    if category == Category.education:
        await replay_message(message, Category.education, keyboard)
    if category == Category.art:
        await replay_message(message, Category.art, keyboard)
    if category == Category.music:
        await replay_message(message, Category.music, keyboard)
    if category == Category.lecture:
        await replay_message(message, Category.lecture, keyboard)
    if category == Category.photo:
        await replay_message(message, Category.photo, keyboard)


@dp.message(F.text == "💚")
async def reply_education(message: types.Message):
    category = history_user_button[message.chat.username]
    user = await User.objects.filter(username=message.chat.username).afirst()
    key: tuple[str, str] = (message.chat.username, category)
    content = Content.objects.filter(tags__name=category)[global_counter[key] - 1]

    like = await Like.objects.filter(user=user, content=content, value=True).afirst()

    if not like:
        await Like.objects.acreate(user=user, content=content, value=True)

    if category == Category.education:
        await replay_message(message, Category.education)
    if category == Category.art:
        await replay_message(message, Category.art)
    if category == Category.music:
        await replay_message(message, Category.music)
    if category == Category.lecture:
        await replay_message(message, Category.lecture)
    if category == Category.photo:
        await replay_message(message, Category.photo)


@dp.message(F.text == Category.art)
async def reply_art(message: types.Message):
    history_user_button[message.chat.username] = Category.art
    kb = [
        [
            types.KeyboardButton(text="💚"),
            types.KeyboardButton(text="👎"),
            types.KeyboardButton(text="🔙")
        ],
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    await replay_message(message, Category.art, keyboard)


@dp.message(F.text == Category.lecture)
async def reply_lecture(message: types.Message):
    history_user_button[message.chat.username] = Category.lecture
    kb = [
        [
            types.KeyboardButton(text="💚"),
            types.KeyboardButton(text="👎"),
            types.KeyboardButton(text="🔙")
        ],
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    await replay_message(message, Category.lecture, keyboard)


@dp.message(F.text == Category.music)
async def reply_music(message: types.Message):
    history_user_button[message.chat.username] = Category.music
    kb = [
        [
            types.KeyboardButton(text="💚"),
            types.KeyboardButton(text="🔙"),
            types.KeyboardButton(text="👎"),
        ],
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    await replay_message(message, Category.music, keyboard)


@dp.message(F.text == Category.photo)
async def reply_photo(message: types.Message):
    history_user_button[message.chat.username] = Category.photo
    kb = [
        [
            types.KeyboardButton(text="💚"),
            types.KeyboardButton(text="👎"),
            types.KeyboardButton(text="🔙")
        ],
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    await replay_message(message, Category.photo, keyboard)


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
