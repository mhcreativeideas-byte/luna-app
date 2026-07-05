import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Activity, Target, Shield,
  LogOut, RefreshCw, Search,
  ChevronDown, ChevronUp, Calendar, Dumbbell,
  Utensils, Moon, Brain, BookOpen, Flame,
  ArrowLeft, Trash2, X, AlertTriangle, CreditCard,
  Download, Mail, Inbox, BarChart3,
  Megaphone, Cookie, KeyRound
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from '../lib/toast';
import ContentCalendar from '../components/admin/ContentCalendar';
import InstagramStats from '../components/admin/InstagramStats';

const ADMIN_EMAILS = ['mhcreative.ideas@gmail.com'];

const phaseLabels = {
  menstrual: { name: 'Menstruelle', icon: '🌙', color: '#B4A7D6', bg: '#EEEDFE' },
  follicular: { name: 'Folliculaire', icon: '🌸', color: '#E8A0BF', bg: '#FFF0F5' },
  ovulatory: { name: 'Ovulatoire', icon: '☀️', color: '#F4C2A1', bg: '#FFF5EB' },
  luteal: { name: 'Lutéale', icon: '🍂', color: '#A8D5BA', bg: '#EEFAF2' },
  unknown: { name: 'Inconnu', icon: '❓', color: '#999', bg: '#f5f5f5' },
};

const fitnessLabels = {
  beginner: 'Débutante 🌱',
  intermediate: 'Intermédiaire 🌿',
  advanced: 'Confirmée 🌳',
};

const goalLabels = {
  sport: { label: 'Sport', icon: <Dumbbell size={14} /> },
  food: { label: 'Alimentation', icon: <Utensils size={14} /> },
  sleep: { label: 'Sommeil', icon: <Moon size={14} /> },
  emotions: { label: 'Émotions', icon: <Brain size={14} /> },
  learn: { label: 'Apprendre', icon: <BookOpen size={14} /> },
  strength: { label: 'Force', icon: <Flame size={14} /> },
};

// Ordre fixe des tranches d'âge (pour un affichage cohérent)
const ageOrder = ['18-24', '25-34', '35-44', '45+', 'unknown'];
const ageLabels = {
  '18-24': '18-24 ans 🌱',
  '25-34': '25-34 ans 🌿',
  '35-44': '35-44 ans 🌺',
  '45+': '45 ans et + ✨',
  unknown: 'Non renseigné',
};

// Comment elles nous ont connue (canal d'acquisition)
const discoveryLabels = {
  instagram: 'Instagram 📸',
  tiktok: 'TikTok 🎵',
  bouche: 'Bouche-à-oreille 🗣️',
  recherche: 'Recherche web 🔍',
  pub: 'Publicité 📣',
  autre: 'Autre ✨',
  unknown: 'Non renseigné',
};

const cravingLabels = {
  sucre: 'Sucre',
  faim: 'Grande faim',
  ballonnements: 'Ballonnements',
  appetit: "Perte d'appétit",
  grignotage: 'Grignotage',
  rien: 'Rien de spécial',
};

const barrierLabels = {
  temps: 'Manque de temps',
  idees: "Manque d'idées",
  quoi: 'Ne sait pas quoi manger',
  gaspillage: 'Gaspillage',
  budget: 'Budget',
};

function KPICard({ icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '20', color }}
        >
          {icon}
        </div>
        <span className="text-sm text-gray-500 font-body">{label}</span>
      </div>
      <p className="text-3xl font-bold font-accent text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1 font-body">{sub}</p>}
    </motion.div>
  );
}

// En-tête de carte cohérent (icône colorée + titre + sous-titre).
function CardHeader({ icon, color, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '20', color }}>
        {icon}
      </div>
      <div>
        <h3 className="font-display text-lg text-gray-800 leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 font-body">{subtitle}</p>}
      </div>
    </div>
  );
}

// État vide doux et cohérent (au lieu d'un « Aucune donnée » sec).
function EmptyState({ icon, text, hint }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="text-gray-200 mb-2">{icon}</div>
      <p className="text-sm text-gray-400 font-body">{text}</p>
      {hint && <p className="text-xs text-gray-300 font-body mt-1">{hint}</p>}
    </div>
  );
}

function PhaseBar({ data, total }) {
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([phase, count]) => {
        const info = phaseLabels[phase] || phaseLabels.unknown;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={phase} className="flex items-center gap-3">
            <span className="text-lg w-6 text-center">{info.icon}</span>
            <span className="text-sm text-gray-600 font-body w-28">{info.name}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: info.color }}
              />
            </div>
            <span className="text-sm font-accent font-bold text-gray-700 w-16 text-right">
              {count} ({pct}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState('loading');
  const [currentEmail, setCurrentEmail] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedUser, setExpandedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // user object or 'bulk'
  const [deleting, setDeleting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  // Onglets : 'users' (app) | 'waitlist' (liste d'attente vitrine web)
  const [activeTab, setActiveTab] = useState('users');
  const [waitlist, setWaitlist] = useState([]);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistDeleteConfirm, setWaitlistDeleteConfirm] = useState(null); // entry object | 'bulk' | 'all'
  const [waitlistSearch, setWaitlistSearch] = useState('');
  const [selectedWaitlist, setSelectedWaitlist] = useState(new Set());

  const toggleSelectUser = (userId, e) => {
    e.stopPropagation();
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleDeleteUser = async (user) => {
    setDeleting(true);
    try {
      // Supprime le profil ET le compte auth via la fonction SQL
      const { error } = await supabase.rpc('delete_user_completely', {
        user_auth_id: user.auth_id,
      });
      if (error) throw error;

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setDeleteConfirm(null);
      setExpandedUser(null);
      toast('Compte supprimé ✓');
    } catch (err) {
      console.error('Erreur suppression:', err);
      toast('Erreur lors de la suppression : ' + err.message, 'error');
    }
    setDeleting(false);
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      const usersToDelete = users.filter((u) => selectedUsers.has(u.id));
      // Supprime chaque compte complètement (profil + auth)
      for (const user of usersToDelete) {
        const { error } = await supabase.rpc('delete_user_completely', {
          user_auth_id: user.auth_id,
        });
        if (error) throw error;
      }

      const count = usersToDelete.length;
      setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.id)));
      setSelectedUsers(new Set());
      setDeleteConfirm(null);
      toast(`${count} compte${count > 1 ? 's' : ''} supprimé${count > 1 ? 's' : ''} ✓`);
    } catch (err) {
      console.error('Erreur suppression groupée:', err);
      toast('Erreur lors de la suppression : ' + err.message, 'error');
    }
    setDeleting(false);
  };

  useEffect(() => {
    let resolved = false;
    // Filet de sécurité : si la vérification n'a pas répondu en 5 s (réseau lent,
    // cache bizarre…), on affiche le formulaire au lieu de tourner à l'infini.
    const timer = setTimeout(() => {
      if (!resolved) setAuthState('unauthenticated');
    }, 5000);

    // getSession() lit la session en local (instantané, ne peut pas se bloquer),
    // contrairement à getUser() qui fait un appel réseau. + filet de secours en cas d'erreur.
    supabase.auth.getSession()
      .then(({ data }) => {
        resolved = true;
        clearTimeout(timer);
        const email = data?.session?.user?.email;
        setCurrentEmail(email || null);
        if (email && ADMIN_EMAILS.includes(email)) {
          setAuthState('admin');
          fetchUsers();
          fetchWaitlist();
        } else if (email) {
          setAuthState('denied');
        } else {
          setAuthState('unauthenticated');
        }
      })
      .catch(() => {
        resolved = true;
        clearTimeout(timer);
        setAuthState('unauthenticated');
      });

    return () => clearTimeout(timer);
  }, []);

  // Connexion ADMIN (formulaire dédié, reste sur /admin — ne passe pas par l'app)
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    setLoginLoading(false);
    if (error) {
      setLoginError('Email ou mot de passe incorrect.');
      return;
    }
    const email = data?.user?.email;
    setCurrentEmail(email || null);
    if (email && ADMIN_EMAILS.includes(email)) {
      setAuthState('admin');
      fetchUsers();
      fetchWaitlist();
    } else {
      // compte valide mais pas admin → on déconnecte pour ne pas rester loggué dans l'app
      await supabase.auth.signOut();
      setLoginError('Ce compte n\'a pas les droits administrateur.');
    }
  };

  const handleAdminGoogle = async () => {
    setLoginError('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    });
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data);
    if (error) console.error('Fetch error:', error);
    setLoading(false);
  };

  // ---- Liste d'attente (inscrits à la vitrine web) ----
  const fetchWaitlist = async () => {
    setWaitlistLoading(true);
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setWaitlist(data);
    if (error) console.error('Fetch waitlist error:', error);
    setWaitlistLoading(false);
  };

  // Exporte la liste d'attente en CSV (importable dans Brevo, Mailchimp…)
  const exportWaitlistCsv = () => {
    if (waitlist.length === 0) return;
    const rows = [
      ['prenom', 'email', 'source', 'date_inscription'],
      ...waitlist.map((w) => [
        w.prenom || '',
        w.email || '',
        w.source || '',
        w.created_at ? new Date(w.created_at).toLocaleDateString('fr-FR') : '',
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `liste-attente-luna-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDeleteWaitlist = async (entry) => {
    setDeleting(true);
    try {
      const { error } = await supabase.from('waitlist').delete().eq('id', entry.id);
      if (error) throw error;
      setWaitlist((prev) => prev.filter((w) => w.id !== entry.id));
      setWaitlistDeleteConfirm(null);
      toast('Inscription supprimée ✓');
    } catch (err) {
      console.error('Erreur suppression waitlist:', err);
      toast('Erreur lors de la suppression : ' + err.message, 'error');
    }
    setDeleting(false);
  };

  // Recherche sur la liste d'attente (prénom, email, source)
  const filteredWaitlist = waitlist.filter((w) => {
    const q = waitlistSearch.toLowerCase();
    return (
      w.prenom?.toLowerCase().includes(q) ||
      w.email?.toLowerCase().includes(q) ||
      w.source?.toLowerCase().includes(q)
    );
  });

  const toggleSelectWaitlist = (id, e) => {
    e.stopPropagation();
    setSelectedWaitlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllWaitlist = () => {
    if (filteredWaitlist.length > 0 && selectedWaitlist.size === filteredWaitlist.length) {
      setSelectedWaitlist(new Set());
    } else {
      setSelectedWaitlist(new Set(filteredWaitlist.map((w) => w.id)));
    }
  };

  // Suppression groupée : la sélection ('bulk') ou toute la liste ('all')
  const handleBulkDeleteWaitlist = async (mode) => {
    const ids = mode === 'all' ? waitlist.map((w) => w.id) : [...selectedWaitlist];
    if (ids.length === 0) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('waitlist').delete().in('id', ids);
      if (error) throw error;
      const idSet = new Set(ids);
      setWaitlist((prev) => prev.filter((w) => !idSet.has(w.id)));
      setSelectedWaitlist(new Set());
      setWaitlistDeleteConfirm(null);
      toast(`${ids.length} inscription${ids.length > 1 ? 's' : ''} supprimée${ids.length > 1 ? 's' : ''} ✓`);
    } catch (err) {
      console.error('Erreur suppression groupée waitlist:', err);
      toast('Erreur lors de la suppression : ' + err.message, 'error');
    }
    setDeleting(false);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Filtered & sorted users
  const filteredUsers = users
    .filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  // ---- KPIs ----
  const totalUsers = users.length;

  // Inscriptions aujourd'hui
  const _now = new Date();
  const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;
  const todayUsers = users.filter((u) => u.created_at?.startsWith(today)).length;

  // Inscriptions cette semaine
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekUsers = users.filter((u) => new Date(u.created_at) >= oneWeekAgo).length;

  // Répartition par phase
  const phaseDistribution = users.reduce((acc, u) => {
    const p = u.current_phase || 'unknown';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  // Répartition par niveau sportif
  const fitnessDistribution = users.reduce((acc, u) => {
    const f = u.fitness_level || 'unknown';
    acc[f] = (acc[f] || 0) + 1;
    return acc;
  }, {});

  // Objectifs les plus populaires
  const goalCounts = {};
  users.forEach((u) => {
    (u.goals || []).forEach((g) => {
      goalCounts[g] = (goalCounts[g] || 0) + 1;
    });
  });
  const sortedGoals = Object.entries(goalCounts).sort((a, b) => b[1] - a[1]);

  // Durée moyenne cycle
  const avgCycle = totalUsers > 0
    ? Math.round(users.reduce((s, u) => s + (u.cycle_length || 28), 0) / totalUsers * 10) / 10
    : 0;

  // Durée moyenne règles
  const avgPeriod = totalUsers > 0
    ? Math.round(users.reduce((s, u) => s + (u.period_length || 5), 0) / totalUsers * 10) / 10
    : 0;

  // Ancienneté moyenne (en jours)
  const avgTenureDays = totalUsers > 0
    ? Math.round(users.reduce((s, u) => {
        const created = new Date(u.created_at);
        const diffMs = _now - created;
        return s + diffMs / (1000 * 60 * 60 * 24);
      }, 0) / totalUsers)
    : 0;
  const avgTenureLabel = avgTenureDays < 30
    ? `${avgTenureDays}j`
    : `${Math.round(avgTenureDays / 30 * 10) / 10} mois`;

  // Ancienneté par utilisatrice (en mois) — pour l'affichage dans le tableau
  const getUserMonths = (user) => {
    const created = new Date(user.created_at);
    const diffMs = _now - created;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days}j`;
    const months = Math.round(days / 30 * 10) / 10;
    return `${months} mois`;
  };

  // Taux de rétention (utilisatrices actives > 7 jours)
  const retainedUsers = users.filter((u) => {
    const created = new Date(u.created_at);
    return (_now - created) / (1000 * 60 * 60 * 24) > 7;
  }).length;
  const retentionRate = totalUsers > 0 ? Math.round((retainedUsers / totalUsers) * 100) : 0;

  // ---- Abonnements & revenus ----
  // Se remplit automatiquement quand un système de paiement (ex : Stripe) sera connecté
  // et alimentera les champs subscription_* sur chaque utilisatrice.
  const paidUsers = users.filter((u) => u.subscription_status === 'active' || u.subscription_status === 'paid');
  const paidCount = paidUsers.length;
  const freeCount = totalUsers - paidCount;
  const conversionRate = totalUsers > 0 ? Math.round((paidCount / totalUsers) * 100) : 0;
  const monthlyCount = paidUsers.filter((u) => u.subscription_plan === 'monthly').length;
  const annualCount = paidUsers.filter((u) => u.subscription_plan === 'annual').length;
  // Revenu récurrent mensuel (MRR) : mensuels + annuels ramenés au mois
  const mrr = paidUsers.reduce((s, u) => {
    const price = u.subscription_price || 0;
    return s + (u.subscription_plan === 'annual' ? price / 12 : price);
  }, 0);
  // Encaissé ce mois-ci (selon la date du dernier paiement)
  const collectedThisMonth = paidUsers.reduce((s, u) => {
    return u.subscription_last_payment?.startsWith(today.slice(0, 7)) ? s + (u.subscription_price || 0) : s;
  }, 0);
  const euros = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;
  const paymentsConnected = paidCount > 0; // deviendra true quand des abonnements existeront

  // Problématiques de santé
  const healthCounts = {};
  users.forEach((u) => {
    (u.health_issues || []).forEach((h) => {
      healthCounts[h] = (healthCounts[h] || 0) + 1;
    });
  });
  const sortedHealth = Object.entries(healthCounts).sort((a, b) => b[1] - a[1]);

  // Régimes alimentaires
  const dietCounts = {};
  users.forEach((u) => {
    (u.diet_preferences || []).forEach((d) => {
      dietCounts[d] = (dietCounts[d] || 0) + 1;
    });
  });
  const sortedDiets = Object.entries(dietCounts).sort((a, b) => b[1] - a[1]);

  // Répartition par tranche d'âge (persona)
  const ageDistribution = users.reduce((acc, u) => {
    const a = u.age || 'unknown';
    acc[a] = (acc[a] || 0) + 1;
    return acc;
  }, {});

  // Canal d'acquisition : comment elles nous ont connue (persona / marketing)
  const discoveryCounts = {};
  users.forEach((u) => {
    const s = u.discovery_source || 'unknown';
    discoveryCounts[s] = (discoveryCounts[s] || 0) + 1;
  });
  const sortedDiscovery = Object.entries(discoveryCounts).sort((a, b) => b[1] - a[1]);

  // Fringales les plus fréquentes
  const cravingCounts = {};
  users.forEach((u) => {
    (u.cravings || []).forEach((c) => {
      cravingCounts[c] = (cravingCounts[c] || 0) + 1;
    });
  });
  const sortedCravings = Object.entries(cravingCounts).sort((a, b) => b[1] - a[1]);

  // Freins en cuisine
  const barrierCounts = {};
  users.forEach((u) => {
    (u.barriers || []).forEach((b) => {
      barrierCounts[b] = (barrierCounts[b] || 0) + 1;
    });
  });
  const sortedBarriers = Object.entries(barrierCounts).sort((a, b) => b[1] - a[1]);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <RefreshCw className="animate-spin text-luna-rose" size={32} />
      </div>
    );
  }

  if (authState !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-red-400" size={32} />
            </div>
            <h1 className="font-display text-2xl text-gray-800 mb-1">Espace administrateur</h1>
            <p className="text-sm text-gray-500 font-body">Accès réservé aux analyses de luna</p>
          </div>

          {authState === 'denied' ? (
            <div className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: '0 2px 16px rgba(45,34,38,0.06)' }}>
              <p className="text-sm text-gray-600 font-body mb-1">Ce compte n'a pas les droits administrateur.</p>
              {currentEmail && (
                <p className="text-xs text-gray-400 font-body mb-4">
                  Connectée en tant que <span className="font-semibold text-gray-600">{currentEmail}</span>
                </p>
              )}
              <button
                onClick={async () => { await supabase.auth.signOut(); setCurrentEmail(null); setLoginError(''); setAuthState('unauthenticated'); }}
                className="w-full py-3 bg-luna-rose text-white rounded-xl font-body font-bold hover:bg-luna-rose-dark transition-all"
              >
                Se déconnecter et entrer en admin
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(45,34,38,0.06)' }}>
              <button
                onClick={handleAdminGoogle}
                className="w-full py-3 border border-gray-200 rounded-xl font-body font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Continuer avec Google
              </button>
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-body">ou par email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email administrateur"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:border-luna-rose"
                  required
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:border-luna-rose"
                  required
                />
                {loginError && <p className="text-xs text-red-500 font-body">{loginError}</p>}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 bg-luna-rose text-white rounded-xl font-body font-bold hover:bg-luna-rose-dark transition-all disabled:opacity-60"
                >
                  {loginLoading ? 'Connexion…' : 'Se connecter'}
                </button>
              </form>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mx-auto mt-5 text-sm text-gray-400 hover:text-gray-600 transition-colors font-body"
          >
            <ArrowLeft size={14} />
            Retour à l'app
          </button>
        </motion.div>
      </div>
    );
  }

  // ---- ADMIN DASHBOARD ----
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-luna-rose/10 rounded-xl flex items-center justify-center">
              <Shield className="text-luna-rose" size={20} />
            </div>
            <div>
              <h1 className="font-display text-xl text-gray-800">Admin luna</h1>
              <p className="text-xs text-gray-400 font-body">{totalUsers} utilisatrice{totalUsers > 1 ? 's' : ''} inscrite{totalUsers > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-body"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button
              onClick={() => setAuthState('unauthenticated')}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all font-body"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Onglets */}
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all ${activeTab === 'users' ? 'bg-luna-rose text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Users size={16} />
            Utilisatrices
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'users' ? 'bg-white/25' : 'bg-gray-100'}`}>{totalUsers}</span>
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all ${activeTab === 'waitlist' ? 'bg-luna-rose text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Inbox size={16} />
            Liste d'attente
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'waitlist' ? 'bg-white/25' : 'bg-gray-100'}`}>{waitlist.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all ${activeTab === 'calendar' ? 'bg-luna-rose text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Calendar size={16} />
            Calendrier
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all ${activeTab === 'stats' ? 'bg-luna-rose text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <BarChart3 size={16} />
            Statistiques
          </button>
        </div>

        {activeTab === 'stats' && <InstagramStats />}

        {activeTab === 'calendar' && <ContentCalendar />}

        {activeTab === 'users' && (<>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard
            icon={<Users size={20} />}
            label="Total utilisatrices"
            value={totalUsers}
            sub="Depuis le lancement"
            color="#E8A0BF"
          />
          <KPICard
            icon={<TrendingUp size={20} />}
            label="Aujourd'hui"
            value={`+${todayUsers}`}
            sub={`Le ${new Date().toLocaleDateString('fr-FR')}`}
            color="#A8D5BA"
          />
          <KPICard
            icon={<Activity size={20} />}
            label="Cette semaine"
            value={`+${weekUsers}`}
            sub="7 derniers jours"
            color="#F4C2A1"
          />
          <KPICard
            icon={<Target size={20} />}
            label="Cycle moyen"
            value={`${avgCycle}j`}
            sub={`Règles : ${avgPeriod}j en moyenne`}
            color="#B4A7D6"
          />
          <KPICard
            icon={<Calendar size={20} />}
            label="Ancienneté moyenne"
            value={avgTenureLabel}
            sub="Durée moyenne d'abonnement"
            color="#7BAFD4"
          />
          <KPICard
            icon={<Shield size={20} />}
            label="Rétention"
            value={`${retentionRate}%`}
            sub={`${retainedUsers} actives > 7 jours`}
            color="#D4A87B"
          />
        </div>

        {/* Abonnements & Revenus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-display text-lg text-gray-800">Abonnements & revenus</h3>
            {!paymentsConnected && (
              <span className="text-xs font-body text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                💳 S'activera une fois les paiements connectés
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon={<CreditCard size={20} />}
              label="Abonnées payantes"
              value={paidCount}
              sub={`${conversionRate}% des inscrites`}
              color="#A8D5BA"
            />
            <KPICard
              icon={<TrendingUp size={20} />}
              label="Revenu mensuel (MRR)"
              value={euros(mrr)}
              sub="Récurrent par mois"
              color="#E8A0BF"
            />
            <KPICard
              icon={<Activity size={20} />}
              label="Encaissé ce mois"
              value={euros(collectedThisMonth)}
              sub={new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              color="#F4C2A1"
            />
            <KPICard
              icon={<Users size={20} />}
              label="Gratuit / Payant"
              value={`${freeCount} / ${paidCount}`}
              sub={`${monthlyCount} mensuel · ${annualCount} annuel`}
              color="#B4A7D6"
            />
          </div>
        </motion.div>

        {/* Analytics Row */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Phase Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-display text-lg text-gray-800 mb-4">Répartition par phase</h3>
            <PhaseBar data={phaseDistribution} total={totalUsers} />
          </motion.div>

          {/* Objectifs populaires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-display text-lg text-gray-800 mb-4">Objectifs les plus choisis</h3>
            <div className="space-y-3">
              {sortedGoals.map(([goal, count]) => {
                const info = goalLabels[goal] || { label: goal, icon: null };
                const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                return (
                  <div key={goal} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-luna-rose/10 rounded-lg flex items-center justify-center text-luna-rose">
                      {info.icon}
                    </div>
                    <span className="text-sm text-gray-600 font-body w-24">{info.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-luna-rose/70"
                      />
                    </div>
                    <span className="text-sm font-accent font-bold text-gray-700 w-16 text-right">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
              {sortedGoals.length === 0 && (
                <p className="text-sm text-gray-400 font-body">Aucune donnée</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Second analytics row */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Niveau sportif */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-display text-lg text-gray-800 mb-4">Niveau sportif</h3>
            <div className="space-y-3">
              {Object.entries(fitnessDistribution).map(([level, count]) => {
                const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                return (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-sm font-body text-gray-600">
                      {fitnessLabels[level] || level}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-luna-mint"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-accent font-bold text-gray-700 w-12 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Régimes alimentaires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-display text-lg text-gray-800 mb-4">Alimentation</h3>
            <div className="flex flex-wrap gap-2">
              {sortedDiets.map(([diet, count]) => (
                <span
                  key={diet}
                  className="px-3 py-1.5 bg-luna-peach/15 text-luna-peach-dark rounded-full text-sm font-body font-semibold"
                >
                  {diet} <span className="font-accent">({count})</span>
                </span>
              ))}
              {sortedDiets.length === 0 && (
                <p className="text-sm text-gray-400 font-body">Aucune donnée</p>
              )}
            </div>
          </motion.div>

          {/* Problématiques santé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-display text-lg text-gray-800 mb-4">Problématiques santé</h3>
            <div className="flex flex-wrap gap-2">
              {sortedHealth.map(([issue, count]) => (
                <span
                  key={issue}
                  className="px-3 py-1.5 bg-luna-lavender/15 text-luna-lavender-dark rounded-full text-sm font-body font-semibold"
                >
                  {issue} <span className="font-accent">({count})</span>
                </span>
              ))}
              {sortedHealth.length === 0 && (
                <p className="text-sm text-gray-400 font-body">Aucune donnée</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Persona : âge + acquisition */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Répartition par âge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <CardHeader icon={<Users size={20} />} color="#C4727F" title="Répartition par âge" subtitle="Qui est ta cliente type ?" />
            <div className="space-y-3">
              {ageOrder
                .filter((a) => ageDistribution[a])
                .map((age) => {
                  const count = ageDistribution[age];
                  const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                  const isUnknown = age === 'unknown';
                  return (
                    <div key={age} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 font-body w-28">{ageLabels[age] || age}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${isUnknown ? 'bg-gray-300' : 'bg-luna-rose/70'}`}
                        />
                      </div>
                      <span className="text-sm font-accent font-bold text-gray-700 w-16 text-right">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              {Object.keys(ageDistribution).length === 0 && (
                <EmptyState icon={<Users size={32} />} text="Pas encore de données" hint="L'âge de tes utilisatrices s'affichera ici" />
              )}
            </div>
          </motion.div>

          {/* Canal d'acquisition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <CardHeader icon={<Megaphone size={20} />} color="#B09ACB" title="Comment elles nous ont connue" subtitle="Ton canal de recrutement n°1" />
            <div className="space-y-3">
              {sortedDiscovery.map(([source, count]) => {
                const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                const isUnknown = source === 'unknown';
                return (
                  <div key={source} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-body w-36">{discoveryLabels[source] || source}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${isUnknown ? 'bg-gray-300' : 'bg-luna-lavender/70'}`}
                      />
                    </div>
                    <span className="text-sm font-accent font-bold text-gray-700 w-16 text-right">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
              {sortedDiscovery.length === 0 && (
                <EmptyState icon={<Megaphone size={32} />} text="Pas encore de données" hint="Le canal d'acquisition s'affichera ici" />
              )}
            </div>
          </motion.div>
        </div>

        {/* Fringales + freins en cuisine */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Fringales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <CardHeader icon={<Cookie size={20} />} color="#E8A87C" title="Fringales & symptômes" subtitle="Pour ton discours produit" />
            <div className="flex flex-wrap gap-2">
              {sortedCravings.map(([craving, count]) => (
                <span
                  key={craving}
                  className="px-3 py-1.5 bg-luna-rose/10 text-luna-rose-deep rounded-full text-sm font-body font-semibold"
                >
                  {cravingLabels[craving] || craving} <span className="font-accent">({count})</span>
                </span>
              ))}
              {sortedCravings.length === 0 && (
                <EmptyState icon={<Cookie size={32} />} text="Pas encore de données" hint="Les fringales les plus citées s'afficheront ici" />
              )}
            </div>
          </motion.div>

          {/* Freins en cuisine */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <CardHeader icon={<KeyRound size={20} />} color="#7BAE7F" title="Freins en cuisine" subtitle="Les blocages à lever pour vendre" />
            <div className="flex flex-wrap gap-2">
              {sortedBarriers.map(([barrier, count]) => (
                <span
                  key={barrier}
                  className="px-3 py-1.5 bg-luna-sage/15 text-gray-700 rounded-full text-sm font-body font-semibold"
                >
                  {barrierLabels[barrier] || barrier} <span className="font-accent">({count})</span>
                </span>
              ))}
              {sortedBarriers.length === 0 && (
                <EmptyState icon={<KeyRound size={32} />} text="Pas encore de données" hint="Les blocages les plus cités s'afficheront ici" />
              )}
            </div>
          </motion.div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-lg text-gray-800">
                Liste des utilisatrices
              </h3>
              {selectedUsers.size > 0 && (
                <button
                  onClick={() => setDeleteConfirm('bulk')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-body font-semibold hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={12} />
                  Supprimer ({selectedUsers.size})
                </button>
              )}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-luna-rose/30"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="animate-spin mx-auto text-luna-rose mb-3" size={24} />
              <p className="text-sm text-gray-400 font-body">Chargement...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-400 font-body">
                {search ? 'Aucun résultat' : 'Aucune utilisatrice inscrite'}
              </p>
              <p className="text-xs text-gray-300 font-body mt-1">
                Les utilisatrices apparaîtront ici après l'onboarding
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-body">
                    <th className="w-10 px-3 py-3">
                      <input
                        type="checkbox"
                        checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-luna-rose focus:ring-luna-rose/30 cursor-pointer"
                      />
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">
                      <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-gray-700">
                        Prénom
                        {sortField === 'name' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Email</th>
                    <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">
                      <button onClick={() => toggleSort('cycle_length')} className="flex items-center gap-1 hover:text-gray-700">
                        Cycle
                        {sortField === 'cycle_length' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Niveau</th>
                    <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Objectifs</th>
                    <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Ancienneté</th>
                    <th className="text-left px-5 py-3 font-semibold">
                      <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-gray-700">
                        Inscription
                        {sortField === 'created_at' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const isExpanded = expandedUser === user.id;
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-t border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors ${selectedUsers.has(user.id) ? 'bg-red-50/50' : ''}`}
                        onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                      >
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedUsers.has(user.id)}
                            onChange={(e) => toggleSelectUser(user.id, e)}
                            className="w-4 h-4 rounded border-gray-300 text-luna-rose focus:ring-luna-rose/30 cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: '#C4727F' }}>
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 font-body">{user.name}</p>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  className="mt-2 space-y-1"
                                >
                                  <p className="text-xs text-gray-400">
                                    📧 {user.email || 'Pas d\'email'}
                                  </p>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(user); }}
                                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-body font-semibold hover:bg-red-100 transition-colors"
                                  >
                                    <Trash2 size={12} />
                                    Supprimer ce compte
                                  </button>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className="text-xs text-gray-500 font-body">{user.email || '—'}</span>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="font-accent font-bold text-gray-700">{user.cycle_length}j</span>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="text-gray-600 font-body">
                            {fitnessLabels[user.fitness_level] || user.fitness_level}
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {(user.goals || []).slice(0, 4).map((g) => (
                              <span
                                key={g}
                                className="w-6 h-6 bg-luna-rose/10 rounded-md flex items-center justify-center text-luna-rose"
                                title={goalLabels[g]?.label || g}
                              >
                                {goalLabels[g]?.icon || '•'}
                              </span>
                            ))}
                            {(user.goals || []).length > 4 && (
                              <span className="text-xs text-gray-400 self-center">+{user.goals.length - 4}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-body font-semibold bg-blue-50 text-blue-600">
                            {getUserMonths(user)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Calendar size={12} />
                            <span className="font-body text-xs">
                              {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
        </>)}

        {activeTab === 'waitlist' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg text-gray-800">Liste d'attente</h3>
                <p className="text-xs text-gray-400 font-body mt-0.5">
                  {waitlist.length} inscrite{waitlist.length > 1 ? 's' : ''} à la vitrine · à importer dans ton outil d'emailing au lancement
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={fetchWaitlist}
                  disabled={waitlistLoading}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-body"
                >
                  <RefreshCw size={14} className={waitlistLoading ? 'animate-spin' : ''} />
                  Actualiser
                </button>
                <button
                  onClick={() => setWaitlistDeleteConfirm('all')}
                  disabled={waitlist.length === 0}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all font-body font-semibold disabled:opacity-40"
                >
                  <Trash2 size={14} />
                  Tout supprimer
                </button>
                <button
                  onClick={exportWaitlistCsv}
                  disabled={waitlist.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-luna-rose text-white rounded-xl hover:bg-luna-rose-dark transition-all font-body font-semibold disabled:opacity-50"
                >
                  <Download size={14} />
                  Exporter CSV
                </button>
              </div>
            </div>

            {/* Barre d'action : recherche + suppression de la sélection */}
            {waitlist.length > 0 && (
              <div className="px-5 py-3 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {selectedWaitlist.size > 0 && (
                    <button
                      onClick={() => setWaitlistDeleteConfirm('bulk')}
                      className="flex items-center gap-2 px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-body font-semibold"
                    >
                      <Trash2 size={12} />
                      Supprimer ({selectedWaitlist.size})
                    </button>
                  )}
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={waitlistSearch}
                    onChange={(e) => setWaitlistSearch(e.target.value)}
                    placeholder="Rechercher un prénom, email..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-luna-rose/30"
                  />
                </div>
              </div>
            )}

            {waitlistLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="animate-spin mx-auto text-luna-rose mb-3" size={24} />
                <p className="text-sm text-gray-400 font-body">Chargement...</p>
              </div>
            ) : waitlist.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="text-gray-400 font-body">Aucune inscription pour le moment</p>
                <p className="text-xs text-gray-300 font-body mt-1">
                  Les emails récupérés sur la vitrine apparaîtront ici
                </p>
              </div>
            ) : filteredWaitlist.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="text-gray-400 font-body">Aucun résultat pour « {waitlistSearch} »</p>
                <p className="text-xs text-gray-300 font-body mt-1">
                  Essaie un autre prénom ou une autre adresse email
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-body">
                      <th className="w-12 px-3 py-3">
                        <input
                          type="checkbox"
                          checked={filteredWaitlist.length > 0 && selectedWaitlist.size === filteredWaitlist.length}
                          onChange={toggleSelectAllWaitlist}
                          className="w-4 h-4 rounded border-gray-300 text-luna-rose focus:ring-luna-rose/30 cursor-pointer"
                        />
                      </th>
                      <th className="text-left px-5 py-3 font-semibold">Prénom</th>
                      <th className="text-left px-5 py-3 font-semibold">Email</th>
                      <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Source</th>
                      <th className="text-left px-5 py-3 font-semibold">Inscription</th>
                      <th className="w-16 px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWaitlist.map((w) => (
                      <motion.tr
                        key={w.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-t border-gray-50 hover:bg-gray-50/50 transition-colors ${selectedWaitlist.has(w.id) ? 'bg-red-50/50' : ''}`}
                      >
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedWaitlist.has(w.id)}
                            onChange={(e) => toggleSelectWaitlist(w.id, e)}
                            className="w-4 h-4 rounded border-gray-300 text-luna-rose focus:ring-luna-rose/30 cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-body text-gray-800">{w.prenom || '—'}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-luna-rose/10 flex items-center justify-center text-luna-rose flex-shrink-0">
                              <Mail size={13} />
                            </div>
                            <span className="font-body text-gray-800">{w.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className="text-xs text-gray-400 font-body bg-gray-50 px-2 py-1 rounded-lg">{w.source || '—'}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Calendar size={12} />
                            <span className="font-body text-xs">
                              {new Date(w.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={() => setWaitlistDeleteConfirm(w)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center px-4" onClick={() => setDeleteConfirm(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <h3 className="font-display text-lg text-gray-800">
                {deleteConfirm === 'bulk'
                  ? `Supprimer ${selectedUsers.size} compte${selectedUsers.size > 1 ? 's' : ''} ?`
                  : 'Supprimer ce compte ?'
                }
              </h3>
            </div>

            {deleteConfirm === 'bulk' ? (
              <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-40 overflow-y-auto space-y-2">
                {users.filter((u) => selectedUsers.has(u.id)).map((u) => (
                  <div key={u.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-500">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-600 font-body">{u.name}</span>
                    <span className="text-xs text-gray-400 font-body">— {u.email || 'pas d\'email'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 font-body">{deleteConfirm.name}</p>
                <p className="text-xs text-gray-400 font-body">{deleteConfirm.email || 'Pas d\'email'}</p>
                <p className="text-xs text-gray-400 font-body mt-1">
                  Inscrite le {new Date(deleteConfirm.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 font-body mb-5">
              Cette action est irréversible. Toutes les données seront supprimées.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-body font-semibold hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteConfirm === 'bulk' ? handleBulkDelete() : handleDeleteUser(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-body font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Supprimer{deleteConfirm === 'bulk' ? ` (${selectedUsers.size})` : ''}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de confirmation — suppression liste d'attente */}
      {waitlistDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center px-4" onClick={() => setWaitlistDeleteConfirm(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <h3 className="font-display text-lg text-gray-800">
                {waitlistDeleteConfirm === 'all'
                  ? `Vider toute la liste (${waitlist.length}) ?`
                  : waitlistDeleteConfirm === 'bulk'
                    ? `Supprimer ${selectedWaitlist.size} inscription${selectedWaitlist.size > 1 ? 's' : ''} ?`
                    : 'Retirer de la liste ?'
                }
              </h3>
            </div>

            {waitlistDeleteConfirm === 'all' || waitlistDeleteConfirm === 'bulk' ? (
              <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-40 overflow-y-auto space-y-2">
                {(waitlistDeleteConfirm === 'all'
                  ? waitlist
                  : waitlist.filter((w) => selectedWaitlist.has(w.id))
                ).map((w) => (
                  <div key={w.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                      <Mail size={11} />
                    </div>
                    <span className="text-xs text-gray-600 font-body truncate">{w.email}</span>
                    {w.prenom && <span className="text-xs text-gray-400 font-body">— {w.prenom}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 font-body">{waitlistDeleteConfirm.email}</p>
                <p className="text-xs text-gray-400 font-body mt-1">
                  Inscrite le {new Date(waitlistDeleteConfirm.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 font-body mb-5">
              {waitlistDeleteConfirm === 'all'
                ? 'Toutes les adresses seront retirées de ta liste d\'attente. Action irréversible : pense à exporter le CSV avant.'
                : 'Cette action est irréversible.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setWaitlistDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-body font-semibold hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (waitlistDeleteConfirm === 'all') handleBulkDeleteWaitlist('all');
                  else if (waitlistDeleteConfirm === 'bulk') handleBulkDeleteWaitlist('bulk');
                  else handleDeleteWaitlist(waitlistDeleteConfirm);
                }}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-body font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
