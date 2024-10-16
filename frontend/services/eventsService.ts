import axios from 'axios';

export const getContentByTag = async (tag: string) => {
  try {
    const response = await axios.get('/api/v1/contents', {
      params: { tag }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};
