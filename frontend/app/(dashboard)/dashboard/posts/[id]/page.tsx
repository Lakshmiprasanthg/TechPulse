'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/lib/posts';
import { useParams } from 'next/navigation';

export default function ViewPostPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postService.getPostById(postId),
    enabled: !isNaN(postId),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl">
        <div className="card bg-red-50 border-red-200 text-red-700">
          Failed to load post
        </div>
        <Link
          href="/dashboard/posts"
          className="mt-4 inline-block text-primary-600 hover:text-primary-700"
        >
          ← Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/dashboard/posts"
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          ← Back to Posts
        </Link>
      </div>

      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>By {post.author.name}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  post.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {post.status}
              </span>
            </div>
          </div>
          <Link
            href={`/dashboard/posts/${post.id}/edit`}
            className="btn-primary"
          >
            Edit Post
          </Link>
        </div>

        {post.excerpt && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 italic">{post.excerpt}</p>
          </div>
        )}

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800">
            {post.content}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(post.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
