import { api } from './api';
import {
  Post,
  ApiResponse,
  PostsResponse,
  CreatePostData,
  UpdatePostData,
} from './types';

export const postService = {
  async getPosts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PostsResponse> {
    const response = await api.get<ApiResponse<PostsResponse>>('/posts', {
      params,
    });
    if (!response.data.data) {
      throw new Error('Failed to fetch posts');
    }
    return response.data.data;
  },

  async getPostById(id: number): Promise<Post> {
    const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    if (!response.data.data) {
      throw new Error('Failed to fetch post');
    }
    return response.data.data;
  },

  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post<ApiResponse<Post>>('/posts', data);
    if (!response.data.data) {
      throw new Error('Failed to create post');
    }
    return response.data.data;
  },

  async updatePost(id: number, data: UpdatePostData): Promise<Post> {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update post');
    }
    return response.data.data;
  },

  async deletePost(id: number): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};
