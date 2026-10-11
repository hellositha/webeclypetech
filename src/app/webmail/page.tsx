'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Mail,
  Inbox,
  Send,
  FileText,
  Trash2,
  Archive,
  Star,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Reply,
  Forward,
  ExternalLink,
  User,
  Activity,
  Layers,
  ArrowLeft,
  X,
  Lock,
} from 'lucide-react';

interface MailUser {
  id: number;
  email: string;
  name: string;
  quota_bytes: number;
  active: boolean;
}

interface MessageItem {
  id: number;
  account_id: number;
  folder: string;
  message_id: string;
  from_address: string;
  from_name: string;
  to_address: string;
  cc_address?: string;
  reply_to?: string;
  subject: string;
  snippet: string;
  body_text?: string;
  body_html?: string;
  is_read: boolean;
  is_starred: boolean;
  is_draft: boolean;
  has_attachments: boolean;
  size_bytes: number;
  received_at: string;
}

interface FolderCounts {
  INBOX: number;
  Sent: number;
  Drafts: number;
  Trash: number;
  Starred: number;
  Archive: number;
}

interface ServerStatus {
  postfix: {
    running: boolean;
    version: string;
    ports: number[];
    queueSize: number;
  };
  dovecot: {
    running: boolean;
    version: string;
    protocols: string[];
    ports: number[];
  };
  database: {
    connected: boolean;
    totalAccounts: number;
    totalDomains: number;
    totalAliases: number;
    totalIndexedMessages: number;
  };
}

export default function WebmailPage() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<MailUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Mail state
  const [activeFolder, setActiveFolder] = useState<string>('INBOX');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [counts, setCounts] = useState<FolderCounts>({
    INBOX: 0,
    Sent: 0,
    Drafts: 0,
    Trash: 0,
    Starred: 0,
    Archive: 0,
  });
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');

  // Compose state
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeCc, setComposeCc] = useState('');
  const [composeBcc, setComposeBcc] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendError, setSendError] = useState('');

  // Diagnostics & accounts modal
  const [serverModalOpen, setServerModalOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [accountsList, setAccountsList] = useState<any[]>([]);
  const [loadingServerStatus, setLoadingServerStatus] = useState(false);

  // New account form inside server modal
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountActionMsg, setAccountActionMsg] = useState('');

  // Check auth on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/mail/auth');
      const data = await res.json();
      if (res.ok && data.authenticated && data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/mail/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUser(data.user);
        setSelectedMessage(null);
      } else {
        setLoginError(data.error || 'Failed to authenticate mail user');
      }
    } catch {
      setLoginError('Network error connecting to mail auth endpoint');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/mail/auth', { method: 'DELETE' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
    setSelectedMessage(null);
    setMessages([]);
  };

  // Fetch messages
  const fetchMessages = useCallback(
    async (folder = activeFolder, query = searchQuery, sync = false) => {
      if (!currentUser) return;
      setLoadingMessages(true);
      if (sync) setIsSyncing(true);

      try {
        const params = new URLSearchParams({ folder });
        if (query.trim()) params.set('q', query.trim());

        const res = await fetch(`/api/mail/messages?${params.toString()}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setMessages(data.messages || []);
          if (data.counts) setCounts(data.counts);
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoadingMessages(false);
        setIsSyncing(false);
      }
    },
    [currentUser, activeFolder, searchQuery]
  );

  useEffect(() => {
    if (currentUser) {
      fetchMessages(activeFolder, searchQuery);
    }
  }, [currentUser, activeFolder, fetchMessages, searchQuery]);

  // Load message detail
  const handleSelectMessage = async (msg: MessageItem) => {
    setSelectedMessage(msg);
    setLoadingDetail(true);

    try {
      const res = await fetch(`/api/mail/messages/${msg.id}`);
      const data = await res.json();
      if (res.ok && data.success && data.message) {
        setSelectedMessage(data.message);
        // update local read status
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        );
        // decrease unread count if it was unread
        if (!msg.is_read) {
          setCounts((prev) => ({
            ...prev,
            INBOX: Math.max(0, prev.INBOX - 1),
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching message details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Toggle Star
  const handleToggleStar = async (msg: MessageItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStar = !msg.is_starred;

    // Optimistic UI update
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, is_starred: newStar } : m))
    );
    if (selectedMessage && selectedMessage.id === msg.id) {
      setSelectedMessage({ ...selectedMessage, is_starred: newStar });
    }

    try {
      await fetch(`/api/mail/messages/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_starred: newStar }),
      });
      // Refresh count
      setCounts((prev) => ({
        ...prev,
        Starred: newStar ? prev.Starred + 1 : Math.max(0, prev.Starred - 1),
      }));
    } catch (err) {
      console.error('Failed to star message:', err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (msgId: number, permanent = false) => {
    try {
      const res = await fetch(`/api/mail/messages/${msgId}${permanent ? '?permanent=true' : ''}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        if (selectedMessage && selectedMessage.id === msgId) {
          setSelectedMessage(null);
        }
        fetchMessages(activeFolder);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // Sync Maildir
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/mail/sync', { method: 'POST' });
      await fetchMessages(activeFolder, searchQuery, false);
    } catch (err) {
      console.error('Failed to sync mail:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Send Email
  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) {
      setSendError('Please provide recipient (To) and subject');
      return;
    }

    setIsSending(true);
    setSendError('');
    setSendSuccess('');

    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: composeTo.trim(),
          cc: composeCc.trim() || undefined,
          bcc: composeBcc.trim() || undefined,
          subject: composeSubject.trim(),
          bodyText: composeBody,
          bodyHtml: composeBody.replace(/\n/g, '<br/>'),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSendSuccess('Email dispatched successfully via Postfix MTA');
        setTimeout(() => {
          setComposeOpen(false);
          setComposeTo('');
          setComposeCc('');
          setComposeBcc('');
          setComposeSubject('');
          setComposeBody('');
          setSendSuccess('');
          fetchMessages(activeFolder);
        }, 1200);
      } else {
        setSendError(data.error || 'Failed to dispatch email');
      }
    } catch {
      setSendError('Network error dispatching email via Postfix');
    } finally {
      setIsSending(false);
    }
  };

  // Reply handler
  const handleReply = () => {
    if (!selectedMessage) return;
    setComposeTo(selectedMessage.from_address);
    setComposeSubject(
      selectedMessage.subject.startsWith('Re:')
        ? selectedMessage.subject
        : `Re: ${selectedMessage.subject}`
    );
    setComposeBody(
      `\n\n--- On ${new Date(selectedMessage.received_at).toLocaleString()}, ${
        selectedMessage.from_name || selectedMessage.from_address
      } wrote ---\n> ${
        (selectedMessage.body_text || selectedMessage.snippet || '').replace(/\n/g, '\n> ')
      }`
    );
    setComposeOpen(true);
  };

  // Forward handler
  const handleForward = () => {
    if (!selectedMessage) return;
    setComposeTo('');
    setComposeSubject(
      selectedMessage.subject.startsWith('Fwd:')
        ? selectedMessage.subject
        : `Fwd: ${selectedMessage.subject}`
    );
    setComposeBody(
      `\n\n---------- Forwarded message ---------\nFrom: ${
        selectedMessage.from_name || selectedMessage.from_address
      } <${selectedMessage.from_address}>\nDate: ${new Date(
        selectedMessage.received_at
      ).toLocaleString()}\nSubject: ${selectedMessage.subject}\nTo: ${
        selectedMessage.to_address
      }\n\n${selectedMessage.body_text || selectedMessage.snippet || ''}`
    );
    setComposeOpen(true);
  };

  // Load Server Status & Accounts
  const handleOpenServerModal = async () => {
    setServerModalOpen(true);
    setLoadingServerStatus(true);
    try {
      const [statusRes, accRes] = await Promise.all([
        fetch('/api/mail/status'),
        fetch('/api/mail/accounts'),
      ]);
      const statusData = await statusRes.json();
      const accData = await accRes.json();

      if (statusData.success) setServerStatus(statusData.status);
      if (accData.success) setAccountsList(accData.accounts || []);
    } catch (err) {
      console.error('Error fetching server diagnostics:', err);
    } finally {
      setLoadingServerStatus(false);
    }
  };

  // Create Virtual Mailbox Account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccEmail || !newAccPassword || !newAccName) return;

    setCreatingAccount(true);
    setAccountActionMsg('');

    try {
      const fullEmail = newAccEmail.includes('@')
        ? newAccEmail
        : `${newAccEmail}@eclypetech.biz`;

      const res = await fetch('/api/mail/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fullEmail,
          password: newAccPassword,
          name: newAccName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccountActionMsg(`Account ${fullEmail} created successfully with Maildir storage!`);
        setNewAccEmail('');
        setNewAccName('');
        setNewAccPassword('');
        // Refresh accounts
        const accRes = await fetch('/api/mail/accounts');
        const accData = await accRes.json();
        if (accData.success) setAccountsList(accData.accounts || []);
      } else {
        setAccountActionMsg(`Error: ${data.error || 'Failed to create account'}`);
      }
    } catch {
      setAccountActionMsg('Network error creating mail account');
    } finally {
      setCreatingAccount(false);
    }
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // If loading auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
          <p className="text-sm font-medium">Connecting to ECLYPE Mail Server...</p>
        </div>
      </div>
    );
  }

  // If NOT authenticated, show Login View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 shadow-xl shadow-sky-500/20 mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              ECLYPE <span className="text-sky-400">Webmail</span>
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Enterprise Mail Server • Postfix, Dovecot &amp; PostgreSQL
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="username@eclypetech.biz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" /> Sign In to Webmail
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick links & server status badge */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              ← Return to Main Website
            </Link>
            <button
              onClick={handleOpenServerModal}
              className="hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Server Telemetry
            </button>
          </div>
        </div>

        {/* Server modal */}
        {renderServerModal()}
      </div>
    );
  }

  // Function to render Server Diagnostic Modal
  function renderServerModal() {
    if (!serverModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Mail Server Telemetry &amp; Provisioning</h3>
                <p className="text-xs text-slate-400">Postfix 3.10.6 • Dovecot 2.4.2 • PostgreSQL</p>
              </div>
            </div>
            <button
              onClick={() => setServerModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loadingServerStatus ? (
            <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
              <p className="text-xs">Querying system daemons...</p>
            </div>
          ) : (
            <div className="py-4 space-y-6">
              {/* Daemons overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400 font-mono">POSTFIX MTA</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">
                    {serverStatus?.postfix.running ? 'Active (Running)' : 'Offline'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Ports: 25, 465, 587
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400 font-mono">DOVECOT IMAP</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">
                    {serverStatus?.dovecot.running ? 'Active (Running)' : 'Offline'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Ports: 110, 143, 993, 995
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400 font-mono">POSTGRESQL</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">Connected</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {serverStatus?.database.totalIndexedMessages || 0} msgs • {serverStatus?.database.totalAccounts || 0} accounts
                  </div>
                </div>
              </div>

              {/* Active Accounts Directory */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Virtual Mail Accounts on eclypetech.biz ({accountsList.length})
                </h4>
                <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800 max-h-40 overflow-y-auto">
                  {accountsList.map((acc) => (
                    <div key={acc.id} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{acc.email}</span>
                        <span className="text-slate-400 ml-2">({acc.name})</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Maildir Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provision New Virtual Account */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
                  Provision New Virtual Mailbox Account
                </h4>
                <form onSubmit={handleCreateAccount} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Username (e.g. dev)"
                      value={newAccEmail}
                      onChange={(e) => setNewAccEmail(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                    <input
                      type="text"
                      placeholder="Display Name"
                      value={newAccName}
                      onChange={(e) => setNewAccName(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newAccPassword}
                      onChange={(e) => setNewAccPassword(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  {accountActionMsg && (
                    <p className="text-xs text-emerald-400">{accountActionMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={creatingAccount}
                    className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {creatingAccount ? 'Provisioning...' : 'Provision Mailbox'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN AUTHENTICATED WEBMAIL INTERFACE
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shadow-md shadow-sky-600/30">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-sky-300 transition-colors">
                ECLYPE <span className="text-sky-400">Mail</span>
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Postfix &amp; Dovecot Live
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages by subject, sender, or content..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenServerModal}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Mail Server Diagnostics"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Sync Mailbox with Dovecot LMTP"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Current User Card */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
              <div className="text-[11px] text-slate-400 font-mono leading-tight">{currentUser.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 bg-slate-900/60 border-r border-slate-800 flex flex-col shrink-0 p-3 justify-between">
          <div className="space-y-4">
            {/* Compose Button */}
            <button
              onClick={() => {
                setComposeTo('');
                setComposeSubject('');
                setComposeBody('');
                setComposeOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-xs shadow-md shadow-sky-600/20 hover:from-sky-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Compose Email
            </button>

            {/* Folder Navigation */}
            <nav className="space-y-1">
              {[
                { id: 'INBOX', label: 'Inbox', icon: Inbox, count: counts.INBOX },
                { id: 'Starred', label: 'Starred', icon: Star, count: counts.Starred },
                { id: 'Sent', label: 'Sent', icon: Send, count: counts.Sent },
                { id: 'Drafts', label: 'Drafts', icon: FileText, count: counts.Drafts },
                { id: 'Archive', label: 'Archive', icon: Archive, count: counts.Archive },
                { id: 'Trash', label: 'Trash', icon: Trash2, count: counts.Trash },
              ].map((f) => {
                const Icon = f.icon;
                const isActive = activeFolder === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setActiveFolder(f.id);
                      setSelectedMessage(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-500/15 text-sky-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                      <span>{f.label}</span>
                    </div>
                    {f.count > 0 && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          f.id === 'INBOX'
                            ? 'bg-sky-500 text-white font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {f.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Account Status & Storage */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Storage Quota</span>
              <span>5.0 GB</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-sky-500 h-full w-[4%]" />
            </div>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-emerald-400 font-semibold">PostgreSQL Sync</span>
              <button
                onClick={handleOpenServerModal}
                className="text-sky-400 hover:underline"
              >
                Daemons
              </button>
            </div>
          </div>
        </aside>

        {/* Message List Column */}
        <section
          className={`flex-1 flex flex-col border-r border-slate-800 bg-slate-950 ${
            selectedMessage ? 'hidden lg:flex lg:w-96 lg:max-w-md shrink-0' : 'w-full'
          }`}
        >
          {/* Subheader / Action bar */}
          <div className="h-12 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 bg-slate-900/40">
            <span className="text-xs font-semibold text-slate-300">
              {activeFolder} ({messages.length})
            </span>
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {loadingMessages ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mx-auto mb-2" />
                Loading {activeFolder} messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                No messages found in {activeFolder}
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 cursor-pointer transition-colors relative flex items-start gap-3 ${
                      isSelected
                        ? 'bg-sky-500/10 border-l-2 border-l-sky-500'
                        : msg.is_read
                        ? 'hover:bg-slate-900/60'
                        : 'bg-slate-900/30 hover:bg-slate-900/80 font-semibold text-white'
                    }`}
                  >
                    {/* Star button */}
                    <button
                      onClick={(e) => handleToggleStar(msg, e)}
                      className="p-1 text-slate-500 hover:text-amber-400 mt-0.5"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          msg.is_starred ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>

                    {/* Unread dot */}
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-sky-400 absolute top-4 left-1.5" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="truncate font-medium text-slate-200">
                          {activeFolder === 'Sent'
                            ? `To: ${msg.to_address}`
                            : msg.from_name || msg.from_address}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {formatDate(msg.received_at)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-100 font-medium truncate mb-0.5">
                        {msg.subject || '(No Subject)'}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 font-normal">
                        {msg.snippet || 'No message preview available.'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Message Detail Viewer Pane */}
        <section
          className={`flex-1 flex flex-col bg-slate-900/30 overflow-y-auto ${
            selectedMessage ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {loadingDetail ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mr-2" /> Loading message...
            </div>
          ) : selectedMessage ? (
            <div className="flex-1 flex flex-col">
              {/* Message Header Action Bar */}
              <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/60 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 mr-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleReply}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5 text-sky-400" /> Reply
                  </button>
                  <button
                    onClick={handleForward}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Forward className="w-3.5 h-3.5 text-slate-400" /> Forward
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStar(selectedMessage)}
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="Star message"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        selectedMessage.is_starred ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id, activeFolder === 'Trash')}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title={activeFolder === 'Trash' ? 'Permanently Delete' : 'Move to Trash'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Meta Info */}
              <div className="p-6 border-b border-slate-800 bg-slate-950/40">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {selectedMessage.subject || '(No Subject)'}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono shrink-0">
                    {selectedMessage.folder}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                      {(selectedMessage.from_name || selectedMessage.from_address)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {selectedMessage.from_name || selectedMessage.from_address}
                        <span className="text-slate-400 font-normal ml-1">
                          &lt;{selectedMessage.from_address}&gt;
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        To: {selectedMessage.to_address}
                        {selectedMessage.cc_address && ` • CC: ${selectedMessage.cc_address}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-400 shrink-0">
                    <div>{new Date(selectedMessage.received_at).toLocaleString()}</div>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                      {selectedMessage.size_bytes ? `${Math.round(selectedMessage.size_bytes / 1024)} KB` : ''}
                    </div>
                  </div>
                </div>

                {/* View toggle (HTML vs Plain Text) */}
                {selectedMessage.body_html && (
                  <div className="mt-4 flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400">Display:</span>
                    <button
                      onClick={() => setViewMode('html')}
                      className={`px-2 py-0.5 rounded ${
                        viewMode === 'html'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Rendered HTML
                    </button>
                    <button
                      onClick={() => setViewMode('text')}
                      className={`px-2 py-0.5 rounded ${
                        viewMode === 'text'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Plain Text
                    </button>
                  </div>
                )}
              </div>

              {/* Message Body Content */}
              <div className="p-6 flex-1 bg-slate-950/20">
                {selectedMessage.body_html && viewMode === 'html' ? (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm leading-relaxed overflow-x-auto">
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedMessage.body_html }}
                      className="prose prose-invert max-w-none"
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.body_text || selectedMessage.snippet || '(Empty Body)'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <Mail className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">Select an email to view</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Choose a message from the list to view its complete body, reply, or forward via Postfix.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Compose Email Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-bold text-white">New Message</span>
                <span className="text-[11px] font-mono text-slate-400">
                  From: {currentUser.email}
                </span>
              </div>
              <button
                onClick={() => setComposeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMail} className="p-5 flex-1 flex flex-col space-y-3 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="text-slate-300 font-semibold">To:</label>
                  <button
                    type="button"
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-[11px] text-sky-400 hover:underline"
                  >
                    {showCcBcc ? 'Hide CC/BCC' : 'Add CC / BCC'}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="recipient@eclypetech.biz or external email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              {showCcBcc && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CC:</label>
                    <input
                      type="text"
                      placeholder="cc@company.com"
                      value={composeCc}
                      onChange={(e) => setComposeCc(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">BCC:</label>
                    <input
                      type="text"
                      placeholder="bcc@company.com"
                      value={composeBcc}
                      onChange={(e) => setComposeBcc(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Subject:</label>
                <input
                  type="text"
                  placeholder="Subject of the email"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex-1 flex flex-col min-h-[220px]">
                <label className="block text-xs text-slate-300 font-semibold mb-1">Message:</label>
                <textarea
                  placeholder="Write your email message here..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="flex-1 w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 resize-none font-sans"
                />
              </div>

              {sendError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {sendSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{sendSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  SMTP MTA: 127.0.0.1:25 (Postfix Active)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setComposeOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-600/30 hover:from-sky-400 hover:to-blue-500 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Dispatching...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diagnostics Modal */}
      {renderServerModal()}
    </div>
  );
}
