import { RegisterForm } from '@/components/auth/RegisterForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Book Borrow
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the community and start sharing books
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm className="mt-8" />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Sign Up - Book Borrow',
  description: 'Create your Book Borrow account and start sharing books',
};