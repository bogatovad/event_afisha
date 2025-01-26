from typing import List, Dict

from interface_adapters.gateways.parsing_base_gateway.base_gateway import BaseGateway
from datetime import datetime
import request, json

class KudaGoGateway(BaseGateway):
    def __init__(self, client=None) -> None:
        """
        Инициализирует объект KudaGoGateway с клиентом.

        :param client: Клиент, используемый для выполнения запросов (например, bot или API клиент).
        """
        self.client = client
        
    def addKudaGoEvents(self, currentJSON : list[Dict]):
        """
        Функция (метод) описывает добавление одно страницы результатов (максимум 100 событий) во временный df, где max(len(df))=100
        """
        
        eventsList = []
        for event in currentJSON:
            currentEvent = {}
            print(event['id'])
            for param in ['id', 'title', 'description', 'tags']:
                try:
                    currentEvent[param] = event[param]
                except:
                    currentEvent[param] = "-"
   
            try:
                currentEvent['address'] = f"{event['place']['title']}\n{event['place']['address']}"
            except:
                currentEvent['address'] = ""

            try:
                currentEvent['contact'] = event['place']['phone']
            except:
                currentEvent['contact'] = "-"

            try:
                currentEvent['datestart'] = datetime.today().strftime('%Y-%m-%d') \
                                        if (dt - 86400)>int(event['dates'][0]['start']) \
                                        else event['dates'][0]['start_date']
            except Exception as e:
                raise e


            currentEvent['dateend'] = event['dates'][0]['end_date']
            currentEvent['tags'] = event['tags']
            currentEvent['cost'] = event['price']

            try:
                currentEvent['cost']  = event['price']
            except:
                currentEvent['cost'] = ""

            ###получить данные сайта
            eventURL = rf'https://kudago.com/public-api/v1.4/events/{event["id"]}?expand=place,location,dates&text_format=text'
            print(eventURL)
            eventDetail = requests.get(eventURL).json()
            if not eventDetail['dates'][-1]['is_startless'] == True:
                currentEvent['datestart'] = datetime.fromtimestamp(eventDetail['dates'][-1]['start']).strftime('%d.%m.%Y %H:%M')
            else:
                #нужна детализация, если событие имеет расписание
                currentEvent['datestart'] = "В рабочие часы"
                
            #input(eventDetail)
            imageLink = eventDetail['images'][0]['image']
            url = eventDetail['site_url']

            currentEvent['url'] = url
            """картинка"""
            imageLink = currentEvent['image']
            imageResponse = requests.get(imageLink)
            currentEvent['image'] = imageResponse.content if imageResponse.status_code == 200 else ""
            
            currentEvent['dateend'] = eventDetail['dates'][-1]['end_date']

            #доп обработка
            if currentEvent['address'] == "":
                currentEvent['address'] = eventDetail['body_text'].split('\n')[-1].replace('KudaGo:', '')\
                         .replace('.Фото: предоставлено организатором', '')

            #скидки и акции не добавляем, лишнее..
            include = False if 'акции и скидки' in event['tags'] else True

            if include:
                eventsList.append(currentEvent)
        return eventsList

    def fetch_content(self) -> List[Dict]:
        """
        Метод для получения событий с KudaGo. Должен быть реализован в соответствии с API.

        :return: Список событий в виде словарей.
        """
        # Здесь может быть запрос к API KudaGo, например:
        # response = self.client.get_updates() или другая логика взаимодействия с API
        # тут приведет пример данных.

        dt =  int(str(datetime.now().timestamp()).split('.')[0])
        #- 2 дня
        dt_start = dt - 86400*2
        # + 3 месяца от текущей даты
        dt_end =  dt + 86400*90
        passed=True
        page=0
        events=[]
        try:
            while passed:
                #прогоняем по страницам, пока не упремся, что найденных страниц больше нет, тогда passed=False
                page +=1
                for free in [0,1]:
                    link2=rf'https://kudago.com/public-api/v1.4/events/?lang=ru&' + \
                    rf'page={page}&page_size=100&fields=id,title,dates,tags,price,place,description,price&expand=images,place,location,dates&order_by=' + \
                    rf'&text_format=text&ids=&location=nnv&actual_since={dt_start}&actual_until={dt_end}&is_free={free}&categories=&lon=&lat=&radius='
                    s = requests.get(link2)
                    resultJSON = s.json()['results']
                    
                    added = self.addKudaGoEvents(resultJSON)
                    #добавляем каждое событие из максимум 100 в общую базу
                    for event in added:
                        events.append(event)
        except:
            passed = False
        
        return events
