export const validateDigit = (value: string): string => {
  if (value.length > 1) {
    value = value.charAt(0);
  }
  
  return /^\d*$/.test(value) ? value : '';
};

export const handleCodePaste = (pastedValue: string): string[] => {
  const digits = pastedValue.replace(/\D/g, '').slice(0, 4).split('');
  return [...digits, ...Array(4 - digits.length).fill('')];
}; 