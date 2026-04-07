import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Activity, Target, Shield,
  Eye, EyeOff, LogOut, RefreshCw, Search,
  ChevronDown, ChevronUp, Calendar, Dumbbell,
  Utensils, Moon, Brain, BookOpen, Flame,
  ArrowLeft, Trash2, X, AlertTriangle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'luna2026admin';

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
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('luna_admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedUser, setExpandedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // user object or 'bulk'
  const [deleting, setDeleting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

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
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression : ' + err.message);
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

      setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.id)));
      setSelectedUsers(new Set());
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erreur suppression groupée:', err);
      alert('Erreur lors de la suppression : ' + err.message);
    }
    setDeleting(false);
  };

  // If already authenticated from sessionStorage, fetch users on mount
  useEffect(() => {
    if (authenticated) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('luna_admin_auth', 'true');
      setAuthenticated(true);
      setError('');
      fetchUsers();
    } else {
      setError('Mot de passe incorrect');
    }
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
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.current_phase?.toLowerCase().includes(search.toLowerCase())
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

  // ---- LOGIN SCREEN ----
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-luna-rose/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-luna-rose" size={32} />
            </div>
            <h1 className="font-display text-2xl text-gray-800">Admin LUNA</h1>
            <p className="text-sm text-gray-500 font-body mt-1">Accès réservé</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-[24px] p-6 shadow-lg border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-body">
              Mot de passe
            </label>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-body focus:outline-none focus:ring-2 focus:ring-luna-rose/40 focus:border-luna-rose transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-3 font-body">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-luna-rose text-white rounded-xl font-body font-bold hover:bg-luna-rose-dark transition-all"
            >
              Accéder au dashboard
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mx-auto mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors font-body"
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
              <h1 className="font-display text-xl text-gray-800">Admin LUNA</h1>
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
              onClick={() => { sessionStorage.removeItem('luna_admin_auth'); setAuthenticated(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all font-body"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
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
                    <th className="text-left px-5 py-3 font-semibold">Phase</th>
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
                    const phase = phaseLabels[user.current_phase] || phaseLabels.unknown;
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
                              style={{ backgroundColor: phase.color }}>
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
                                  <p className="text-xs text-gray-400">
                                    Règles : {user.period_length}j • Dernières : {user.last_period_date}
                                  </p>
                                  {user.diet_preferences?.length > 0 && (
                                    <p className="text-xs text-gray-400">
                                      Régime : {user.diet_preferences.join(', ')}
                                    </p>
                                  )}
                                  {user.health_issues?.length > 0 && (
                                    <p className="text-xs text-gray-400">
                                      Santé : {user.health_issues.join(', ')}
                                    </p>
                                  )}
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
                        <td className="px-5 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body"
                            style={{ backgroundColor: phase.bg, color: phase.color }}
                          >
                            {phase.icon} {phase.name}
                          </span>
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
    </div>
  );
}
