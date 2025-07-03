'use client';

import { ReactNode, FormEvent } from 'react';

interface AuthFormProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export function AuthForm({ 
  title, 
  children, 
  onSubmit, 
  isLoading = false, 
  error,
  className = '' 
}: AuthFormProps) {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white shadow-md rounded-lg px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </div>
    </div>
  );
}

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function AuthInput({
  id,
  label,
  type,
  required = false,
  placeholder,
  value,
  onChange,
  error,
  disabled = false
}: AuthInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error 
            ? 'border-red-300 focus:ring-red-500' 
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface AuthButtonProps {
  type?: 'submit' | 'button';
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export function AuthButton({
  type = 'submit',
  children,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  onClick,
  className = ''
}: AuthButtonProps) {
  const baseClasses = 'w-full py-2 px-4 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500 disabled:bg-gray-100'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled || isLoading ? 'cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

interface AuthCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function AuthCheckbox({
  id,
  label,
  checked,
  onChange,
  disabled = false
}: AuthCheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
}