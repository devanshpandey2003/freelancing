import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach JWT to admin requests
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("haveli_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("haveli_admin_token");
        window.location.href = "/admin";
      }
      return Promise.reject(err);
    }
  );
}

// ── Menu ──────────────────────────────────────────────────────────────────────
export const menuApi = {
  getAll: () => api.get("/menu"),
  getAllAdmin: () => api.get("/menu/all"),
  create: (data: FormData | object) => api.post("/menu", data),
  update: (id: string, data: object) => api.put(`/menu/${id}`, data),
  delete: (id: string) => api.delete(`/menu/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const ordersApi = {
  place: (data: { tableId: number; items: { menuItemId: string; quantity: number }[]; note?: string }) =>
    api.post("/orders", data),
  getAll: (params?: { status?: string; tableId?: number }) =>
    api.get("/orders", { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get("/dashboard"),
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  getAdmins: () => api.get("/auth/admins"),
  deleteAdmin: (id: string) => api.delete(`/auth/admins/${id}`),
};

// ── QR Codes ──────────────────────────────────────────────────────────────────
export const qrApi = {
  getAll: () => api.get("/qr"),
  getOne: (tableId: number) => api.get(`/qr/${tableId}`),
  downloadPng: (tableId: number) =>
    `${API_URL}/api/qr/${tableId}?format=png`,
};

// ── Upload ────────────────────────────────────────────────────────────────────
export const uploadApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ── Inventory ─────────────────────────────────────────────────────────────────
export const inventoryApi = {
  getCategories: () => api.get("/inventory/categories"),
  createCategory: (name: string) => api.post("/inventory/categories", { name }),
  updateCategory: (id: string, name: string) => api.put(`/inventory/categories/${id}`, { name }),
  deleteCategory: (id: string) => api.delete(`/inventory/categories/${id}`),
  getItems: (categoryId?: string) => api.get("/inventory/items", { params: categoryId ? { categoryId } : {} }),
  createItem: (data: object) => api.post("/inventory/items", data),
  updateItem: (id: string, data: object) => api.put(`/inventory/items/${id}`, data),
  deleteItem: (id: string) => api.delete(`/inventory/items/${id}`),
  adjustStock: (id: string, data: object) => api.post(`/inventory/items/${id}/stock`, data),
  getLogs: (id: string) => api.get(`/inventory/items/${id}/logs`),
};
