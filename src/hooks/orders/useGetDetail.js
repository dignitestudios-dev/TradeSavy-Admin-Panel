import { useEffect, useState } from "react";
import { handleError } from "../../utils/helpers";
import { api } from "../../lib/services";

const useOrderDetail = (id) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const getOrderDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await api.orderDetailGet(id);

      if (response?.success) {
        setOrderDetail(response.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, [id]);

  return {
    orderDetail,
    loading,
    refetch: getOrderDetail,
  };
};

export default useOrderDetail;
