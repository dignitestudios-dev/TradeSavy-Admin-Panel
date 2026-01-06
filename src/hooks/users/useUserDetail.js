import { useEffect, useState } from "react";
import { handleError } from "../../utils/helpers";
import { api } from "../../lib/services";

const useUserDetail = (id) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await api.userDetailGet(id);

      if (response?.success) {
        setUser(response.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, [id]);

  return {
    user,
    loading,
    refetch: getUserDetail,
  };
};

export default useUserDetail;
