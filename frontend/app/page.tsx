import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to TechPulse
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A scalable web application with JWT authentication, user management,
          and blog post dashboard.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium text-lg"
          >
            Register
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🔐</div>
            <h3 className="font-semibold text-lg mb-2">Secure Auth</h3>
            <p className="text-gray-600 text-sm">
              JWT-based authentication with password hashing
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-lg mb-2">Blog Posts</h3>
            <p className="text-gray-600 text-sm">
              Create, edit, and manage your blog posts
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold text-lg mb-2">Scalable</h3>
            <p className="text-gray-600 text-sm">
              Built with modern tech stack for production
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
