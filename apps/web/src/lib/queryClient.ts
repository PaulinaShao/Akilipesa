import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Common API functions
export const api = {
  // User APIs
  getUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },
  
  updateUser: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },
  
  // Stories APIs
  getStories: async () => {
    const response = await fetch(`${API_BASE_URL}/stories`);
    if (!response.ok) throw new Error('Failed to fetch stories');
    return response.json();
  },
  
  // Products APIs
  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },
  
  getProducts: async (params?: { category?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },
  
  // Wallet APIs
  getWallet: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/wallet/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch wallet');
    return response.json();
  },
  
  addFunds: async (userId: string, amount: number) => {
    const response = await fetch(`${API_BASE_URL}/wallet/${userId}/add-funds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error('Failed to add funds');
    return response.json();
  },
  
  // Plans APIs
  getPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/plans`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  },
  
  purchasePlan: async (userId: string, planId: string) => {
    const response = await fetch(`${API_BASE_URL}/plans/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, planId }),
    });
    if (!response.ok) throw new Error('Failed to purchase plan');
    return response.json();
  },
  
  // Admin APIs
  admin: {
    getUsers: async (params?: { page?: number; limit?: number; filter?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.filter) searchParams.set('filter', params.filter);
      
      const response = await fetch(`${API_BASE_URL}/admin/users?${searchParams}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    
    banUser: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to ban user');
      return response.json();
    },
    
    unbanUser: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to unban user');
      return response.json();
    },
    
    runPayouts: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/payouts/run`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to run payouts');
      return response.json();
    },
    
    updatePlan: async (planId: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/admin/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update plan');
      return response.json();
    },
  },
};
