// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password strength calculation
export const getPasswordStrength = (password: string): { 
  level: number; 
  text: string; 
  color: string;
  score: number;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score === 0 || password.length === 0) {
    return { level: 0, text: '', color: '', score };
  }
  
  if (score <= 2) {
    return { level: 1, text: 'Weak', color: 'text-red-500', score };
  }
  
  if (score === 3) {
    return { level: 2, text: 'Fair', color: 'text-yellow-500', score };
  }
  
  if (score === 4) {
    return { level: 3, text: 'Good', color: 'text-blue-500', score };
  }
  
  return { level: 4, text: 'Strong', color: 'text-green-500', score };
};

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Form validation helpers
export const validateRegistrationForm = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!isValidName(data.name)) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0]; // Show first error
  }
  
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (!data.acceptedTerms) {
    errors.terms = 'You must accept the terms and conditions';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (data: {
  email: string;
  password: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};