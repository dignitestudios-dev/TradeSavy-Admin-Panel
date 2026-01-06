import axios from "axios";
import { API_CONFIG, PAGINATION_CONFIG } from "../config/constants";

// Create an Axios instance
const API = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout, // Set a timeout (optional)
  headers: API_CONFIG.headers,
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Retrieve token from storage
    console.log("req token: ", token);
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("authToken"); // Remove token if unauthorized
      window.location.href = "/auth/login"; // Redirect to login page
    }
    console.log(error);
    console.log("API Error:", error.response?.data || error);
    return Promise.reject(error);
  }
);

// Centralized API Handling functions start
const handleApiError = (error) => {
  if (axios.isAxiosError(error)) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    throw new Error(errorMessage);
  }
  throw new Error(error?.message || error || "An Unexpected error occurred");
};

const handleApiResponse = (response) => {
  const responseData = response.data;
  console.log("API response run");

  // Check if success is false and throw an error
  if (!responseData.success) {
    throw new Error(
      responseData.message || "Something went wrong, Please try again!"
    );
  }

  return responseData; // Only return the response data {status, message, data}
};

const apiHandler = async (apiCall) => {
  try {
    const response = await apiCall();
    return handleApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Centralized API Handling functions end

// Auth APIs

const login = (credentials) =>
  apiHandler(() =>
    API.post("/auth/login", credentials, {
      headers: {
        deviceuniqueid: credentials.deviceuniqueid,
        devicemodel: credentials.devicemodel,
      },
    })
  );

const forgotPassword = (payload) =>
  apiHandler(() => API.post("/auth/forgot-password", payload));

const verifyOTP = (payload) =>
  apiHandler(() =>
    API.post("/auth/verify-forgot-password", payload, {
      headers: {
        deviceuniqueid: payload.deviceuniqueid,
        devicemodel: payload.devicemodel,
      },
    })
  );

const updatePassword = (payload) =>
  apiHandler(() => API.post("/auth/update-password", payload));

const updatePasswordAuth = (payload) =>
  apiHandler(() => API.post("/auth/reset-password", payload));

const logout = () => apiHandler(() => API.post("/auth/logout"));

// App Configs API
const getAppConfigs = () => apiHandler(() => API.get("/global/config"));

const updateAppConfigs = (payload) =>
  apiHandler(() => API.put("/global/config", payload));

// Dashboard Analytics API
const getDashboardAnalytics = () =>
  apiHandler(() => API.get("/admin/stats"));

// Products API
const createProduct = (productData) =>
  apiHandler(() =>
    API.post(`/product`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
const blockUser = (productData) =>
  apiHandler(() => API.post(`/admin/block-user`, productData));
const unBlockUser = (productData) =>
  apiHandler(() => API.post(`/admin/unblock-user`, productData));
apiHandler(() => API.post(`/admin/block-user`, productData));
const createNoti = (notiData) =>
  apiHandler(() => API.post(`/admin/send-notifications`, notiData));
// services.js or wherever your API functions live
export const reportStatusChange = ({ reportId, status }) =>
  apiHandler(() => API.patch(`admin/report/${reportId}/mark-as`, { status }));
export const badgeStatusChange = ({ reportId, status, rejectionReason }) =>
  apiHandler(() =>
    API.patch(`admin/verify-user/${reportId}`, { status, rejectionReason })
  );


export const AllUsersGet = (query = "") =>
  apiHandler(() => API.get(`/admin/users${query}`));
export const AllNotificationGet = (query = "") =>
  apiHandler(() => API.get(`/admin/get-notifications${query}`));
export const AllVerifiedBadge = (query = "") =>
  apiHandler(() => API.get(`/admin/verification-requests${query}`));
export const AllOrder = (query = "") =>
  apiHandler(() => API.get(`/admin/orders${query}`));
export const userDetailGet = (id) =>
  apiHandler(() => API.get(`/admin/users-activity/${id}`));
export const verifiedGetDetail = (id) =>
  apiHandler(() => API.get(`/admin/verification-request/${id}`));
export const orderDetailGet = (id) =>
  apiHandler(() => API.get(`/admin/order/${id}`));
export const FeaturedProduct = (query = "") =>
  apiHandler(() => API.get(`/admin/iap-revenue${query}`));
export const AllReportsGet = (query = "") =>
  apiHandler(() => API.get(`/admin/reports${query}`));
export const reportDetail = (id) =>
  apiHandler(() => API.get(`/admin/report/${id}`));
const getAllProducts = (
  search,
  status,
  page = 1,
  limit = PAGINATION_CONFIG.defaultPageSize
) =>
  apiHandler(() =>
    API.get(
      `/product?page=${page}&limit=${limit}&search=${search}&status=${status}`
    )
  );

const updateProduct = (id, productData) =>
  apiHandler(() => API.put(`/product/${id}`, productData));

const deleteProduct = (id) => apiHandler(() => API.delete(`/product/${id}`));

const getProductById = (id) => apiHandler(() => API.get(`/product/${id}`));

// Categories API
const createCategory = (categoryData) =>
  apiHandler(() => API.post(`/category`, categoryData));

const getAllCategories = (
  status,
  page = 1,
  limit = PAGINATION_CONFIG.defaultPageSize
) =>
  apiHandler(() =>
    API.get(`/category?status=${status}&page=${page}&limit=${limit}`)
  );

const updateCategory = (id, categoryData) =>
  apiHandler(() => API.put(`/category/${id}`, categoryData));

const deleteCategory = (id) => apiHandler(() => API.delete(`/category/${id}`));

const getCategoryById = (id) => apiHandler(() => API.get(`/category/${id}`));

// Orders API
const getOrders = (
  paymentStatus,
  orderStatus,
  orderType,
  startDate,
  endDate,
  search,
  page = 1,
  limit = API_CONFIG.pagination.defaultPageSize
) =>
  apiHandler(() =>
    API.get(
      `/order?paymentStatus=${paymentStatus}&orderStatus=${orderStatus}&orderType=${orderType}&startDate=${startDate}&endDate=${endDate}&search=${search}&page=${page}&limit=${limit}`
    )
  );

const getOrdersByContact = (contactEmail) =>
  apiHandler(() => API.get(`/order/contact?email=${contactEmail}`));

const getOrderById = (id) => apiHandler(() => API.get(`/order/${id}`));

const updateOrder = (id, orderData) =>
  apiHandler(() => API.put(`/order/${id}`, orderData));

export const api = {
  login,
  forgotPassword,
  verifyOTP,
  updatePassword,
  updatePasswordAuth,
  logout,
  getDashboardAnalytics,
  getAllProducts,
  getAllCategories,
  createProduct,
  createCategory,
  updateProduct,
  deleteProduct,
  getProductById,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getOrders,
  getOrdersByContact,
  getOrderById,
  updateOrder,
  AllUsersGet,
  blockUser,
  userDetailGet,
  AllReportsGet,
  reportDetail,
  unBlockUser,
  AllOrder,
  orderDetailGet,
  FeaturedProduct,
  reportStatusChange,
  createNoti,
  AllVerifiedBadge,
  verifiedGetDetail,
  badgeStatusChange,
  AllNotificationGet
};
