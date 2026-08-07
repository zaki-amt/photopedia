const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("photopedia_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// Typed API Calls
export const api = {
  // Auth
  register: (data: any) =>
    fetchApi<{ user: any; accessToken: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: any) =>
    fetchApi<{ user: any; accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Posts
  getPosts: (category?: string, feed?: string) => {
    const query = new URLSearchParams();
    if (category && category !== "All") query.append("category", category);
    if (feed) query.append("feed", feed);
    const queryString = query.toString();
    return fetchApi<any[]>(`/posts${queryString ? `?${queryString}` : ""}`);
  },

  getPostById: (id: string) => fetchApi<any>(`/posts/${id}`),

  createPost: (data: any) =>
    fetchApi<any>("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  toggleLike: (id: string) =>
    fetchApi<{ liked: boolean; count: number }>(`/posts/${id}/like`, { method: "POST" }),

  addComment: (id: string, content: string) =>
    fetchApi<any>(`/posts/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  flagPost: (id: string, reason?: string) =>
    fetchApi<any>(`/posts/${id}/flag`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  deletePost: (id: string) =>
    fetchApi<any>(`/posts/${id}`, { method: "DELETE" }),

  getTopCategories: () => fetchApi<any[]>("/posts/top-categories"),

  // Users
  getProfile: (username: string) => fetchApi<any>(`/users/${username}`),

  updateProfile: (data: any) =>
    fetchApi<any>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  toggleFollow: (id: string) =>
    fetchApi<{ following: boolean; targetUsername: string; targetUserId?: string }>(`/users/${id}/follow`, { method: "POST" }),

  unfollowUser: (id: string) =>
    fetchApi<{ following: boolean; targetUsername: string; targetUserId?: string }>(`/users/${id}/follow`, { method: "DELETE" }),

  getFollowingIds: () => fetchApi<string[]>("/users/me/following-ids"),

  getFollowers: (username: string) => fetchApi<any[]>(`/users/${username}/followers`),

  getFollowing: (username: string) => fetchApi<any[]>(`/users/${username}/following`),

  getSuggestedCreators: () => fetchApi<any[]>("/users/suggested"),

  // Admin
  getAdminMetrics: () => fetchApi<any>("/admin/metrics"),

  getAdminUsers: () => fetchApi<any[]>("/admin/users"),

  toggleUserRole: (id: string) =>
    fetchApi<any>(`/admin/users/${id}/role`, { method: "POST" }),

  toggleUserStatus: (id: string) =>
    fetchApi<any>(`/admin/users/${id}/status`, { method: "POST" }),

  deleteUser: (id: string) =>
    fetchApi<any>(`/admin/users/${id}`, { method: "DELETE" }),

  getModerationQueue: () => fetchApi<any[]>("/admin/moderation"),

  updateModeration: (id: string, status: "APPROVED" | "REMOVED") =>
    fetchApi<any>(`/admin/moderation/${id}`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),
};
