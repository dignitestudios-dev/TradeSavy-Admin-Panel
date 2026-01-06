import { useEffect, useState } from "react";
import { handleError } from "../../utils/helpers";
import { api } from "../../lib/services";

const useGetFeaturedProduct = ({
  filters = {},
  search = "",
  page = 1,
  limit = 20,
}) => {
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const getFeaturedProduct = async (params = {}) => {
    setLoading(true);
    try {
      const {
        search: s = search,
        page: p = page,
        limit: l = limit,
        ...extraFilters
      } = params;

      // Merge filters with extra filters if provided
      const combinedFilters = { ...filters, ...extraFilters };

      // Construct query params
      let query = `?page=${p}&limit=${l}`;
      if (s) query += `&search=${s}`;
      Object.keys(combinedFilters).forEach((key) => {
        if (combinedFilters[key]) query += `&${key}=${combinedFilters[key]}`;
      });

      const response = await api.FeaturedProduct(query);

      if (response?.success) {
        setFeaturedProduct(response?.data?.purchases || []);
        setPagination(
          response?.data?.pagination || { total: 0, totalPages: 0 }
        );
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeaturedProduct();
  }, [filters, search, status, page, limit]);

  return {
    totalData: pagination.total,
    totalPages: pagination.totalPages,
    featuredProduct,
    loading,
    getFeaturedProduct,
  };
};

export default useGetFeaturedProduct;
