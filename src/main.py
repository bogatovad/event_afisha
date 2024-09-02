from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
import asyncio
from minio import Minio
import django
import os
from aiogram import F
from aiogram.types.input_file import InputFile, BufferedInputFile
from enum import Enum
from aiogram.utils.keyboard import ReplyKeyboardBuilder


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()


from event.models import Content, Tags


bot = Bot("7517129777:AAFyHsU_fM15AqXQHdBt-e9ytG3JQJXOIqg")
dp = Dispatcher()
global_counter: dict[tuple[str, str]] = {}


# todo: 1. Cделать роутинг запросов;
# todo: 2. Наполнить базу из разных источников на >= 8 сентября;
# todo: 3. Сделать фильтрацию событий по дате;
# todo: 4. Сделать более детальные категории;
# todo: 5. Сделать красивое оформление в виде карточки;
# todo: 6. Обернуть бота в докер;
# todo: 7. Сфурмулировать какие гипотезы мы проверяем через бота, что будет являться проверкой гипотезы, что нет.


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
    tags = Tags.objects.all()
    builder = ReplyKeyboardBuilder()
    for tags in tags:
        builder.add(types.KeyboardButton(text=tags.name))
    builder.adjust(2)
    await message.answer("Привет! Давай подберем тебе мероприятия",
                         reply_markup=builder.as_markup(resize_keyboard=True))


async def replay_message(message: types.Message, category: str):
    """Message response handler."""
    key: tuple[str, str] = (message.chat.username, category)

    if key not in global_counter:
        global_counter[key] = 1
    else:
        global_counter[key] += 1
    if global_counter[key] > Content.objects.all().filter(tags__name=category).count():
        del global_counter[key]
        await message.reply(f"Больше нет событий в этой категории, начинаем смотреть сначала")
        return None, None

    content = Content.objects.all().filter(tags__name=category)[global_counter[key] - 1]

    if content is None:
        return

    client = Minio(
        os.getenv("MINIO_URL", "minio:9000"),
        access_key="jcp0Kvr0YyRBK59rbT1W",
        secret_key="kxBDArGlM0kI1mUXwSIdbEjh5a1H5bLkrsFjhPuY",
        secure=False,
    )
    data = client.get_object(bucket_name="afisha-files", object_name=str(content.image)).data
    await message.reply_photo(photo=BufferedInputFile(data, filename=f"{str(content.image)}"),
                              caption=content.description, title=content.name, quote=False)


@dp.message(F.text == Category.education)
async def reply_education(message: types.Message):
    # print(message)
    await replay_message(message, Category.education)


@dp.message(F.text == Category.art)
async def reply_art(message: types.Message):
    await replay_message(message, Category.art)


@dp.message(F.text == Category.lecture)
async def reply_lecture(message: types.Message):
    await replay_message(message, Category.lecture)


@dp.message(F.text == Category.music)
async def reply_music(message: types.Message):
    await replay_message(message, Category.music)


@dp.message(F.text == Category.photo)
async def reply_photo(message: types.Message):
    await replay_message(message, Category.photo)


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
