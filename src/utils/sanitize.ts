import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - User input string to sanitize
 * @returns Sanitized string safe for use in HTML/emails
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Configure DOMPurify for strict sanitization
  const cleanInput = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });

  // Additional sanitization: remove potential script content
  return cleanInput
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .trim();
};

/**
 * Sanitize email for email services
 * Prevents email injection attacks
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';

  // Basic sanitization
  const cleaned = sanitizeInput(email);

  // Remove any newlines or carriage returns (email injection prevention)
  return cleaned.replace(/[\r\n]/g, '');
};

/**
 * Sanitize phone number
 * Allows only numbers, +, -, (, ), and spaces
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';

  // Allow only valid phone number characters
  return phone.replace(/[^0-9+\-() ]/g, '').trim();
};

/**
 * Sanitize form data object
 * @param formData - Object containing form fields
 * @returns Sanitized form data object
 */
export const sanitizeFormData = <T extends Record<string, any>>(formData: T): T => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Special handling for email and phone fields
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key] = sanitizePhone(value);
      } else {
        sanitized[key] = sanitizeInput(value);
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
};
