export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published';
  authorId: number;
  author: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  status?: 'draft' | 'published';
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: 'draft' | 'published';
}
