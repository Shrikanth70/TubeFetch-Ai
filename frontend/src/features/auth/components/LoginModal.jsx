import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function LoginModal({ isOpen, onClose }) {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back!');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Sign in to TubeFetch AI"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="glass-card rounded-2xl p-xl max-w-[384px] w-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-xl">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary text-[28px]">smart_display</span>
                  <span className="font-headline-lg text-headline-lg font-extrabold text-primary">
                    TubeFetch AI
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                >
                  close
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-surface-container rounded-lg p-xs mb-xl">
                {['login', 'signup'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={[
                      'flex-1 py-2 rounded-md font-label-md text-label-md capitalize transition-all',
                      tab === t
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-on-surface-variant hover:bg-white/50',
                    ].join(' ')}
                  >
                    {t === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Google OAuth */}
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleGoogleSignIn}
                isLoading={isLoading}
                leftIcon={
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                }
                className="mb-md"
              >
                Continue with Google
              </Button>

              <div className="flex items-center gap-md mb-md">
                <div className="flex-1 h-px bg-outline-variant/30" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">or</span>
                <div className="flex-1 h-px bg-outline-variant/30" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-md">
                <div>
                  <label htmlFor="modal-email" className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
                    Email
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-md bg-surface-container-low border-2 border-transparent focus:border-tertiary-container rounded-lg font-body-md text-body-md text-on-surface outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="modal-password" className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
                    Password
                  </label>
                  <input
                    id="modal-password"
                    type="password"
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-md bg-surface-container-low border-2 border-transparent focus:border-tertiary-container rounded-lg font-body-md text-body-md text-on-surface outline-none transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
