import React from 'react';
import { motion } from 'framer-motion';
import { uiConstants } from '../../constants/uiConstants';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-2';

  const variantClasses = {
    primary: uiConstants.COLORS.BUTTONS.PRIMARY,
    secondary: uiConstants.COLORS.BUTTONS.SECONDARY,
    success: uiConstants.COLORS.BUTTONS.SUCCESS,
    warning: uiConstants.COLORS.BUTTONS.WARNING,
    danger: uiConstants.COLORS.BUTTONS.DANGER,
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </motion.button>
  );
};
