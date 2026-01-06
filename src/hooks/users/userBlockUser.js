import { useState } from "react";
import { handleError } from "../../utils/helpers";
import { api } from "../../lib/services";

export const useBlockUser = () => {
  const [loading, setLoading] = useState(false);

  const blockUser = async (blockData) => {
    setLoading(true);
    try {
      const response = await api.blockUser(blockData);
      setLoading(false);
      return response.success;
    } catch (error) {
      handleError(error);
      setLoading(false);
      return false;
    }
  };

  return { loading, blockUser };
};

export const useUnBlockUser = () => {
  const [loading, setLoading] = useState(false);

  const unBlockUser = async (unBlockData) => {
    setLoading(true);
    try {
      const response = await api.unBlockUser(unBlockData);
      setLoading(false);
      return response.success;
    } catch (error) {
      handleError(error);
      setLoading(false);
      return false;
    }
  };

  return { loading, unBlockUser };
};
