import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

function LoginFormWrapper() {
  return <LoginForm className="mt-8" />;
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Book Borrow
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Sign in to your account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <LoginFormWrapper />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Sign In - Book Borrow',
  description: 'Sign in to your Book Borrow account',
};