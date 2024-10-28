from yandexgptlite import YandexGPTLite
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()

from event.models import Tags


class LLMTextAnalysis:
    def __init__(self) -> None:
        self.account = YandexGPTLite("b1gas0roisoqujc22qnc", "y0_AgAAAAA85yPjAATuwQAAAAEU6JN6AACgNyQ_6wtCa7zQ-JXuXG27vZvncQ")

    def extract_date(self, text: str) -> str:
        extract_datetime_query = "Выдели одну дату в формате YYYY-MM.DD учти что сейчас 2024 год в ответе дай только дату, если дат несколько выбери самую позднюю. Ответ дать в виде одного слова без пояснений и без обрамлений."
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, '0.6', system_prompt='Отвечай на русском')

    def extract_category(self, text: str) -> str:
        tags = [tag.name for tag in list(Tags.objects.only('name'))]
        categories = ",".join(tags)
        extract_datetime_query = f"К какой категории больше всего относится это мероприятие {categories}. Ответ дать в виде одного слова без пояснений."
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, '0.6', system_prompt='Отвечай на русском')

    def shorten_text(self, text: str) -> str:
        extract_datetime_query = "Выдели из текста главную информацию и сократи его до 5 предложений. Ответ дать без пояснений и без обрамлений"
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, "0.6", system_prompt='Отвечай на русском')

    def extract_name_event(self, text: str) -> str:
        extract_datetime_query = "Составь название мероприятия, в ответе дать только название без пояснений в формате 'Название'. Ответ дать без пояснений и без обрамлений"
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, "0.6", system_prompt='Отвечай на русском')