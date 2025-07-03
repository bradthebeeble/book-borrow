'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AuthForm, AuthInput, AuthButton, AuthCheckbox } from './AuthForm';

interface ProfileFormProps {
  className?: string;
}

interface ProfileData {
  name: string;
  email: string;
  isParent: boolean;
}

export function ProfileForm({ className }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isParent, setIsParent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setIsParent(session.user.isParent || false);
    }
  }, [session]);

  // Track changes
  useEffect(() => {
    if (session?.user) {
      const hasChanges = 
        name !== (session.user.name || '') ||
        email !== (session.user.email || '') ||
        isParent !== (session.user.isParent || false);
      setHasChanges(hasChanges);
    }
  }, [name, email, isParent, session]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          isParent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      // Update the session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
          email: data.user.email,
          isParent: data.user.isParent,
        },
      });

      setSuccess('Profile updated successfully!');
      setHasChanges(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setIsParent(session.user.isParent || false);
      setError('');
      setSuccess('');
    }
  };

  if (!session?.user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <AuthForm
      title="Profile Settings"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      className={className}
    >
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{session.user.name}</h3>
            <p className="text-sm text-gray-600">{session.user.email}</p>
            <p className="text-xs text-gray-500">
              {session.user.isParent ? 'Parent Account' : 'Standard Account'}
            </p>
          </div>
        </div>
      </div>

      <AuthInput
        id="name"
        label="Full Name"
        type="text"
        required
        placeholder="Enter your full name"
        value={name}
        onChange={setName}
        disabled={isLoading}
      />

      <AuthInput
        id="email"
        label="Email Address"
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={setEmail}
        disabled={isLoading}
      />

      <div className="space-y-3">
        <AuthCheckbox
          id="isParent"
          label="Parent Account (I manage child profiles)"
          checked={isParent}
          onChange={setIsParent}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Parent accounts can create and manage child profiles for book borrowing.
        </p>
      </div>

      <div className="flex space-x-3">
        <AuthButton
          type="submit"
          isLoading={isLoading}
          disabled={!hasChanges || !name || !email}
        >
          Save Changes
        </AuthButton>
        
        {hasChanges && (
          <AuthButton
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </AuthButton>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Account Actions</h4>
        <div className="space-y-2">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
            disabled={isLoading}
          >
            Change Password
          </button>
          <br />
          <button
            type="button"
            className="text-sm text-red-600 hover:text-red-500 focus:outline-none focus:underline"
            disabled={isLoading}
          >
            Delete Account
          </button>
        </div>
      </div>
    </AuthForm>
  );
}