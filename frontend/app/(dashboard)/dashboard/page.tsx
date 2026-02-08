'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome, {user?.name}! 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your Profile
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Name:</span> {user?.name}
            </p>
            <p>
              <span className="font-medium">Member since:</span>{' '}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Edit Profile →
          </Link>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/posts/new"
              className="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-medium"
            >
              Create New Post
            </Link>
            <Link
              href="/dashboard/posts"
              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Getting Started
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Create your first post</p>
              <p className="text-gray-600">
                Start by creating a blog post. You can save it as a draft or publish it immediately.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage your content</p>
              <p className="text-gray-600">
                Edit, delete, or change the status of your posts at any time.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Search and filter</p>
              <p className="text-gray-600">
                Use the search and filter features to find specific posts quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
