import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel,
  variant = 'danger',
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onCancel}
            aria-hidden="true"
          />
          {/* Dialog */}
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-desc"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="glass-card rounded-2xl p-xl max-w-[448px] w-full shadow-2xl">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-lg ${
                  variant === 'danger'
                    ? 'bg-error-container text-error'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {variant === 'danger' ? 'delete' : 'check_circle'}
                </span>
              </div>
              <h2 id="dialog-title" className="font-headline-lg text-headline-lg text-on-surface mb-sm">
                {title}
              </h2>
              <p id="dialog-desc" className="font-body-md text-body-md text-on-surface-variant mb-xl">
                {description}
              </p>
              <div className="flex gap-md justify-end">
                <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
                  {cancelLabel}
                </Button>
                <Button
                  variant={variant === 'danger' ? 'danger' : 'primary'}
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
