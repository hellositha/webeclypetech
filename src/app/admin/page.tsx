'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  Database,
  Users,
  CalendarCheck,
  Calculator,
  Mail,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Shield,
  LogOut,
  KeyRound,
  UserPlus,
  Trash2,
  Edit3,
  X,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_color?: string;
  last_login?: string | null;
  created_at: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service_id: string;
  division_id: string;
  budget: string;
  urgency: string;
  message: string;
  status: string;
  created_at: string;
}

interface Consultation {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  business_size: string;
  division: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  status: string;
  created_at: string;
}

interface QuoteRequest {
  id: number;
  client_name: string;
  email: string;
  phone: string;
  company: string;
  selected_services: string[] | string;
  deployment_type: string;
  user_count: number;
  estimated_monthly: string | number;
  estimated_onetime: string | number;
  timeline: string;
  requirements: string;
  status: string;
  created_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  status: string;
  created_at: string;
}

interface ActivityLog {
  id: number;
  action: string;
  details: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<
    'inquiries' | 'consultations' | 'quotes' | 'subscribers' | 'logs' | 'users'
  >('inquiries');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [stats, setStats] = useState({
    totalInquiries: 0,
    totalConsultations: 0,
    totalQuotes: 0,
    totalSubscribers: 0,
    totalAdminUsers: 0,
    dbStatus: 'Checking...',
    dbLatencyMs: 0,
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // User management modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userModalLoading, setUserModalLoading] = useState(false);
  const [userModalError, setUserModalError] = useState<string | null>(null);

  // Form states for Add User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Admin');
  const [newUserStatus, setNewUserStatus] = useState('Active');
  const [newUserColor, setNewUserColor] = useState('emerald');

  // Form states for Edit User
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('Admin');
  const [editStatus, setEditStatus] = useState('Active');
  const [editPassword, setEditPassword] = useState('');
  const [editColor, setEditColor] = useState('emerald');

  // Check auth status on mount
  const checkAuth = useCallback(async () => {
    try {
      setAuthChecking(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch telemetry and data
  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setRefreshing(true);
    try {
      // 1. Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
          if (statsData.recent?.activity) {
            setLogs(statsData.recent.activity);
          }
        }
      }

      // 2. Fetch full lists
      const [inqRes, consRes, quotesRes, subsRes, usersRes] = await Promise.all([
        fetch('/api/inquiries'),
        fetch('/api/consultations'),
        fetch('/api/quotes'),
        fetch('/api/newsletter'),
        fetch('/api/admin/users'),
      ]);

      if (inqRes.ok) {
        const d = await inqRes.json();
        if (d.success) setInquiries(d.data);
      }
      if (consRes.ok) {
        const d = await consRes.json();
        if (d.success) setConsultations(d.data);
      }
      if (quotesRes.ok) {
        const d = await quotesRes.json();
        if (d.success) setQuotes(d.data);
      }
      if (subsRes.ok) {
        const d = await subsRes.json();
        if (d.success) setSubscribers(d.data);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        if (d.success) setAdminUsers(d.users);
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        setActionNotice(`Signed in as ${data.user.name} (${data.user.role})`);
        setLoginPassword('');
      } else {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setLoginError('Network error occurred while connecting to authentication service.');
    } finally {
      setLoginLoading(false);
    }
  };


  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setCurrentUser(null);
      setActionNotice(null);
      setActiveTab('inquiries');
    }
  };

  // Handle status update
  const handleStatusChange = async (
    table: 'inquiries' | 'consultations' | 'quote_requests',
    id: number,
    newStatus: string
  ) => {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Record #${id} status updated to "${newStatus}"`);
        setTimeout(() => setActionNotice(null), 4000);
        fetchData();
      } else {
        alert(data.error || 'Failed to update record.');
      }
    } catch {
      alert('Error updating status.');
    }
  };

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserModalLoading(true);
    setUserModalError(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          status: newUserStatus,
          avatar_color: newUserColor,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('Admin');
        setNewUserStatus('Active');
        setActionNotice(`Staff account created for ${data.user.name}`);
        setTimeout(() => setActionNotice(null), 4000);
        fetchData();
      } else {
        setUserModalError(data.error || 'Failed to create user account.');
      }
    } catch {
      setUserModalError('Network error while creating account.');
    } finally {
      setUserModalLoading(false);
    }
  };

  // Open Edit User Modal
  const openEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditColor(user.avatar_color || 'emerald');
    setEditPassword('');
    setUserModalError(null);
  };

  // Handle Update User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUserModalLoading(true);
    setUserModalError(null);

    try {
      const payload: Record<string, string> = {
        name: editName,
        email: editEmail,
        role: editRole,
        status: editStatus,
        avatar_color: editColor,
      };
      if (editPassword.trim().length > 0) {
        payload.password = editPassword.trim();
      }

      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingUser(null);
        setActionNotice(`Updated account details for ${data.user.name}`);
        setTimeout(() => setActionNotice(null), 4000);
        fetchData();
      } else {
        setUserModalError(data.error || 'Failed to update user profile.');
      }
    } catch {
      setUserModalError('Network error while updating user.');
    } finally {
      setUserModalLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${user.name} (${user.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionNotice(`User account ${user.name} has been removed.`);
        setTimeout(() => setActionNotice(null), 4000);
        fetchData();
      } else {
        alert(data.error || 'Failed to delete user.');
      }
    } catch {
      alert('Error occurred while deleting user.');
    }
  };

  // CSV export generator
  const exportToCsv = () => {
    let rows: string[][] = [];
    const filename = `eclypetech-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;

    if (activeTab === 'inquiries') {
      rows.push(['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Division', 'Budget', 'Urgency', 'Status', 'Date']);
      inquiries.forEach((i) =>
        rows.push([
          String(i.id),
          i.name,
          i.email,
          i.phone || '',
          i.company || '',
          i.service_id || '',
          i.division_id || '',
          i.budget || '',
          i.urgency || '',
          i.status,
          i.created_at,
        ])
      );
    } else if (activeTab === 'consultations') {
      rows.push(['ID', 'Name', 'Email', 'Phone', 'Company', 'Size', 'Division', 'Date', 'Time', 'Notes', 'Status', 'Created']);
      consultations.forEach((c) =>
        rows.push([
          String(c.id),
          c.full_name,
          c.email,
          c.phone,
          c.company_name,
          c.business_size || '',
          c.division || '',
          c.preferred_date || '',
          c.preferred_time || '',
          c.notes || '',
          c.status,
          c.created_at,
        ])
      );
    } else if (activeTab === 'quotes') {
      rows.push(['ID', 'Client', 'Email', 'Phone', 'Company', 'Deployment', 'Users', 'Est Monthly', 'Est One-time', 'Timeline', 'Status', 'Date']);
      quotes.forEach((q) =>
        rows.push([
          String(q.id),
          q.client_name,
          q.email,
          q.phone || '',
          q.company,
          q.deployment_type || '',
          String(q.user_count || ''),
          String(q.estimated_monthly || ''),
          String(q.estimated_onetime || ''),
          q.timeline || '',
          q.status,
          q.created_at,
        ])
      );
    } else if (activeTab === 'subscribers') {
      rows.push(['ID', 'Email', 'Status', 'Date']);
      subscribers.forEach((s) => rows.push([String(s.id), s.email, s.status, s.created_at]));
    } else if (activeTab === 'users') {
      rows.push(['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login', 'Created At']);
      adminUsers.forEach((u) =>
        rows.push([String(u.id), u.name, u.email, u.role, u.status, u.last_login || 'Never', u.created_at])
      );
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered queries
  const filteredInquiries = inquiries.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch =
      search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const filteredConsultations = consultations.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch =
      search === '' ||
      item.full_name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.company_name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredQuotes = quotes.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch =
      search === '' ||
      item.client_name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredUsers = adminUsers.filter((u) => {
    const matchStatus = statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch =
      search === '' ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Loading skeleton while checking session
  if (authChecking) {
    return (
      <div className="py-24 bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-mono text-slate-400">Verifying enterprise security session...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNAUTHENTICATED STATE: LOGIN GATEWAY
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="py-16 md:py-24 bg-slate-950 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
            {/* Header / Brand */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 p-0.5 mx-auto mb-4 shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-sky-400" />
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-medium mb-3">
                <Lock className="w-3 h-3" />
                AUTHENTICATED ACCESS ONLY
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin &amp; Operations Portal</h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Enter your authorized ECLYPE Technology administrator credentials to manage infrastructure leads, consultations, and staff accounts.
              </p>
            </div>

            {/* Error Notification */}
            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enterprise Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@eclypetech.biz"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Authenticate &amp; Access Dashboard</span>
                  </>
                )}
              </button>
            </form>


            {/* Security Footer Notice */}
            <div className="mt-6 text-center text-[10px] text-slate-500 font-mono">
              Protected by PostgreSQL 18 SSL &bull; HTTP-Only JWT Session &bull; Bcrypt
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper avatar styling
  const getAvatarBg = (color?: string) => {
    switch (color) {
      case 'sky':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'indigo':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3 h-3" />
            Super Admin
          </span>
        );
      case 'Support Lead':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            Support Lead
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            Admin
          </span>
        );
    }
  };

  // -------------------------------------------------------------
  // AUTHENTICATED STATE: DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="py-10 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Strip with User Profile & Sign Out */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              POSTGRESQL 18 CLUSTER &bull; ECLYPE TECHNOLOGY ENGINE
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Lock className="w-7 h-7 text-sky-400" />
              Lead &amp; Operations Control Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time monitoring of customer inquiries, scheduled consultations, project quotes, and staff user accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* User Profile Chip */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${getAvatarBg(
                  currentUser.avatar_color
                )}`}
              >
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  {currentUser.name}
                  {getRoleBadge(currentUser.role)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{currentUser.email}</div>
              </div>
            </div>

            <button
              onClick={fetchData}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-sky-400' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportToCsv}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Live Notification Feedback */}
        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-emerald-400 hover:text-white text-xs font-mono"
            >
              &times; Close
            </button>
          </div>
        )}

        {/* System Telemetry KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Total Inquiries</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalInquiries}</div>
            <div className="text-[11px] text-slate-500 mt-1">Pending: {inquiries.filter((i) => i.status === 'Pending').length}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Consultations</span>
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalConsultations}</div>
            <div className="text-[11px] text-slate-500 mt-1">Scheduled: {consultations.filter((c) => c.status === 'Scheduled').length}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Quote Requests</span>
              <Calculator className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalQuotes}</div>
            <div className="text-[11px] text-slate-500 mt-1">Under Review: {quotes.filter((q) => q.status === 'Reviewing').length}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Subscribers</span>
              <Mail className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalSubscribers}</div>
            <div className="text-[11px] text-slate-500 mt-1">Active tech briefs</div>
          </div>

          <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Admin Staff</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{adminUsers.length || stats.totalAdminUsers}</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              {stats.dbStatus.includes('Healthy') ? 'DB 1ms Latency' : stats.dbStatus}
            </div>
          </div>
        </div>

        {/* Tab switcher & Search filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('inquiries');
                setStatusFilter('all');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'inquiries' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inquiries ({inquiries.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('consultations');
                setStatusFilter('all');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'consultations' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Consultations ({consultations.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('quotes');
                setStatusFilter('all');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'quotes' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Quote Requests ({quotes.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('subscribers');
                setStatusFilter('all');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'subscribers' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Subscribers ({subscribers.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('users');
                setStatusFilter('all');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'users' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Management ({adminUsers.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('logs');
                setStatusFilter('all');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'logs' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              System Logs ({logs.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search records..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {activeTab !== 'subscribers' && activeTab !== 'logs' && (
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-3 pr-8 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
                <Filter className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* TAB 1: INQUIRIES */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'inquiries' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Service &amp; Division</th>
                    <th className="py-3 px-4">Budget / Urgency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No inquiries found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{inq.name}</div>
                          <div className="text-[11px] text-slate-400">{inq.company || 'Direct Client'}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div>{inq.email}</div>
                          <div className="text-slate-500">{inq.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sky-400 font-semibold">{inq.service_id || 'General Consultation'}</div>
                          <div className="text-[10px] text-slate-500">{inq.division_id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-white font-medium">{inq.budget || 'Custom RFP'}</div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              inq.urgency === 'High' || inq.urgency === 'Urgent'
                                ? 'bg-rose-500/10 text-rose-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {inq.urgency || 'Normal'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange('inquiries', inq.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => alert(`Client Message:\n\n${inq.message}`)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                          >
                            View Brief
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 2: CONSULTATIONS */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'consultations' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Executive</th>
                    <th className="py-3 px-4">Company &amp; Scale</th>
                    <th className="py-3 px-4">Division</th>
                    <th className="py-3 px-4">Requested Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No scheduled consultations found.
                      </td>
                    </tr>
                  ) : (
                    filteredConsultations.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{c.full_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{c.company_name}</div>
                          <div className="text-[10px] text-slate-500">{c.business_size}</div>
                        </td>
                        <td className="py-3 px-4 text-sky-400 font-medium">{c.division}</td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div className="text-white font-bold">{c.preferred_date}</div>
                          <div className="text-emerald-400">{c.preferred_time}</div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange('consultations', c.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-slate-400">{c.notes || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 3: QUOTE REQUESTS */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'quotes' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Client &amp; Company</th>
                    <th className="py-3 px-4">Scope &amp; Deployment</th>
                    <th className="py-3 px-4">Users</th>
                    <th className="py-3 px-4">Estimated Budget</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No quote requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{q.client_name}</div>
                          <div className="text-[11px] text-slate-400">{q.company}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{q.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sky-400 font-medium">{q.deployment_type}</div>
                          <div className="text-[10px] text-slate-500">Timeline: {q.timeline}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">{q.user_count} seats</td>
                        <td className="py-3 px-4 font-mono">
                          <div className="text-emerald-400 font-bold">${Number(q.estimated_monthly || 0).toLocaleString()}/mo</div>
                          <div className="text-[10px] text-slate-500">${Number(q.estimated_onetime || 0).toLocaleString()} initial</div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={q.status}
                            onChange={(e) => handleStatusChange('quote_requests', q.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                          >
                            <option value="Reviewing">Reviewing</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Negotiation">Negotiation</option>
                            <option value="Won">Won</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              alert(
                                `Quote Specifications:\nServices: ${JSON.stringify(
                                  q.selected_services
                                )}\nRequirements: ${q.requirements || 'N/A'}`
                              )
                            }
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 4: SUBSCRIBERS */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'subscribers' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Subscriber Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Subscribed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500">#{s.id}</td>
                      <td className="py-3 px-4 font-semibold text-white font-mono">{s.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{new Date(s.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 5: USER MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User management bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Enterprise Administrative Personnel
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage administrator accounts, role permissions, and active credentials for the ECLYPE Technology control portal.
                </p>
              </div>

              {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
                <button
                  onClick={() => {
                    setShowAddUserModal(true);
                    setUserModalError(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Admin User</span>
                </button>
              )}
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Administrator</th>
                      <th className="py-3 px-4">Role Assignment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Activity</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No users found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${getAvatarBg(
                                  user.avatar_color
                                )}`}
                              >
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center gap-2">
                                  {user.name}
                                  {user.id === currentUser.id && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                user.status === 'Active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'
                                }`}
                              />
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                            {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never logged in'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit Button */}
                              {(currentUser.role === 'Super Admin' || currentUser.id === user.id) && (
                                <button
                                  onClick={() => openEditUser(user)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                  title="Edit Profile & Permissions"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete Button (Super Admin only, cannot delete self) */}
                              {currentUser.role === 'Super Admin' && currentUser.id !== user.id && (
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 6: SYSTEM LOGS */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'logs' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              Automated PostgreSQL Activity &amp; Audit Logs
            </h3>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4 font-mono text-xs"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold">
                      {log.action}
                    </span>
                    <p className="text-slate-300 font-sans text-xs">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: ADD ADMIN USER */}
      {/* ----------------------------------------------------------------- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Create Admin Account</h3>
                <p className="text-xs text-slate-400">Add an authorized staff member to the ECLYPE Operations portal.</p>
              </div>
            </div>

            {userModalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{userModalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enterprise Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@eclypetech.biz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Password (min. 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Permission</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    {currentUser.role === 'Super Admin' && <option value="Super Admin">Super Admin</option>}
                    <option value="Admin">Admin</option>
                    <option value="Support Lead">Support Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Status</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Accent Color</label>
                <div className="flex items-center gap-3">
                  {['emerald', 'sky', 'indigo', 'purple', 'amber'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewUserColor(color)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${
                        newUserColor === color ? 'border-white scale-110' : 'border-transparent'
                      } ${
                        color === 'sky'
                          ? 'bg-sky-500'
                          : color === 'indigo'
                          ? 'bg-indigo-500'
                          : color === 'purple'
                          ? 'bg-purple-500'
                          : color === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userModalLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
                >
                  {userModalLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: EDIT ADMIN USER */}
      {/* ----------------------------------------------------------------- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edit User Profile</h3>
                <p className="text-xs text-slate-400">Modify details, permissions, or reset security credentials.</p>
              </div>
            </div>

            {userModalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{userModalError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enterprise Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              {currentUser.role === 'Super Admin' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Support Lead">Support Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reset Password (leave empty to keep current)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new password (optional)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Accent Color</label>
                <div className="flex items-center gap-3">
                  {['emerald', 'sky', 'indigo', 'purple', 'amber'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditColor(color)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${
                        editColor === color ? 'border-white scale-110' : 'border-transparent'
                      } ${
                        color === 'sky'
                          ? 'bg-sky-500'
                          : color === 'indigo'
                          ? 'bg-indigo-500'
                          : color === 'purple'
                          ? 'bg-purple-500'
                          : color === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userModalLoading}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
                >
                  {userModalLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
