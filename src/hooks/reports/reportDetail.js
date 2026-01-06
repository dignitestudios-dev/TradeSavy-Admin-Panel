import { useEffect, useState } from "react";
import { handleError } from "../../utils/helpers";
import { api } from "../../lib/services";

const useReportDetail = (id) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const getReportDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await api.reportDetail(id);

      if (response?.success) {
        setReport(response.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportDetail();
  }, [id]);

  return {
    report,
    loading,
    refetch: getReportDetail,
  };
};

export default useReportDetail;
