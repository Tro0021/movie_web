import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset input fields and alert states whenever modal opens or user session changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  }, [isOpen, user]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Tab switch handler: clear credentials and alert banners
  const handleTabSwitch = (signUpState) => {
    setIsSignUp(signUpState);
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data?.user && !data?.session) {
          setSuccessMessage('Account created! Please check your email to confirm your sign up.');
        } else {
          setSuccessMessage('Successfully signed up and logged in!');
          setTimeout(() => {
            setEmail('');
            setPassword('');
            onClose();
            if (onAuthSuccess) onAuthSuccess(data.user);
          }, 1200);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        setSuccessMessage('Welcome back! You are now logged in.');
        setTimeout(() => {
          setEmail('');
          setPassword('');
          onClose();
          if (onAuthSuccess) onAuthSuccess(data.user);
        }, 800);
      }
    } catch (err) {
      console.error('[AuthModal] Error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setEmail('');
      setPassword('');
      setErrorMessage('');
      setSuccessMessage('Signed out successfully.');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#121210] border border-[#262522] rounded-[4px] p-6 sm:p-7 shadow-2xl space-y-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262522] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#181816] border border-[#262522] text-[#F4F0EA] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-[#F4F0EA] tracking-wide">
                {user ? 'Kinova Terminal Account' : isSignUp ? 'Create Kinova Vault' : 'Sign In to Kinova'}
              </h3>
              <p className="text-xs text-[#8C877E]">
                {user ? user.email : 'Personalized watchlist & trade ledger sync across devices'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] bg-[#181816] hover:bg-[#262522] border border-[#262522] text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If user is already logged in */}
        {user ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-[2px] bg-[#181816] border border-[#262522] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>ACTIVE SESSION AUDITED</span>
              </div>
              <p className="text-sm font-medium text-[#F4F0EA] break-all">{user.email}</p>
              <p className="text-[11px] font-mono text-[#8C877E]">UID: <span className="text-[#D9C39A]">{user.id}</span></p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full py-2.5 rounded-[2px] bg-[#181816] hover:bg-[#201F1D] text-[#E03C31] hover:text-[#F4F0EA] border border-[#262522] text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 rotate-180" />}
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <>
            {/* Tab switchers */}
            <div className="flex rounded-[2px] bg-[#0A0A09] p-1 border border-[#262522]">
              <button
                type="button"
                onClick={() => handleTabSwitch(false)}
                className={`flex-1 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isSignUp ? 'bg-[#181816] text-[#F4F0EA] border border-[#262522]' : 'text-[#8C877E] hover:text-[#F4F0EA]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch(true)}
                className={`flex-1 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSignUp ? 'bg-[#181816] text-[#F4F0EA] border border-[#262522]' : 'text-[#8C877E] hover:text-[#F4F0EA]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="p-3 rounded-[2px] bg-[#181816] border border-[#E03C31]/40 text-[#E03C31] text-xs flex items-center gap-2 animate-fade-in font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-[2px] bg-[#181816] border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in font-mono">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8C877E] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8C877E]" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="cinephile@criterion.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-[2px] bg-[#181816] border border-[#262522] text-xs text-[#F4F0EA] placeholder-[#8C877E] focus:outline-none focus:border-[#E03C31] transition-colors font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8C877E] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#8C877E]" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-[2px] bg-[#181816] border border-[#262522] text-xs text-[#F4F0EA] placeholder-[#8C877E] focus:outline-none focus:border-[#E03C31] transition-colors font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-[2px] bg-[#E03C31] hover:bg-[#C83228] text-white font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isSignUp ? 'Initialize Account' : 'Authenticate Session'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center font-mono text-[11px] text-[#8C877E]">
              {isSignUp ? (
                <span>Already have a pass? <button type="button" onClick={() => handleTabSwitch(false)} className="text-[#D9C39A] hover:underline cursor-pointer">Sign in</button></span>
              ) : (
                <span>Need credentials? <button type="button" onClick={() => handleTabSwitch(true)} className="text-[#D9C39A] hover:underline cursor-pointer">Register archive pass</button></span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
