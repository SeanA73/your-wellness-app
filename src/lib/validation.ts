export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validateSignUp = (data: {
  email: string;
  password: string;
  full_name?: string;
  confirmPassword?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
  }

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (data.full_name && data.full_name.trim().length < 2) {
    errors.full_name = 'Name must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProfile = (data: {
  full_name?: string;
  height_cm?: string | number;
  weight_kg?: string | number;
  date_of_birth?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (data.full_name && data.full_name.trim().length < 2) {
    errors.full_name = 'Name must be at least 2 characters';
  }

  if (data.height_cm) {
    const height = typeof data.height_cm === 'string' ? parseFloat(data.height_cm) : data.height_cm;
    if (isNaN(height) || height < 50 || height > 300) {
      errors.height_cm = 'Height must be between 50 and 300 cm';
    }
  }

  if (data.weight_kg) {
    const weight = typeof data.weight_kg === 'string' ? parseFloat(data.weight_kg) : data.weight_kg;
    if (isNaN(weight) || weight < 20 || weight > 500) {
      errors.weight_kg = 'Weight must be between 20 and 500 kg';
    }
  }

  if (data.date_of_birth) {
    const birthDate = new Date(data.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (isNaN(birthDate.getTime())) {
      errors.date_of_birth = 'Please enter a valid date';
    } else if (age < 13) {
      errors.date_of_birth = 'You must be at least 13 years old';
    } else if (age > 120) {
      errors.date_of_birth = 'Please enter a valid birth date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};





