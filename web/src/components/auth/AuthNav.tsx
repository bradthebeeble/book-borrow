'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function AuthNav() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/auth/signin')}
          className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push('/auth/signup')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {session.user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {session.user?.name || 'User'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-600">
                  {session.user?.email}
                </p>
                {session.user?.isParent && (
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Parent
                  </span>
                )}
              </div>
              
              <button
                onClick={() => {
                  router.push('/profile');
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </button>
              
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </button>
              
              {session.user?.isParent && (
                <button
                  onClick={() => {
                    router.push('/children');
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Manage Children
                </button>
              )}
              
              <hr className="my-1" />
              
              <button
                onClick={() => {
                  handleSignOut();
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}