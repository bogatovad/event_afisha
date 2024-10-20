import { create } from 'zustand';
import {getTags} from '@/services/TagsService';

type Tag = {
  name: string;
  description: string;
  image: string | null;
}

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  hasError: boolean;
  fetchTags: () => Promise<void>;
}

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  isLoading: true,
  hasError: false,

  fetchTags: async () => {
    set({ isLoading: true, hasError: false });

    // TODO: uncomment this when CORS will be setup
    // getTags()
    //   .then(({response, status}) => {
    //     if (status == 200) {
    //       set({ tags: response.data, isLoading: false });
    //     } else {
    //       set({ hasError: true, isLoading: false });
    //     }
    //   })
    //   .catch(() => {
    //     set({ hasError: true, isLoading: false });
    //   });

    const data: Tag[] = [
      {
        "name": "Лекция",
        "description": "Лекция",
        "image": null
      },
      {
        "name": "Искусство",
        "description": "Искусство",
        "image": null
      },
      {
        "name": "Кино",
        "description": "Кино",
        "image": null
      },
      {
        "name": "Дети",
        "description": "Дети",
        "image": null
      },
      {
        "name": "Семья",
        "description": "Семья",
        "image": null
      },
      {
        "name": "Посиделки",
        "description": "Посиделки",
        "image": null
      },
      {
        "name": "Театр",
        "description": "Театр",
        "image": null
      },
      {
        "name": "Спорт",
        "description": "Спорт",
        "image": null
      },
      {
        "name": "Фотография",
        "description": "Фотография",
        "image": null
      },
      {
        "name": "Музыка",
        "description": "Музыка",
        "image": null
      },
      {
        "name": "Разное",
        "description": "Разное",
        "image": null
      },
      {
        "name": "АктивныйОтдых",
        "description": "Активный отдых",
        "image": null
      },
      {
        "name": "Образование",
        "description": "Образование",
        "image": "http://minio:9000/afisha-files/images_tag/education.jpg?AWSAccessKeyId=minioadmin&Signature=OGXvWOK4Qdv3xPoE7R4PjQ60ot0%3D&Expires=1729421421"
      },
      {
        "name": "Еда",
        "description": "Еда",
        "image": "http://minio:9000/afisha-files/images_tag/photo_2024-10-19_11-46-55.jpg?AWSAccessKeyId=minioadmin&Signature=XdF4pvAofJhpSpMBs4lwT6ohocs%3D&Expires=1729421421"
      },
      {
        "name": "Standup",
        "description": "Standup",
        "image": "http://minio:9000/afisha-files/images_tag/photo_2024-10-19_13-25-42.jpg?AWSAccessKeyId=minioadmin&Signature=HsmoMoW8qt7dkUVv1mXsacODtlk%3D&Expires=1729421421"
      }
    ]

    set({ tags: data, isLoading: false });
  }
}));
