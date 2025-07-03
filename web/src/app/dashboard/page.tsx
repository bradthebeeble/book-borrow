import { auth } from '@/auth';
import { AuthNav } from '@/components/auth/AuthNav';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Book Borrow</h1>
            </div>
            <AuthNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Book Borrow, {session.user?.name}!
              </h2>
              <p className="text-gray-600 mb-4">
                Your dashboard is ready. Start by exploring the features below.
              </p>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">
                  Account Type: {session.user?.isParent ? 'Parent' : 'Standard'}
                </div>
                <div className="text-sm text-gray-500">
                  Email: {session.user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: 'Dashboard - Book Borrow',
  description: 'Your Book Borrow dashboard',
};