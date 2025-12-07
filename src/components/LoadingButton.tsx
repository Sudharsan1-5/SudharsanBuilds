import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function LoadingButton({
  loading = false,
  loadingText,
  icon,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: LoadingButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg focus:ring-cyan-500',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${className}
  `.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

// Convenience components for common button types
export function SaveButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton variant="primary" loadingText="Saving..." {...props} />;
}

export function DeleteButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton variant="danger" loadingText="Deleting..." {...props} />;
}

export function SubmitButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton variant="success" loadingText="Submitting..." {...props} />;
}

export function CancelButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton variant="secondary" {...props} />;
}
