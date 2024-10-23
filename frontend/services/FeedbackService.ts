import axiosInstance from "@/services/AxiosConfig";

export const sendFeedback = async (
  username: string,
  message: string,
) => {
  try {
    console.log(username, message);

    return await axiosInstance.post('/feedback', {
      username: username,
      message: message
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
