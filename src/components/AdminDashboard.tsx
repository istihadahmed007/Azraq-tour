import React, { useState, useEffect } from 'react';
import { QuoteRequest, QuoteStatus } from '../types';

interface AdminDashboardProps {
  onClose?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'users'>('quotes');
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'flight' | 'visa'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing Quote Modal State
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [editStatus, setEditStatus] = useState<QuoteStatus>('New');
  const [editPrice, setEditPrice] = useState('');
  const [editFlightOptions, setEditFlightOptions] = useState('');
  const [editStaffNote, setEditStaffNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/quotes/admin');
      const data = await res.json();
      if (data.quotes) {
        setQuotes(data.quotes);
      }
    } catch (err) {
      console.error('Failed to load admin quotes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/users/admin');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quotes') {
      fetchQuotes();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const handleToggleUserStatus = async (userEmail: string) => {
    try {
      const res = await fetch('/api/auth/users/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.email === userEmail ? { ...u, isSuspended: data.isSuspended } : u))
        );
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  const handleToggleUserVerification = async (userEmail: string, field: 'email' | 'phone') => {
    try {
      const res = await fetch('/api/auth/users/toggle-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, field }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.email === userEmail ? { ...u, ...data.user } : u))
        );
      }
    } catch (err) {
      console.error('Error toggling user verification:', err);
    }
  };

  const openEditModal = (q: QuoteRequest) => {
    setSelectedQuote(q);
    setEditStatus(q.status);
    setEditPrice(q.quotedPrice || '');
    setEditFlightOptions((q as any).flightOptions || '');
    setEditStaffNote(q.staffNote || '');
    setUpdateSuccess('');
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    setIsUpdating(true);
    setUpdateSuccess('');

    try {
      const res = await fetch(`/api/quotes/admin/${selectedQuote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          quotedPrice: editPrice,
          flightOptions: editFlightOptions,
          staffNote: editStaffNote,
        }),
      });

      const data = await res.json();
      if (data.success && data.quote) {
        setUpdateSuccess(`Quotation ${selectedQuote.id} updated & customer notified!`);
        // Refresh local list
        setQuotes((prev) =>
          prev.map((item) => (item.id === data.quote.id ? data.quote : item))
        );
        setTimeout(() => {
          setSelectedQuote(null);
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to update quote:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
    if (filterType !== 'all' && q.type !== filterType) return false;
    if (filterStatus !== 'all' && q.status !== filterStatus) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const nameMatch = q.customerName.toLowerCase().includes(query);
      const emailMatch = q.email.toLowerCase().includes(query);
      const idMatch = q.id.toLowerCase().includes(query);
      const destMatch =
        q.type === 'flight'
          ? (q as any).to.toLowerCase().includes(query) || (q as any).from.toLowerCase().includes(query)
          : (q as any).destinationCountry.toLowerCase().includes(query);
      return nameMatch || emailMatch || idMatch || destMatch;
    }
    return true;
  });

  // Metrics
  const totalCount = quotes.length;
  const newCount = quotes.filter((q) => q.status === 'New').length;
  const reviewingCount = quotes.filter((q) => q.status === 'Reviewing').length;
  const sentCount = quotes.filter((q) => q.status === 'Sent' || q.status === 'Quotation Prepared').length;
  const confirmedCount = quotes.filter((q) => q.status === 'Customer Confirmed').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-24 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-sky-400/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span>Travel Staff Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif-display font-bold text-white mt-1">
            {activeTab === 'quotes' ? 'Quotation Management Dashboard' : 'User Verification & Account Control'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {activeTab === 'quotes'
              ? 'Review incoming flight & visa requests, prepare custom quotations, and notify customers.'
              : 'Audit registered users, manage email and phone verification statuses, and toggle account suspensions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Tab Switcher */}
          <div className="flex p-1 bg-slate-800 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'quotes' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📋 Quotations ({quotes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'users' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>👥 Users ({users.length})</span>
            </button>
          </div>

          <button
            onClick={activeTab === 'quotes' ? fetchQuotes : fetchUsers}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-white/10 transition-all text-xs font-semibold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-semibold"
            >
              Back to App
            </button>
          )}
        </div>
      </div>

      {/* TAB CONTENT: USER VERIFICATION & ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Stat Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Total Registered Users</div>
            </div>
            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30">
              <div className="text-2xl font-bold text-emerald-300">
                {users.filter((u) => u.emailVerified).length}
              </div>
              <div className="text-xs text-emerald-200/80 mt-0.5">Email Verified</div>
            </div>
            <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/30">
              <div className="text-2xl font-bold text-amber-300">
                {users.filter((u) => u.phoneVerified).length}
              </div>
              <div className="text-xs text-amber-200/80 mt-0.5">Phone Verified</div>
            </div>
            <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-500/30">
              <div className="text-2xl font-bold text-rose-300">
                {users.filter((u) => u.isSuspended).length}
              </div>
              <div className="text-xs text-rose-200/80 mt-0.5">Suspended Accounts</div>
            </div>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium flex flex-col items-center gap-3">
              <span className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
              <span>Loading registered users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-white/10 text-slate-400">
              No registered users in the database yet.
            </div>
          ) : (
            <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-800/80 text-sky-200 uppercase font-semibold tracking-wider text-[11px]">
                    <th className="p-4">User Details</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Email Verification</th>
                    <th className="p-4">Phone Verification</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4 text-right">Account Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.email} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={u.fullName}
                            className="w-9 h-9 rounded-xl object-cover border border-white/20"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{u.fullName}</div>
                            <div className="text-[11px] text-slate-400">{u.country || 'Global'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px]">
                        <div className="text-slate-200">{u.email}</div>
                        <div className="text-slate-400">{u.phone || 'No Phone'}</div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleUserVerification(u.email, 'email')}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            u.emailVerified
                              ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                              : 'bg-rose-500/20 border border-rose-400/40 text-rose-300'
                          }`}
                        >
                          {u.emailVerified ? '✓ Email Verified' : '✕ Unverified (Click to verify)'}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleUserVerification(u.email, 'phone')}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            u.phoneVerified
                              ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                              : 'bg-slate-800 border border-white/10 text-slate-400'
                          }`}
                        >
                          {u.phoneVerified ? '✓ Phone Verified' : '✕ Unverified (Click to verify)'}
                        </button>
                      </td>

                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.email)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            u.isSuspended
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                              : 'bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300'
                          }`}
                        >
                          {u.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: QUOTATION REQUESTS */}
      {activeTab === 'quotes' && (
        <div className="space-y-8">
          {/* Overview Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10">
          <div className="text-2xl font-bold text-white">{totalCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">Total Requests</div>
        </div>
        <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/30">
          <div className="text-2xl font-bold text-amber-300">{newCount}</div>
          <div className="text-xs text-amber-200/80 mt-0.5">New Requests</div>
        </div>
        <div className="p-4 bg-sky-950/40 rounded-2xl border border-sky-500/30">
          <div className="text-2xl font-bold text-sky-300">{reviewingCount}</div>
          <div className="text-xs text-sky-200/80 mt-0.5">In Review</div>
        </div>
        <div className="p-4 bg-teal-950/40 rounded-2xl border border-teal-500/30">
          <div className="text-2xl font-bold text-teal-300">{sentCount}</div>
          <div className="text-xs text-teal-200/80 mt-0.5">Quoted / Sent</div>
        </div>
        <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-emerald-300">{confirmedCount}</div>
          <div className="text-xs text-emerald-200/80 mt-0.5">Confirmed Deals</div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex p-1 bg-slate-800 rounded-xl border border-white/10 text-xs">
            {(['all', 'flight', 'visa'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  filterType === t ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Types' : t === 'flight' ? '✈️ Flight' : '🛂 Visa'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="New">New (Received)</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Quotation Prepared">Quotation Prepared</option>
            <option value="Sent">Sent to Customer</option>
            <option value="Customer Confirmed">Customer Confirmed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search by ID, Name, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* Requests Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-medium flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
          <span>Loading quotation database...</span>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-white/10 text-slate-400 space-y-2">
          <span className="text-4xl">📥</span>
          <div className="text-base font-semibold text-white">No Quotation Requests Found</div>
          <div className="text-xs text-slate-400">Try adjusting your filters or search query.</div>
        </div>
      ) : (
        <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-800/80 text-sky-200 uppercase font-semibold tracking-wider text-[11px]">
                <th className="p-4">Request ID & Type</th>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Route / Destination</th>
                <th className="p-4">Dates & Details</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredQuotes.map((q) => {
                const isFlight = q.type === 'flight';
                const cleanPhone = q.phone.replace(/[^0-9+]/g, '');

                return (
                  <tr key={q.id} className="hover:bg-white/5 transition-colors">
                    {/* ID & Type */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{isFlight ? '✈️' : '🛂'}</span>
                        <div>
                          <div className="font-mono font-bold text-sky-400">{q.id}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-medium">{q.type}</div>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <div className="font-semibold text-white">{q.customerName}</div>
                      <div className="text-[11px] text-slate-300">{q.email}</div>
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-teal-400 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                      >
                        <span className="material-symbols-outlined text-xs">chat</span>
                        <span>{q.phone}</span>
                      </a>
                    </td>

                    {/* Route/Destination */}
                    <td className="p-4">
                      {isFlight ? (
                        <div>
                          <div className="font-semibold text-white">{(q as any).from} ✈️ {(q as any).to}</div>
                          <div className="text-[10px] text-slate-400">{(q as any).tripType}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-white">{(q as any).destinationCountry}</div>
                          <div className="text-[10px] text-slate-400">{(q as any).visaType} Visa</div>
                        </div>
                      )}
                    </td>

                    {/* Dates & Passengers */}
                    <td className="p-4">
                      {isFlight ? (
                        <div>
                          <div>{(q as any).departureDate}</div>
                          <div className="text-[10px] text-slate-400">{(q as any).adults} Adult(s) • {(q as any).cabinClass}</div>
                        </div>
                      ) : (
                        <div>
                          <div>{(q as any).intendedTravelDate}</div>
                          <div className="text-[10px] text-slate-400">{(q as any).applicantsCount} Applicant(s) • {(q as any).requiredService}</div>
                        </div>
                      )}
                    </td>

                    {/* Submission Date */}
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(q.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                        q.status === 'New' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 animate-pulse' :
                        q.status === 'Reviewing' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30' :
                        q.status === 'Quotation Prepared' || q.status === 'Sent' ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      }`}>
                        {q.status === 'New' ? 'New Request' : q.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditModal(q)}
                        className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 font-semibold text-xs transition-all"
                      >
                        Review & Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
        </div>
      )}

      {/* EDIT & UPDATE MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-sky-400/30 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100">
            <div className="px-6 py-5 bg-slate-800 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-sky-400 font-mono font-bold">{selectedQuote.id}</span>
                <h3 className="text-lg font-serif-display font-bold text-white">
                  Update Quotation — {selectedQuote.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {updateSuccess && (
              <div className="m-6 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs text-center font-bold">
                ✓ {updateSuccess}
              </div>
            )}

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              {/* Status Pipeline Selector */}
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Update Status Workflow *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as QuoteStatus)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-sky-300/30 text-white text-sm font-semibold focus:outline-none"
                >
                  <option value="New">1. New (Quote Request Received)</option>
                  <option value="Reviewing">2. Reviewing (Staff checking availability)</option>
                  <option value="Quotation Prepared">3. Quotation Prepared</option>
                  <option value="Sent">4. Sent to Customer</option>
                  <option value="Customer Confirmed">5. Customer Confirmed</option>
                  <option value="Closed">6. Closed / Completed</option>
                </select>
              </div>

              {/* Price Quote */}
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Quoted Price / Fee Estimate (e.g. $1,250 total or $650/person)
                </label>
                <input
                  type="text"
                  placeholder="e.g. $1,450 USD inclusive of taxes & baggage"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none"
                />
              </div>

              {/* Flight Options / Visa Document Checklist */}
              {selectedQuote.type === 'flight' && (
                <div>
                  <label className="block text-xs font-semibold text-sky-200 mb-1">
                    Flight Details & Airline Options
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Option 1: Emirates EK201 Nonstop - $1,450. Option 2: Qatar Airways QR812 - $1,290."
                    value={editFlightOptions}
                    onChange={(e) => setEditFlightOptions(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none"
                  />
                </div>
              )}

              {/* Staff Notes */}
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Staff Note / Message to Customer
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Hello Alex, we have locked in 2 seats with JAL. Please confirm by Friday to secure this rate."
                  value={editStaffNote}
                  onChange={(e) => setEditStaffNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none"
                />
              </div>

              {/* Save & Notify */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-7 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Update Status & Notify Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
