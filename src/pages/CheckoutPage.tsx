import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
// ✅ Correct
import { getActiveRegion, formatCurrency } from "../config/regions";
import { env } from '../utils/env';

// Payment gateway scripts
declare global {
  interface Window {
    Razorpay: any;
    paypal: any;
  }
}

interface Service {
  name: string;
  price: string;
  totalAmount: number;
  depositAmount: number;
  timeline: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedService = location.state as Service | null;

  // ✅ Correct
  const regionConfig = getActiveRegion();
  const { payment, currency } = regionConfig;

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Payment Successful!');
  
  // NEW STATE: Tracks if the form fields are complete and valid
  const [isFormValid, setIsFormValid] = useState(false); 

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    projectDetails: ''
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    projectDetails?: string;
  }>({});

  // 🛠️ FIX #1: Create a ref for customer details to use in PayPal/Razorpay closures
  const customerDetailsRef = useRef(customerDetails);
  
  // 🛠️ FIX #1: Keep the ref updated on every state change
  useEffect(() => {
      customerDetailsRef.current = customerDetails;
  }, [customerDetails]);

  // Redirect if no service data
  useEffect(() => {
    if (!selectedService) {
      navigate('/services');
    }
  }, [selectedService, navigate]);

  // CSRF token generation
  useEffect(() => {
    if (!sessionStorage.getItem('csrf_token')) {
      const csrfToken = crypto.randomUUID();
      sessionStorage.setItem('csrf_token', csrfToken);
    }
  }, []);

  // Phone validation helper
  const validatePhone = (phone: string): boolean => {
    try {
      return isValidPhoneNumber(phone);
    } catch {
      return false;
    }
  };

  // NEW/MODIFIED: Unified Form Validation Logic
  const validateForm = useCallback((focusOnError = false) => {
    const errors: typeof validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (!customerDetails.name.trim()) {
      errors.name = 'Name is required';
      valid = false;
    }

    if (!customerDetails.email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(customerDetails.email)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }

    const phoneDigitsOnly = customerDetails.phone?.replace(/\D/g, '') || '';
    if (customerDetails.phone && phoneDigitsOnly.length >= 6 && !validatePhone(customerDetails.phone)) {
      errors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    if (!customerDetails.projectDetails.trim()) {
      errors.projectDetails = 'Project details are required';
      valid = false;
    }
    
    setValidationErrors(errors);
    setIsFormValid(valid);

    if (focusOnError && !valid) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(`checkout-${firstErrorField === 'projectDetails' ? 'details' : firstErrorField}`);
      errorElement?.focus();
    }
    
    return valid;
  }, [customerDetails]);


  // Effect to re-validate form whenever customerDetails change
  useEffect(() => {
      validateForm(false);
  }, [customerDetails, validateForm]);
  
  
  // Load Razorpay for India region (Unchanged)
  useEffect(() => {
    if (payment.gateway === 'razorpay' && !razorpayLoaded && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
        console.log('✅ Razorpay script loaded (India region)');
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        setRazorpayLoaded(false);
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [payment.gateway, razorpayLoaded]);

  // Load PayPal for Global region (Unchanged)
  useEffect(() => {
    if (payment.gateway === 'paypal' && !paypalLoaded && !window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${env.PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
        console.log('✅ PayPal SDK loaded (Global region)');
      };
      script.onerror = () => {
        console.error('❌ Failed to load PayPal SDK');
        setPaypalLoaded(false);
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [payment.gateway, paypalLoaded]);

  // 🛠️ FIX #2: Render PayPal buttons only once with stable dependencies
  useEffect(() => {
    // Only attempt to render PayPal if it's the right gateway, it's loaded, and we have a service
    if (payment.gateway !== 'paypal' || !paypalLoaded || !window.paypal || !selectedService) return;

    const paypalContainer = document.getElementById('paypal-button-container-page');
    if (!paypalContainer) return;

    // CRITICAL: Stop re-rendering if buttons are already present
    if (paypalContainer.hasChildNodes()) {
        return; 
    }

    window.paypal.Buttons({
      // We rely on isFormValid state via the JSX conditional to enable the button container
      createOrder: (data: any, actions: any) => {
        // Use the Ref to access the LATEST form data without making it a dependency
        const latestDetails = customerDetailsRef.current;
        
        // Final validation check before order creation
        if (!validateForm(false)) { 
            return Promise.reject('Validation failed');
        }

        return actions.order.create({
          purchase_units: [{
            amount: {
              value: (selectedService.depositAmount / currency.exchangeRate).toFixed(2), 
              currency_code: currency.code
            },
            description: `Deposit for ${selectedService.name}`,
            // Use the data from the REF
            custom_id: `${latestDetails.name}|${latestDetails.email}|${latestDetails.phone}|${selectedService.name}`,
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        return actions.order.capture().then(async (details: any) => {
          console.log('✅ PayPal Payment captured:', details);
          await showSuccessAndRedirect(`/payment-confirmation?status=success&gateway=paypal&id=${details.id}&service=${encodeURIComponent(selectedService.name)}&amount=${selectedService.depositAmount}`);
        });
      },
      onError: (err: any) => {
        console.error('❌ PayPal Error:', err);
        alert('Payment failed. Please try again or contact support.');
      },
      onCancel: () => {
        console.log('ℹ️ Payment cancelled');
      }
    }).render('#paypal-button-container-page');
    // Dependencies are now stable, preventing re-render on every keystroke
  }, [payment.gateway, paypalLoaded, selectedService, currency]);

  // Razorpay error messages (Unchanged)
  const getRazorpayErrorMessage = (error: any): string => {
    const errorCode = error?.error?.code;
    const errorDescription = error?.error?.description;
    const errorReason = error?.error?.reason;

    switch (errorCode) {
      case 'BAD_REQUEST_ERROR':
        return '❌ Invalid payment request. Please try again or contact support.';
      case 'GATEWAY_ERROR':
        return '❌ Payment gateway error. Please try a different payment method.';
      case 'SERVER_ERROR':
      case 'NETWORK_ERROR':
        return '❌ Server error occurred. Please try again in a moment.';
      default:
        if (errorReason?.includes('payment_failed') || errorReason?.includes('card_declined') || errorReason?.includes('insufficient_funds')) {
          return `❌ Payment failed: ${errorReason.replace(/_/g, ' ')}. Please check details and try again.`;
        }
        if (errorDescription?.toLowerCase().includes('timeout')) {
          return '❌ Payment timeout. Please try again.';
        }
        return errorDescription || '❌ Payment failed. Please contact us directly via email.';
    }
  };

  // Razorpay payment processing (Now uses ref for customer details)
  const processRazorpayPayment = async () => {
    if (!selectedService || !selectedService.depositAmount) return;

    try {
      if (!env.SUPABASE_URL || !env.SUPABASE_URL.startsWith('http') || !env.SUPABASE_ANON_KEY || !env.RAZORPAY_KEY_ID) {
        alert('⚠️ Payment system is not configured yet.\n\nPlease contact us directly via email:\ncontact@sudharsanbuilds.com');
        setIsPaymentLoading(false);
        return;
      }

      const totalAmount = selectedService.totalAmount || selectedService.depositAmount;
      const createOrderUrl = `${env.SUPABASE_URL}/functions/v1/create-payment-order`;
      const csrfToken = sessionStorage.getItem('csrf_token');

      // 🛠️ FIX #3: Use ref for current data
      const latestDetails = customerDetailsRef.current; 

      const response = await fetch(createOrderUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
          'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify({
          amount: selectedService.depositAmount * 100,
          currency: 'INR',
          receipt: `deposit_${selectedService.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          notes: {
            service_name: selectedService.name,
            service_price: selectedService.price,
            total_amount: totalAmount,
            deposit_amount: selectedService.depositAmount,
            customer_name: latestDetails.name, 
            customer_email: latestDetails.email, 
            customer_phone: latestDetails.phone 
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const { orderId, amount } = await response.json();

      const options = {
        key: env.RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'Sudharsan Builds',
        description: `Deposit for ${selectedService.name}`,
        order_id: orderId,
        handler: async function (razorpayResponse: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          console.log('✅ Payment Response:', razorpayResponse);
          await showSuccessAndRedirect(`/payment-confirmation?status=success&gateway=razorpay&id=${razorpayResponse.razorpay_payment_id}&service=${encodeURIComponent(selectedService.name)}&amount=${selectedService.depositAmount}`);
        },
        prefill: {
          name: latestDetails.name, 
          email: latestDetails.email, 
          contact: latestDetails.phone 
        },
        theme: {
          color: '#06b6d4'
        },
        modal: {
          ondismiss: function () {
            setIsPaymentLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        const errorMessage = getRazorpayErrorMessage(response);
        alert(errorMessage);
        setIsPaymentLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error('❌ Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsPaymentLoading(false);
    }
  };

  // Success overlay and redirect (Unchanged)
  const showSuccessAndRedirect = async (confirmationUrl: string) => {
    setShowSuccessOverlay(true);
    setSuccessMessage('✓ Payment Successful!');

    await new Promise(resolve => setTimeout(resolve, 800));
    setSuccessMessage('Generating invoice...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccessMessage('Sending confirmation email...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccessMessage('Redirecting...');

    await new Promise(resolve => setTimeout(resolve, 500));
    navigate(confirmationUrl);
  };

  // MODIFIED: Main payment handler (PayPal flow now just focuses and waits for the SDK button click)
  const handlePaymentProceed = async () => {
    if (!selectedService || !selectedService.depositAmount) return;

    const valid = validateForm(true); // Validate and focus on error if necessary

    if (!valid) {
      // Validation failed, errors are already set by validateForm
      return;
    }

    // For PayPal, validation is complete, but we wait for the SDK button click.
    if (payment.gateway === 'paypal') {
        // Scroll to the PayPal button container to make it visible
        document.getElementById('paypal-button-container-page')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // Razorpay flow
    setIsPaymentLoading(true);

    if (!razorpayLoaded || !window.Razorpay) {
      let retries = 0;
      const maxRetries = 30;

      while (retries < maxRetries) {
        if (window.Razorpay && razorpayLoaded) break;
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
      }

      if (!window.Razorpay || !razorpayLoaded) {
        setIsPaymentLoading(false);
        alert('⚠️ Payment system failed to load. Please refresh the page and try again.');
        return;
      }
    }

    await processRazorpayPayment();
  };


  if (!selectedService) {
    return null;
  }
  
  // Helper to update customer details and clear errors on input change
  const handleChange = (field: keyof typeof customerDetails, value: string) => {
      setCustomerDetails(prev => ({ ...prev, [field]: value }));
      if (validationErrors[field]) {
          setValidationErrors(prev => ({ ...prev, [field]: undefined }));
      }
  };


  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/services')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Services
        </button>

        {/* Checkout Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Complete Your Booking</h1>
            <p className="text-cyan-50">{selectedService.name} - {selectedService.price}</p>
            <p className="text-sm text-cyan-100 mt-1">
              Deposit: {formatCurrency(selectedService.depositAmount, regionConfig)}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            <p className="text-slate-600 text-sm">
              Please provide your details to complete the booking. You'll receive a confirmation email and invoice after payment.
            </p>

            {/* Name */}
            <div>
              <label htmlFor="checkout-name" className="block text-slate-700 font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="checkout-name"
                value={customerDetails.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  validationErrors.name
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-slate-300 focus:ring-cyan-500'
                }`}
                placeholder="John Doe"
                required
              />
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="checkout-email" className="block text-slate-700 font-semibold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="checkout-email"
                value={customerDetails.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  validationErrors.email
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-slate-300 focus:ring-cyan-500'
                }`}
                placeholder="john@example.com"
                required
              />
              {validationErrors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {validationErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="checkout-phone" className="block text-slate-700 font-semibold mb-2">
                Phone Number (Optional)
              </label>
              <PhoneInput
                international
                defaultCountry={regionConfig.region === 'india' ? 'IN' : 'US'}
                value={customerDetails.phone}
                onChange={(value) => handleChange('phone', value || '')}
                numberInputProps={{
                  id: 'checkout-phone',
                  className: `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.phone
                      ? 'border-red-500 focus:ring-red-500 bg-red-50'
                      : 'border-slate-300 focus:ring-cyan-500'
                  }`
                }}
              />
              {validationErrors.phone && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Project Details */}
            <div>
              <label htmlFor="checkout-details" className="block text-slate-700 font-semibold mb-2">
                Project Details *
              </label>
              <textarea
                id="checkout-details"
                value={customerDetails.projectDetails}
                onChange={(e) => handleChange('projectDetails', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-colors ${
                  validationErrors.projectDetails
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-slate-300 focus:ring-cyan-500'
                }`}
                placeholder="Brief description of your project requirements..."
                required
              />
              {validationErrors.projectDetails && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {validationErrors.projectDetails}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Service:</span>
                  <span className="font-semibold text-slate-900">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Amount:</span>
                  <span className="font-semibold text-slate-900">{selectedService.price}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-slate-600">Deposit (Pay Now):</span>
                  <span className="font-bold text-cyan-600 text-lg">
                    {formatCurrency(selectedService.depositAmount, regionConfig)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Timeline:</span>
                  <span className="font-semibold text-slate-900">{selectedService.timeline}</span>
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="pt-4 border-t border-slate-200">
              {payment.gateway === 'razorpay' ? (
                // Razorpay flow: uses a single button to validate and proceed
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/services')}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentProceed}
                    disabled={isPaymentLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPaymentLoading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              ) : (
                // PayPal flow: uses a custom button to validate, then reveals the PayPal SDK button
                <div className="space-y-3">
                  <button
                    onClick={handlePaymentProceed}
                    disabled={!isFormValid || isPaymentLoading} // Disabled until form is valid
                    className={`w-full px-6 py-3 text-white rounded-lg font-semibold transition-all ${
                        isFormValid 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50' 
                            : 'bg-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isFormValid ? 'Proceed to PayPal' : 'Fill Form to Enable Payment'}
                  </button>
                    
                  {/* PayPal button container - ONLY renders SDK buttons if isFormValid is true */}
                  {isFormValid && (
                    <div id="paypal-button-container-page" className="min-h-[45px]"></div>
                  )}

                  {!isFormValid && (
                    <p className="text-xs text-center text-red-500">
                        Please complete all required fields to proceed to PayPal.
                    </p>
                  )}
                    
                  <button
                    onClick={() => navigate('/services')}
                    className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Overlay (Unchanged) */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </motion.div>

              <motion.h2
                key={successMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-4"
              >
                {successMessage}
              </motion.h2>

              {(successMessage.includes('Generating') || successMessage.includes('Sending') || successMessage.includes('Redirecting')) && (
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}