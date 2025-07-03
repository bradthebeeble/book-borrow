'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm, AuthInput, AuthButton, AuthCheckbox } from './AuthForm';

interface RegisterFormProps {
  className?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export function RegisterForm({ className }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isParent, setIsParent] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string): { level: number; text: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score === 0) return { level: 0, text: '', color: '' };
    if (score <= 2) return { level: 1, text: 'Weak', color: 'text-red-500' };
    if (score <= 3) return { level: 2, text: 'Fair', color: 'text-yellow-500' };
    if (score <= 4) return { level: 3, text: 'Good', color: 'text-blue-500' };
    return { level: 4, text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          isParent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration successful - redirect to sign in
      router.push('/auth/signin?message=Registration successful! Please sign in.');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create Account"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      className={className}
    >
      <AuthInput
        id="name"
        label="Full Name"
        type="text"
        required
        placeholder="Enter your full name"
        value={name}
        onChange={setName}
        error={errors.name}
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
        error={errors.email}
        disabled={isLoading}
      />

      <div className="space-y-1">
        <AuthInput
          id="password"
          label="Password"
          type="password"
          required
          placeholder="Create a password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          disabled={isLoading}
        />
        {password && (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordStrength.level === 1 ? 'bg-red-500 w-1/4' :
                  passwordStrength.level === 2 ? 'bg-yellow-500 w-2/4' :
                  passwordStrength.level === 3 ? 'bg-blue-500 w-3/4' :
                  passwordStrength.level === 4 ? 'bg-green-500 w-full' : 'w-0'
                }`}
              />
            </div>
            <span className={`text-xs font-medium ${passwordStrength.color}`}>
              {passwordStrength.text}
            </span>
          </div>
        )}
      </div>

      <AuthInput
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        required
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        disabled={isLoading}
      />

      <AuthCheckbox
        id="isParent"
        label="I am a parent (I will manage child accounts)"
        checked={isParent}
        onChange={setIsParent}
        disabled={isLoading}
      />

      <div className="space-y-2">
        <AuthCheckbox
          id="terms"
          label={
            <span>
              I agree to the{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                Terms of Service
              </button>
              {' '}and{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                Privacy Policy
              </button>
            </span>
          }
          checked={acceptedTerms}
          onChange={setAcceptedTerms}
          disabled={isLoading}
        />
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms}</p>
        )}
      </div>

      <AuthButton
        type="submit"
        isLoading={isLoading}
        disabled={!name || !email || !password || !confirmPassword || !acceptedTerms}
      >
        Create Account
      </AuthButton>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => router.push('/auth/signin')}
          className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
          disabled={isLoading}
        >
          Sign in
        </button>
      </div>
    </AuthForm>
  );
}