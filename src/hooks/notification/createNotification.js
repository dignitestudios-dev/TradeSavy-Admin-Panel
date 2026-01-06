import { useState } from "react";
import { handleError } from "../../utils/helpers";
import { api } from "../../lib/services";

const useCreateNotification = () => {
  const [loading, setLoading] = useState(false);

  const createNotification = async (notiData) => {
    setLoading(true);
    try {
      const response = await api.createNoti(notiData);
      setLoading(false);
      return response.success;
    } catch (error) {
      handleError(error);
      setLoading(false);
      return false;
    }
  };

  return { loading, createNotification };
};

export default useCreateNotification;
