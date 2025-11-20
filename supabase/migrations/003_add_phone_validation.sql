-- ✅ FIX #7: Add server-side phone number validation
-- This migration adds CHECK constraints to ensure valid phone number formats

-- Add phone validation constraint to inquiries table
-- Format: Optional '+' followed by 1-9, then 7-14 digits (E.164 international format)
-- Examples: +919876543210, 9876543210, +12125551234
ALTER TABLE inquiries
ADD CONSTRAINT valid_phone_format
CHECK (phone ~* '^\+?[1-9]\d{7,14}$');

-- Add phone validation constraint to invoices table (if exists)
-- Same format as above for consistency
ALTER TABLE invoices
ADD CONSTRAINT valid_phone_format
CHECK (customer_phone ~* '^\+?[1-9]\d{7,14}$');

-- Note: This regex pattern validates:
-- - Optional international prefix (+)
-- - First digit must be 1-9 (not 0)
-- - Total of 7-14 digits after first digit
-- - No spaces, dashes, or other special characters
--
-- Invalid examples that will be rejected:
-- - "123" (too short)
-- - "+0123456789" (starts with 0)
-- - "123-456-7890" (contains special chars)
-- - "12345678901234567" (too long)
