import { useState } from "react";
import { handleError } from "../../utils/helpers";
import { api } from "../../lib/services";

export const usebadgeStatusChange = () => {
  const [loading, setLoading] = useState(false);

  const badgeStatus = async ({ reportId, status, rejectionReason }) => {
    setLoading(true);
    try {
      const response = await api.badgeStatusChange({
        reportId,
        status,
        rejectionReason, // key matches backend
      });
      setLoading(false);
      return response.success;
    } catch (error) {
      handleError(error);
      setLoading(false);
      return false;
    }
  };

  return { loading, badgeStatus };
};
