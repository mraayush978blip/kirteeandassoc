import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.75rem' },
    md: { padding: '0.875rem 1.75rem', fontSize: '0.8125rem' },
    lg: { padding: '1.125rem 2.25rem', fontSize: '0.875rem' },
  };

  const combinedStyles: React.CSSProperties = {
    ...sizeStyles[size],
    ...style,
  };

  const content = (
    <>
      {isLoading && (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
          aria-hidden="true"
        />
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`btn ${variantClass} ${className}`} style={combinedStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`btn ${variantClass} ${className}`}
      style={combinedStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
};
