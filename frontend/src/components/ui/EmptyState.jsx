import React from 'react';
import { Button } from './Button';

/**
 * Reusable empty state component — used in History, Downloads, etc.
 */
export function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 animate-fade-in">
      <div className="w-24 h-24 bg-surface-container-highest dark:bg-dark-surface-container rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
      </div>
      <div className="space-y-1 max-w-[384px]">
        <p className="font-headline-lg text-headline-lg text-on-surface">{title}</p>
        <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="lg" onClick={onAction} className="mt-sm rounded-full px-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
