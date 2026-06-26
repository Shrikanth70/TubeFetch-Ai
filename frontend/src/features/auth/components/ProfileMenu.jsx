import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export function ProfileMenu({ isOpen, onClose }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const handleSignOut = async () => {
    onClose();
    await signOut();
    toast.success('Signed out successfully.');
    navigate('/');
  };

  const initial = user?.fullName?.[0] ?? user?.email?.[0] ?? '?';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full right-0 mt-2 w-56 glass-card rounded-xl shadow-xl overflow-hidden border border-outline-variant/20 z-50"
          role="menu"
          aria-label="Profile menu"
        >
          {/* User Info */}
          <div className="p-md border-b border-outline-variant/10">
            <div className="flex items-center gap-sm">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm uppercase">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  {user?.fullName ?? 'User'}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-xs">
            {[
              { icon: 'person', label: 'Profile', path: '/profile' },
              { icon: 'history', label: 'History', path: '/history' },
              { icon: 'settings', label: 'Settings', path: '/settings' },
            ].map(({ icon, label, path }) => (
              <button
                key={path}
                onClick={() => { navigate(path); onClose(); }}
                role="menuitem"
                className="w-full flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="border-t border-outline-variant/10 p-xs">
            <button
              onClick={handleSignOut}
              role="menuitem"
              className="w-full flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md text-error hover:bg-error-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
