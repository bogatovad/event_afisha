import spacy

# Загрузка модели для русского языка
nlp = spacy.load("ru_core_news_lg")

# Пример неструктурированного текста
text = """
На встрече с 20 декабря будут обсуждаться важные вопросы о стоимости услуг и времени, которые лучше всего провести в кафе на ул. Ленина, 45.
Акция пройдет с 15 по 17 января в Москве.
Стоимость: 1000 рублей. 
Мероприятие пройдет в 18:00.
"""

# Применение spaCy для анализа текста
doc = nlp(text)

# Извлечение сущностей
dates = [ent.text for ent in doc.ents if ent.label_ == "DATE"]
times = [ent.text for ent in doc.ents if ent.label_ == "TIME"]
addresses = [ent.text for ent in doc.ents if ent.label_ == "GPE" or 'ул.' in ent.text]
costs = [ent.text for ent in doc.ents if "руб" in ent.text]
categories = [sent.text for sent in doc.sents if "акция" in sent.text.lower()]

print(f"Даты: {dates}")
print(f"Время: {times}")
print(f"Адреса: {addresses}")
print(f"Стоимость: {costs}")
print(f"Категория: {categories}")
