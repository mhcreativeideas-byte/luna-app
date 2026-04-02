import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCycle } from '../contexts/CycleContext';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, onboardingComplete } = useCycle();

  const [mode, setMode] = useState(searchParams.get('mode') === 'login' ? 'login' : 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetMode, setResetMode] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (onboardingComplete) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, onboardingComplete, navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (data?.user?.identities?.length === 0) {
          setError('Un compte existe déjà avec cet email. Connecte-toi.');
          setMode('login');
        } else {
          setSuccessMessage('Vérifie tes emails pour confirmer ton compte, puis connecte-toi.');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        // Redirect handled by onAuthStateChange in CycleContext
      }
    } catch (err) {
      const msg = err.message || 'Une erreur est survenue';
      if (msg.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect.');
      } else if (msg.includes('Password should be')) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
      } else if (msg.includes('already registered')) {
        setError('Ce compte existe déjà. Connecte-toi.');
        setMode('login');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!email.trim()) {
      setError('Entre ton email pour recevoir le lien.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=login`,
      });
      if (resetError) throw resetError;
      setSuccessMessage('Un email de réinitialisation t\'a été envoyé. Vérifie ta boîte mail.');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError('');
    setLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
      setLoading(false);
    }
  };

  const canSubmit = email.trim().length > 3 && password.length >= 6;

  return (
    <div className="min-h-screen bg-luna-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to landing */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-luna-text-muted hover:text-luna-text transition-colors font-body mb-6"
        >
          <ChevronLeft size={16} />
          Retour
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <img src="/logo-luna.png" alt="LUNA" className="w-28 mx-auto mb-4" />
              <h1 className="font-display text-2xl text-luna-text">
                {resetMode ? 'Mot de passe oublié ?' : mode === 'signup' ? 'Crée ton espace LUNA' : 'Bon retour'}
              </h1>
              <p className="text-luna-text-muted font-body text-sm mt-1">
                {resetMode
                  ? 'Entre ton email, on t\'envoie un lien pour le réinitialiser.'
                  : mode === 'signup'
                    ? 'En quelques secondes, ton cycle n\'aura plus de secrets.'
                    : 'Ton cycle t\'attendait.'}
              </p>
            </div>

            {/* Card */}
            <div
              className="bg-white rounded-[24px] p-8"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              {/* OAuth buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-[16px] border-2 border-gray-100 bg-white text-luna-text font-body font-semibold text-sm hover:border-luna-rose/30 transition-all disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuer avec Google
                </button>

              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-luna-text-hint font-body">ou par email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Email/Password form */}
              {resetMode ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-luna-text-hint" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="ton.email@exemple.com"
                      className="w-full pl-11 pr-5 py-3.5 rounded-[16px] bg-luna-cream border border-transparent text-luna-text font-body text-sm focus:outline-none focus:ring-2 focus:ring-luna-rose/30 transition-all"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-body text-red-500 text-center px-2">
                      {error}
                    </motion.p>
                  )}
                  {successMessage && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-body text-green-600 text-center px-2 py-3 rounded-[12px] bg-green-50">
                      {successMessage}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={!email.trim() || loading}
                    className="btn-luna w-full justify-center text-base py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>Envoyer le lien<ArrowRight size={16} /></>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setResetMode(false); setError(''); setSuccessMessage(''); }}
                    className="w-full text-center text-sm font-body text-luna-text-muted hover:text-luna-text transition-colors"
                  >
                    Retour à la connexion
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-luna-text-hint" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="ton.email@exemple.com"
                      className="w-full pl-11 pr-5 py-3.5 rounded-[16px] bg-luna-cream border border-transparent text-luna-text font-body text-sm focus:outline-none focus:ring-2 focus:ring-luna-rose/30 transition-all"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-luna-text-hint" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Mot de passe (6 caractères min.)"
                      className="w-full pl-11 pr-12 py-3.5 rounded-[16px] bg-luna-cream border border-transparent text-luna-text font-body text-sm focus:outline-none focus:ring-2 focus:ring-luna-rose/30 transition-all"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-luna-text-hint hover:text-luna-text transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Mot de passe oublié - only in login mode */}
                  {mode === 'login' && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => { setResetMode(true); setError(''); setSuccessMessage(''); }}
                        className="text-xs font-body text-luna-rose hover:underline"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  )}

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-body text-red-500 text-center px-2">
                      {error}
                    </motion.p>
                  )}
                  {successMessage && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-body text-green-600 text-center px-2 py-3 rounded-[12px] bg-green-50">
                      {successMessage}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="btn-luna w-full justify-center text-base py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        {mode === 'signup' ? 'Créer mon compte' : 'Me connecter'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Toggle mode */}
            <p className="text-center text-sm font-body text-luna-text-muted mt-6">
              {mode === 'signup' ? (
                <>
                  Déjà un compte ?{' '}
                  <button
                    onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                    className="text-luna-rose font-semibold hover:underline"
                  >
                    Connecte-toi
                  </button>
                </>
              ) : (
                <>
                  Pas encore de compte ?{' '}
                  <button
                    onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
                    className="text-luna-rose font-semibold hover:underline"
                  >
                    Créer mon espace
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
