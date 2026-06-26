import { motion } from 'framer-motion';

const variantClasses = {
  primary:
    'bg-primary text-on-primary hover:opacity-90 cta-glow shadow-md btn-primary',
  secondary:
    'bg-surface-container-highest text-on-surface hover:bg-surface-dim transition-colors',
  ghost:
    'bg-transparent text-on-surface-variant hover:bg-surface-container transition-colors',
  danger:
    'bg-transparent border-2 border-outline-variant/30 text-error hover:bg-error-container hover:border-error transition-all',
  outline:
    'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container transition-colors',
};

const sizeClasses = {
  sm: 'h-8 px-md text-label-sm rounded-lg',
  md: 'h-11 px-lg text-label-md rounded-lg',
  lg: 'h-14 px-xl text-label-md rounded-xl font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.96 }}
      whileHover={{ scale: isDisabled ? 1 : 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium select-none',
        'transition-opacity focus-visible:outline-2 focus-visible:outline-tertiary',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...rest}
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin-slow text-[18px]">
          autorenew
        </span>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  );
}
