import { getCached, setCache, clearCache, deduplicateRequest } from './api-utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Generic API request function with caching and request deduplication
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL: number = 30000 // 30 seconds default
): Promise<T> {
  // Check cache for GET requests
  if (cacheKey && !options.method) {
    const cached = getCached<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  // Use deduplication for GET requests
  if (cacheKey && !options.method) {
    return deduplicateRequest(cacheKey, async () => {
      return makeRequest<T>(endpoint, options, cacheKey, cacheTTL);
    });
  }

  return makeRequest<T>(endpoint, options, cacheKey, cacheTTL);
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL: number = 30000
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal, // Support AbortController
    });

    // Handle connection errors
    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    const data = await response.json();

    // Cache GET requests
    if (cacheKey && !options.method && response.ok) {
      setCache(cacheKey, data, cacheTTL);
    }

    return data;
  } catch (error: any) {
    // Handle network errors (connection refused, timeout, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const baseUrl = API_BASE_URL.replace('/api', '');
      throw new Error(
        `Cannot connect to backend server at ${baseUrl}. ` +
        `Please make sure the backend server is running. ` +
        `Run: cd backend && npm run dev`
      );
    }
    // Re-throw other errors
    throw error;
  }
}

// Export cache utilities
export { clearCache };

// Upload API
export const uploadAPI = {
  uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Failed to upload file' }));
        throw new Error(data.message || 'Failed to upload file');
      }

      const data = await response.json();

      // Convert relative URL to absolute URL
      const baseUrl = API_BASE_URL.replace('/api', '');
      const fileUrl = data.url.startsWith('http') ? data.url : `${baseUrl}${data.url}`;

      return {
        url: fileUrl,
        filename: data.filename,
      };
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const baseUrl = API_BASE_URL.replace('/api', '');
        throw new Error(
          `Cannot connect to backend server at ${baseUrl}. ` +
          `Please make sure the backend server is running. ` +
          `Run: cd backend && npm run dev`
        );
      }
      throw error;
    }
  },

  uploadMultipleFiles: async (files: File[]): Promise<Array<{ url: string; filename: string }>> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Failed to upload files' }));
        throw new Error(data.message || 'Failed to upload files');
      }

      const data = await response.json();

      // Convert relative URLs to absolute URLs
      const baseUrl = API_BASE_URL.replace('/api', '');
      return data.files.map((file: any) => ({
        url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        filename: file.filename,
      }));
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const baseUrl = API_BASE_URL.replace('/api', '');
        throw new Error(
          `Cannot connect to backend server at ${baseUrl}. ` +
          `Please make sure the backend server is running. ` +
          `Run: cd backend && npm run dev`
        );
      }
      throw error;
    }
  },
};

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role?: 'customer' | 'shopkeeper';
  }) => {
    const data = await apiRequest<{ token: string; user: any; message: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: any; message: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
    }
  },

  getCurrentUser: async () => {
    return apiRequest<{ user: any }>('/auth/me');
  },

  updateProfile: async (updates: { name?: string; email?: string }) => {
    return apiRequest<{ user: any; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest<{ message: string }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Shops API
export const shopsAPI = {
  getAll: async (useCache: boolean = true) => {
    const cacheKey = useCache ? 'shops:all' : undefined;
    return apiRequest<{ shops: any[] }>('/shops', {}, cacheKey, 60000); // Cache for 1 minute
  },

  getById: async (id: string) => {
    return apiRequest<{ shop: any }>(`/shops/${id}`, {}, `shops:${id}`, 60000);
  },

  // Client-side search - no API call needed if we have cached shops
  search: async (query: string, shops?: any[]) => {
    // If shops are provided, search client-side (no API call)
    if (shops) {
      if (!query) return { shops };
      const searchTerm = query.toLowerCase();
      return {
        shops: shops.filter(
          (shop: any) =>
            shop.shopName?.toLowerCase().includes(searchTerm) ||
            shop.category?.toLowerCase().includes(searchTerm) ||
            shop.city?.toLowerCase().includes(searchTerm) ||
            shop.address?.toLowerCase().includes(searchTerm)
        ),
      };
    }
    
    // Fallback: fetch and search (should rarely happen)
    const allShops = await shopsAPI.getAll();
    if (!query) return allShops;
    const searchTerm = query.toLowerCase();
    return {
      shops: allShops.shops.filter(
        (shop: any) =>
          shop.shopName?.toLowerCase().includes(searchTerm) ||
          shop.category?.toLowerCase().includes(searchTerm) ||
          shop.city?.toLowerCase().includes(searchTerm) ||
          shop.address?.toLowerCase().includes(searchTerm)
      ),
    };
  },

  create: async (shopData: {
    shopName: string;
    category: string;
    address: string;
    city: string;
    phone: string;
    timings?: string;
    description?: string;
    logo?: string;
  }) => {
    return apiRequest<{ shop: any; message: string }>('/shops', {
      method: 'POST',
      body: JSON.stringify(shopData),
    });
  },

  update: async (id: string, updates: Partial<any>) => {
    return apiRequest<{ shop: any; message: string }>(`/shops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ message: string }>(`/shops/${id}`, {
      method: 'DELETE',
    });
  },
};

// Products API
export const productsAPI = {
  getAll: async (filters?: { shopId?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (filters?.shopId) params.append('shopId', filters.shopId);
    if (filters?.category) params.append('category', filters.category);
    const query = params.toString();
    const cacheKey = filters?.shopId ? `products:shop:${filters.shopId}` : 'products:all';
    return apiRequest<{ products: any[] }>(`/products${query ? `?${query}` : ''}`, {}, cacheKey, 30000);
  },

  getById: async (id: string) => {
    return apiRequest<{ product: any }>(`/products/${id}`, {}, `products:${id}`, 60000);
  },

  create: async (productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    shopId: string;
    image?: string;
    stock?: number;
  }) => {
    const result = await apiRequest<{ product: any; message: string }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    // Clear product caches
    clearCache('products:');
    return result;
  },

  update: async (id: string, updates: Partial<any>) => {
    const result = await apiRequest<{ product: any; message: string }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    // Clear product caches
    clearCache('products:');
    return result;
  },

  delete: async (id: string) => {
    const result = await apiRequest<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
    // Clear product caches
    clearCache('products:');
    return result;
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    return apiRequest<{ orders: any[] }>('/orders', {}, 'orders:all', 15000); // Cache for 15 seconds
  },

  getByShopId: async (shopId: string) => {
    // Use cached orders if available, filter client-side
    const cacheKey = `orders:shop:${shopId}`;
    const cached = getCached<{ orders: any[] }>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Fetch all orders (they're filtered by backend based on user role)
    const orders = await apiRequest<{ orders: any[] }>('/orders', {}, 'orders:all', 15000);
    const filtered = {
      orders: orders.orders.filter((order: any) => order.shopId === shopId),
    };
    
    // Cache filtered result
    setCache(cacheKey, filtered, 15000);
    return filtered;
  },

  getById: async (id: string) => {
    return apiRequest<{ order: any }>(`/orders/${id}`);
  },

  create: async (orderData: {
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    }>;
    shopId: string;
    shopName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    customerPincode: string;
    paymentMethod?: string;
  }) => {
    return apiRequest<{ order: any; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  updateStatus: async (id: string, status: string) => {
    const result = await apiRequest<{ order: any; message: string }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    // Clear order caches
    clearCache('orders:');
    return result;
  },
};

