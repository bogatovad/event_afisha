import { create } from 'zustand';
import { getContentByTag } from '@/services/eventsService';

interface Event {
  name: string;
  description: string;
  image: string;
  contact: string;
  date: string;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: (tag: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  loading: true,
  error: null,

  fetchEvents: async (tag: string) => {
    set({ loading: true, error: null });

    try {
      // TODO : Uncomment this to connect API
      // const data = await getContentByTag(tag);

      const data: Event[] = [
        {
          name: "Тесла-шоу в музее «Кварки»",
          description:"Великий инженер и учёный-физик Никола Тесла вошёл в историю как «повелитель молний». Именно он сумел обуздать и приручить энергию, которая так пугала наших предков. Чудеса электричества продемонстрируют в музее «Кварки» на Тесла-шоу.",
          image: "https://media.kudago.com/thumbs/xl/images/event/f5/ff/f5ffa00f0d19a1320706a98856989a57.jpg",
          contact:"https://nn.kudago.com/event/entertainment-tesla-shou/",
          date: "Каждый день"
        },
        {
          name: "тринадцать карат",
          description:"Тот самый спектр всех эмоций, уникальный вокал, страсть и мощная энергетика на сцене ожидают нас на незабываемом шоу. На концерте мы услышим все полюбившиеся хиты и новые релизы. Прочувствуй и переживи эту знакомую для каждого слушателя историю вместе с нами.",
          image: "https://sun9-14.userapi.com/impg/sPzc6ZcZcqbf115aVXSdeknQSDUFG7fKU7p4DQ/QBkgUvdxGfI.jpg?size=1280x1280&quality=96&sign=19a094a18c347c6898791fcd3640c5c9&type=album",
          contact:"https://afisha.yandex.ru/nizhny-novgorod/concert/trinadtsat-karat-tour",
          date: "18.10.2024"
        },
        {
          name: "Парк бабочек Paradise",
          description:"Парк бабочек Paradise — живой сад экзотических растений с порхающими тропическими бабочками! Это невероятное приключение позволит вам познакомиться с бабочками разных видов, увидеть их появление на свет, узнать много нового об их образе жизни, особенностях поведения, мифах и легендах, а также насладиться их необычайной красотой.",
          image: "https://optim.tildacdn.com/tild3930-3265-4266-a239-383530366364/-/resize/764x/-/format/webp/noroot.png",
          contact:"https://afisha.yandex.ru/nizhny-novgorod/art/park-babochek-paradise",
          date: "16.10.2024"
        },
        {
          name: "Пари Нижний Новгород — Локомотив-Кубань",
          description: "«Нижний Новгород» — единственный профессиональный баскетбольный клуб на территории Нижегородской области, участник Единой Лиги ВТБ и международных лиг, а также одна из самых интересных команд на карте Европы. За свою короткую историю черно-белые прошли путь от Суперлиги Б до Евролиги, превратившись из никому неизвестных новичков в неуступчивых соперников, способных зацепить любого гранда. ",
          image: "https://nn-basket.ru/wp-content/uploads/2023/01/loko6905.jpg",
          contact:"https://afisha.yandex.ru/nizhny-novgorod/sport/basketball-pari-nizhnii-novgorod-lokomotiv-kuban?city=nizhny-novgorod&source=rubric_main_featured",
          date: "24.10.2024"
        }
      ]

      set({ events: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch events', loading: false });
    }
  }
}));
