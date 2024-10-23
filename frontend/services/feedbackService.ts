import axios from 'axios';

export const sendFeedback = async (
  username: string,
  message: string,
) => {
  try {
    return await axios.post('http://130.193.41.98:8000/api/v1/feedback', {
      username: username,
      message: message
    });
  } catch (error) {
    throw error;
  }
};
