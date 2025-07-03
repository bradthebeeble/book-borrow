'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthForm, AuthInput, AuthButton, AuthCheckbox } from './AuthForm';

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn('google', { callbackUrl });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Sign In"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      className={className}
    >
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

      <AuthInput
        id="password"
        label="Password"
        type="password"
        required
        placeholder="Enter your password"
        value={password}
        onChange={setPassword}
        disabled={isLoading}
      />

      <div className="flex items-center justify-between">
        <AuthCheckbox
          id="remember"
          label="Remember me"
          checked={rememberMe}
          onChange={setRememberMe}
          disabled={isLoading}
        />
        
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>

      <AuthButton
        type="submit"
        isLoading={isLoading}
        disabled={!email || !password}
      >
        Sign In
      </AuthButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <AuthButton
        type="button"
        variant="secondary"
        onClick={handleGoogleSignIn}
        isLoading={isLoading}
      >
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </div>
      </AuthButton>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => router.push('/auth/signup')}
          className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
          disabled={isLoading}
        >
          Sign up
        </button>
      </div>
    </AuthForm>
  );
}