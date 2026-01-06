import { useEffect, useState } from "react";
import { handleError } from "../../utils/helpers";
import { api } from "../../lib/services";

const useGetVerifiedDetail = (id) => {
  const [verifiedBadge, setverifiedBadge] = useState(null);
  const [loading, setLoading] = useState(false);

  const getVerifiedBacthDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await api.verifiedGetDetail(id);

      if (response?.success) {
        setverifiedBadge(response.data?.user);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVerifiedBacthDetail();
  }, [id]);

  return {
    verifiedBadge,
    loading,
    refetch: getVerifiedBacthDetail,
  };
};

export default useGetVerifiedDetail;
