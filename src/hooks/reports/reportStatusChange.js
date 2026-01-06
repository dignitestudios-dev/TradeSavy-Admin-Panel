import { useState } from "react";
import { reportStatusChange } from "../../lib/services";
import { handleError } from "../../utils/helpers";

export const useReportStatus = () => {
  const [loading, setLoading] = useState(false);

  const reportStatus = async ({ reportId, status }) => {
    setLoading(true);
    try {
      const response = await reportStatusChange({ reportId, status });
      setLoading(false);
      return response.success;
    } catch (error) {
      handleError(error);
      setLoading(false);
      return false;
    }
  };

  return { loading, reportStatus };
};
