import PasswordValidator from 'password-validator';

export const passwordRequirements = {
  minLength: 5,
  hasUppercase: true,
  hasLowercase: true
};

export interface PasswordValidationResult {
  isValid: boolean;
  failedChecks: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const schema = new PasswordValidator();
  
  schema
    .is().min(passwordRequirements.minLength)
    .has().uppercase()
    .has().lowercase();
  
  const failedChecks = schema.validate(password, { list: true }) as string[];
  
  return {
    isValid: failedChecks.length === 0,
    failedChecks
  };
};

export const passwordErrorKeys = {
  min: 'password.tooShort',
  uppercase: 'password.missingUppercase',
  lowercase: 'password.missingLowercase'
}; 