import React from 'react';

/**
 * Glassmorphism card container — the primary surface style
 * used throughout the Stitch design.
 */
export function GlassCard({
  children,
  className = '',
  hover = false,
  as: Tag = 'div',
  onClick,
}) {
  return (
    <Tag
      onClick={onClick}
      className={[
        'glass-card rounded-2xl',
        hover
          ? 'hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
}
