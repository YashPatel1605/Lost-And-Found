import apiClient from "../../utils/apiClient";

// SIGNUP
export const registerUser = (data) => {
  return apiClient.post("/auth/register", data);
};

// LOGIN
// export const loginUser = async (data) => {
//   const res = await apiClient.post("/auth/login", data);
//   localStorage.setItem("token", res.data.token);
//   localStorage.setItem("user", JSON.stringify(res.data.user || res.data.data?.user));
//   localStorage.setItem("user", res.id)
//   // localStorage.setItem("userid",res)
//   return res;
// };

// LOGIN
// export const loginUser = async (data) => {
//   const res = await apiClient.post("/auth/login", data);
//   const responseData = res.data?.data || res.data;
//   const userData = responseData.user || responseData;
//   const token = responseData.token;

//   if (token) {
//     localStorage.setItem("token", token);
//   }
//   if (userData) {
//     localStorage.setItem("user", JSON.stringify(userData));
//     if (userData.id || userData._id) {
//       localStorage.setItem("userId", userData.id || userData._id);
//     }
//     if (userData.role) {
//       localStorage.setItem("role", userData.role);
//     }
//   }
//   return res;
// };

export const loginUser = async (data) => {
  const res = await apiClient.post("/auth/login", data);
  const responseData = res.data?.data || res.data;
  const userData = responseData.user || responseData;
  const token = responseData.token;

  if (token) localStorage.setItem("token", token);
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));   
    localStorage.setItem("userId", userData._id || userData.id); 
  }
  return res;
};

// ForgetPassword
export const forgotPassword = (email) => {
  return apiClient.post("/auth/forgot-password", { email });
};

// export const resetPassword = (token, password) => {
//   return apiClient.post(`/auth/reset-password/${token}`, { password });
// };

export const resetPassword = (token, password) => {
  return apiClient.post(`/auth/reset-password`, { token, password });
};

// GET ALL ITEMS
// export const getAllItems = () => {
//   return apiClient.get("/items");
// };

export const getAllItems = (params = {}) => {
  return apiClient.get("/items", { params });
};



// GET ITEM BY ID
export const getItemById = (id) => {
  return apiClient.get(`/items/${id}`);
};

// DELETE ITEM
export const deleteItem = (id) => {
  return apiClient.delete(`/items/${id}`);
};

// UPDATE ITEM
export const updateItem = async (id, data) => {
  return await apiClient.put(`/items/${id}`, data);
};

// UPLOAD IMAGE
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return apiClient.post("/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// REPORT ITEM
export const reportItem = (data) => {
  return apiClient.post("/items/report-item", data);
};

// New reports
export const submitClaim = (itemId) => {
  return apiClient.post("/items/update-report-item", { itemId });
};

// Marks as Claim
// export const markItemAsClaimed = async (id, statusData) => { 
//   return await apiClient.put(`/items/${id}`, { find: true });
// };

export const markItemAsClaimed = async (id, isClaiming = true) => { 
  return await apiClient.put(`/items/${id}`, { find: isClaiming , type: "claim"});
};

// GET MY ITEMS 
// export const getMyItems = () => {
//   const userId = localStorage.getItem("userId");
//   return apiClient.get(`/items?userId=${userId}`);
// };
