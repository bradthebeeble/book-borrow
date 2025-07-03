import { ProfileForm } from '@/components/auth/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your profile information and account preferences
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Profile Information
            </h2>
            <p className="text-sm text-gray-600">
              Update your personal details and account settings.
            </p>
          </div>
          
          <div className="p-6">
            <ProfileForm />
          </div>
        </div>

        {/* Additional sections can be added here */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Account Activity
            </h2>
            <p className="text-sm text-gray-600">
              View your recent activity and account statistics.
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Books Borrowed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Books Lent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Communities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Profile - Book Borrow',
  description: 'Manage your profile and account settings',
};