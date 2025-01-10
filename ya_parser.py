import requests

#это чтобы автоматизацию не спалили
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.8",
    "Referer": "https://afisha.yandex.ru/",
    "Connection": "keep-alive"
}

#функция, определяющая парную скобку
def find_closing_bracket(text, start_pos, open_bracket='{', close_bracket='}'):
    # Баланс скобок
    balance = 0
    for i in range(start_pos, len(text)):
        if text[i] == open_bracket:
            balance += 1
        elif text[i] == close_bracket:
            balance -= 1
            if balance == 0:  # Если баланс стал нулевым, нашли закрывающую скобку
                return i
    return -1  # Если парная скобка не найдена

def ya_parser(thisCity = 'nizhny-novgorod'):
    #Город можно менять в зависимости от местоположения

    link = f"https://afisha.yandex.ru/{thisCity}"
    print(f'Отправка запроса на {link}')
    thisRequest =  requests.get(link, headers=headers)
    currentRequest = thisRequest.text
    print('Ответ получен')
    if thisRequest.status_code != 200:
        raise "Некорректный ответ сервера"

    #mainPageFeatured встречается один раз на странице    
    initPos = currentRequest.find("mainPageFeatured")
    #выцепить информацию в коде с помощью парных скобок
    curText = currentRequest[initPos:]
    curText = '{"' + curText
    clsppd = find_closing_bracket(curText, 0)
    curText = curText[:clsppd] + '}'

    #дополнительная обработка
    currentEventsR = curText.replace('null', '"null"').replace('false', 'False').replace('true', 'True')
    #текст в словарь
    currentEventsALL = eval(currentEventsR)
    # есть топ события, ключ topEvents, есть просто текущие, возьмем текущие
    currentEvents = currentEventsALL['mainPageFeatured']
    topEvents = currentEventsALL['topEvents']
    #####добавление в словарик currentEventElements#####
    ###FeaturedCustom имеет другую структуру, здесь не очень подходит###
    currentEvents = [element for element in currentEvents if element['type'] !='FeaturedCustom']
    currentEventElements = []

    ###каждое событие - это элемент списка currentEvents###
    for currentEvent in currentEvents:
        #название события
        currentName = currentEvent['event']['event']['title']
        #категории яндекса
        currentCategories = ', '.join(element['name'] for element in currentEvent['event']['event']['tags'])
        currentURL = currentEvent['event']['event']['url']
        #Дата мероприятия
        currentDates = currentEvent['event']['scheduleInfo']['dates']
        #описание, если непустое
        currentDescription = currentEvent['event']['event']['argument'] if currentEvent['event']['event']['argument'] != "null" else "-"
        if len(currentDates) == 1:
            #для простоты ограничимся пока нерегулярными событиями (есть где несколько дат события, там отдельная обработка нужна)
            currentPlace = currentEvent['event']['scheduleInfo']['onlyPlace']['title']
            currentAddress = currentEvent['event']['scheduleInfo']['onlyPlace']['address']
            coordinates = currentEvent['event']['scheduleInfo']['onlyPlace']['coordinates']
            russianDate = currentEvent['event']['scheduleInfo']['preview']['text'] if currentEvent['event']['scheduleInfo']['preview']['type'] == 'date' else ''
            #цены
            currentPrices = [int(element['value']/100) for element in currentEvent['event']['scheduleInfo']['prices']]
            try:
                minPrice = min(currentPrices)
                maxPrice = max(currentPrices)
            except ValueError as ve:
                # если у нас длина списка 0 то события еще нет, я проверял вручную (оно может появиться, но де-факто оно отсутствует)
                continue

            #работа с картинкой. картинка сохраняется в webp, это формат яндекса
            imageLink = currentEvent['event']['event']['image']['eventCover']['url']
            imageResponse = requests.get(imageLink, headers=headers)
            image = imageResponse.content if imageResponse.status_code == 200 else ""

            #запись в финальный словарь
            currentEventElement = {
                "Categories" : [element['name'] for element in currentEvent['event']['event']['tags']],
                "Address": currentAddress,
                "Name" : currentName,
                "Description" : currentDescription,
                "Link" : f'https://afisha.yandex.ru{currentURL}',
                "Prices" : f'от {minPrice} до {maxPrice} руб.',
                "Image" : image
            }

        currentEventElements.append(currentEventElement)
        print(f'Элемент {currentName} добавлен')
    return currentEventElements