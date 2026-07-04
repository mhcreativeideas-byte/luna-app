import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Page ouverte par le lien « Mot de passe oublié » reçu par email.
// Le lien Supabase crée une session de récupération, puis on enregistre
// le nouveau mot de passe avec updateUser. Cette page est accessible sur le
// web (hors mur vitrine) car le lien s'ouvre dans le navigateur.
export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  // null = vérification en cours, true = session de récupération présente,
  // false = lien invalide ou expiré.
  const [hasSession, setHasSession] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Laisse le temps à supabase-js de consommer le token contenu dans l'URL.
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!cancelled) setHasSession(Boolean(session));
      });
    }, 800);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setHasSession(true);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne sont pas identiques.');
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setDone(true);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('should be different')) {
        setError('Ce mot de passe est identique à l\'ancien. Choisis-en un nouveau.');
      } else {
        setError(msg || 'Une erreur est survenue. Réessaie.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-luna-bg px-6 flex flex-col">
      <div
        className="w-full max-w-md mx-auto my-auto"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 2rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
        }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo-luna.svg" alt="LUNA" className="h-[22px] w-auto mx-auto mb-4" />
            <h1 className="font-display text-2xl text-luna-text">
              {done ? 'C\'est fait !' : 'Nouveau mot de passe'}
            </h1>
            {!done && hasSession && (
              <p className="text-luna-text-muted font-body text-sm mt-1 px-4">
                Choisis ton nouveau mot de passe, et c'est reparti.
              </p>
            )}
          </div>

          <div className="bg-white rounded-[24px] p-8" style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}>
            {done ? (
              <div className="text-center space-y-4">
                <CheckCircle size={40} className="text-green-500 mx-auto" />
                <p className="font-body text-sm text-luna-text-body">
                  Ton mot de passe a bien été changé. Retourne dans l'app LUNA
                  et connecte-toi avec ton nouveau mot de passe.
                </p>
              </div>
            ) : hasSession === null ? (
              <p className="font-body text-sm text-luna-text-muted text-center py-4">
                Vérification du lien…
              </p>
            ) : hasSession === false ? (
              <p className="font-body text-sm text-luna-text-body text-center py-2">
                Ce lien n'est plus valide (il a peut-être expiré).
                Retourne dans l'app LUNA et refais « Mot de passe oublié »
                pour recevoir un nouveau lien.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-luna-text-hint" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Nouveau mot de passe (6 caractères min.)"
                    className="w-full pl-11 pr-12 py-3.5 rounded-[16px] bg-luna-cream border border-transparent text-luna-text font-body text-sm focus:outline-none focus:ring-2 focus:ring-luna-rose/30 transition-all"
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-luna-text-hint"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-luna-text-hint" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                    placeholder="Confirme le mot de passe"
                    className="w-full pl-11 pr-5 py-3.5 rounded-[16px] bg-luna-cream border border-transparent text-luna-text font-body text-sm focus:outline-none focus:ring-2 focus:ring-luna-rose/30 transition-all"
                    autoComplete="new-password"
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-body text-red-500 text-center px-2">
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={password.length < 6 || loading}
                  className="btn-luna w-full justify-center text-base py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>Enregistrer<ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
