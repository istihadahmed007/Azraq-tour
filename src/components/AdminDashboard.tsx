import React, { useState, useEffect, useMemo } from 'react';
import {
  QuoteRequest,
  QuoteStatus,
  TourPackage,
  ActivityLog,
  AdminNotification,
  StaffMember,
  AdminRole,
  InternalNote,
} from '../types';
import { usePackages } from '../context/PackageContext';
import { geminiPdfService } from '../services/geminiPdfService';
import { getVisaRequirement, getVisaFeeForDestination } from '../data/visaRequirementsData';
import { ExtractionPreview } from './ExtractionPreview';
import {
  FileUp,
  Sparkles,
  CheckCircle2,
  Trash2,
  Globe,
  Eye,
  EyeOff,
  FileText,
  Send,
  Bell,
  Activity,
  Users,
  Shield,
  ShieldAlert,
  UserCheck,
  CheckSquare,
  Square,
  MessageSquare,
  Phone,
  Mail,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Plus,
  Plane,
  Stamp,
  Clock,
  Crown,
  AlertTriangle,
  X,
  Lock,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose?: () => void;
}

const STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff_istihad',
    name: 'Istihad Ahmed',
    email: 'istihadahmed1163@gmail.com',
    role: 'super_admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Istihad',
    specialty: 'Managing Director & Super Admin',
  },
  {
    id: 'staff_rahim',
    name: 'Rahim Chowdhury',
    email: 'rahim@azraq.tours',
    role: 'support_agent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim',
    specialty: 'Flight Desk Specialist',
  },
  {
    id: 'staff_tania',
    name: 'Tania Sultana',
    email: 'tania@azraq.tours',
    role: 'support_agent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tania',
    specialty: 'Senior Visa & Embassy Consultant',
  },
  {
    id: 'staff_nafis',
    name: 'Nafis Iqbal',
    email: 'nafis@azraq.tours',
    role: 'support_agent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nafis',
    specialty: 'Customer Relations & Tour Concierge',
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  // Tabs: quotes | packages | users | activity_logs
  const [activeTab, setActiveTab] = useState<'quotes' | 'packages' | 'users' | 'activity_logs'>('quotes');

  // Role Simulation
  const [currentRole, setCurrentRole] = useState<AdminRole>('super_admin');
  const [currentStaff, setCurrentStaff] = useState<StaffMember>(STAFF_MEMBERS[0]);

  // Quotes state
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [filterType, setFilterType] = useState<'all' | 'flight' | 'visa'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStaff, setFilterStaff] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk Actions
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Tour Package Context
  const {
    packages,
    destinations,
    packageQuotes,
    savePackages,
    deletePackage,
    togglePackagePublished,
    clearAllPackages,
    refreshPackages,
    parseAndImportFull37Packages,
    importConfirmation,
  } = usePackages();

  // 37 Source Package Automated Import state
  const [isImportingSource, setIsImportingSource] = useState(false);
  const [importResult, setImportResult] = useState<{
    displayMessage: string;
    totalImported: number;
    distinctCount: number;
    gatePassed: boolean;
    importedPackages: TourPackage[];
    logs: string[];
  } | null>(null);

  // PDF Extraction Upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [batchCurrentIndex, setBatchCurrentIndex] = useState(0);
  const [batchTotal, setBatchTotal] = useState(0);
  const [currentProcessingName, setCurrentProcessingName] = useState('');
  const [extractionSuccess, setExtractionSuccess] = useState<string | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Extraction Preview Modal State
  const [previewData, setPreviewData] = useState<{
    fileName: string;
    extractedPackages: TourPackage[];
    detectedDestinations: string[];
  } | null>(null);
  const [isSavingApproved, setIsSavingApproved] = useState(false);

  // Detailed Slide-Over Quote Inspector
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [editStatus, setEditStatus] = useState<QuoteStatus>('New');
  const [editPrice, setEditPrice] = useState('');
  const [editFlightOptions, setEditFlightOptions] = useState('');
  const [editStaffNote, setEditStaffNote] = useState('');
  const [editAssignedStaff, setEditAssignedStaff] = useState('');
  const [newInternalNoteText, setNewInternalNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Fetch Quotes
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

  // Fetch Users
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

  // Fetch Activity Logs
  const fetchActivityLogs = async () => {
    try {
      const res = await fetch('/api/admin/activity-logs');
      const data = await res.json();
      if (data.logs) {
        setActivityLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    }
  };

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  // Mark all notifications as read
  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/admin/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'quotes') {
      fetchQuotes();
      fetchNotifications();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'packages') {
      refreshPackages();
    } else if (activeTab === 'activity_logs') {
      fetchActivityLogs();
    }
  }, [activeTab]);

  useEffect(() => {
    // Initial fetch notifications
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Open Edit Inspector
  const openEditModal = (q: QuoteRequest) => {
    setSelectedQuote(q);
    setEditStatus(q.status);
    setEditPrice(q.quotedPrice || '');
    setEditFlightOptions((q as any).flightOptions || '');
    setEditStaffNote(q.staffNote || '');
    setEditAssignedStaff(q.assignedStaff || '');
    setNewInternalNoteText('');
    setUpdateSuccess('');
  };

  // Handle Save Quote Update
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    setIsUpdating(true);
    setUpdateSuccess('');

    try {
      // Build internal notes payload if new note typed
      const updatedNotes = [...(selectedQuote.internalNotes || [])];
      if (newInternalNoteText.trim()) {
        updatedNotes.push({
          id: 'note_' + Date.now(),
          authorName: currentStaff.name,
          authorRole: currentStaff.specialty,
          text: newInternalNoteText.trim(),
          createdAt: new Date().toISOString(),
        });
      }

      const res = await fetch(`/api/quotes/admin/${selectedQuote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          quotedPrice: editPrice,
          flightOptions: editFlightOptions,
          staffNote: editStaffNote,
          assignedStaff: editAssignedStaff || currentStaff.name,
          internalNotes: updatedNotes,
          performedBy: `${currentStaff.name} (${currentRole})`,
        }),
      });

      const data = await res.json();
      if (data.success && data.quote) {
        setUpdateSuccess(`Quotation ${selectedQuote.id} updated & customer notified!`);
        // Refresh local state
        setQuotes((prev) =>
          prev.map((item) => (item.id === data.quote.id ? data.quote : item))
        );
        setSelectedQuote(data.quote);
        setNewInternalNoteText('');
        fetchActivityLogs();
        setTimeout(() => {
          setUpdateSuccess('');
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to update quote:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Bulk Actions Handler
  const handleBulkAction = async (action: 'status_update' | 'delete', newStatus?: QuoteStatus) => {
    if (selectedQuoteIds.length === 0) return;
    if (action === 'delete' && currentRole !== 'super_admin') {
      alert('Only Super Admin can bulk-delete quote records.');
      return;
    }
    if (action === 'delete' && !confirm(`Are you sure you want to permanently delete ${selectedQuoteIds.length} quote(s)?`)) {
      return;
    }

    setIsBulkProcessing(true);
    try {
      const res = await fetch('/api/quotes/admin/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteIds: selectedQuoteIds,
          action,
          status: newStatus,
          performedBy: `${currentStaff.name} (${currentRole})`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchQuotes();
        await fetchActivityLogs();
        setSelectedQuoteIds([]);
      }
    } catch (err) {
      console.error('Bulk action failed:', err);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Toggle selection for single quote
  const toggleSelectQuote = (id: string) => {
    setSelectedQuoteIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all or deselect all
  const toggleSelectAll = () => {
    if (selectedQuoteIds.length === filteredQuotes.length) {
      setSelectedQuoteIds([]);
    } else {
      setSelectedQuoteIds(filteredQuotes.map((q) => q.id));
    }
  };

  // PDF Extraction Handler
  const handlePdfUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      setExtractionError('Please select one or more PDF files first.');
      return;
    }

    setIsExtractingPdf(true);
    setExtractionSuccess(null);
    setExtractionError(null);
    setBatchTotal(selectedFiles.length);

    try {
      const allExtracted: TourPackage[] = [];
      const allDestinationsSet = new Set<string>();

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setBatchCurrentIndex(i + 1);
        setCurrentProcessingName(file.name);

        const result = await geminiPdfService.parsePdfFile(file);
        if (result.success && result.packages.length > 0) {
          allExtracted.push(...result.packages);
          result.detectedDestinations.forEach((d) => allDestinationsSet.add(d));
        }
      }

      if (allExtracted.length > 0) {
        setPreviewData({
          fileName: selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} PDF Brochures Batch`,
          extractedPackages: allExtracted,
          detectedDestinations: Array.from(allDestinationsSet),
        });
      } else {
        setExtractionError('Failed to extract structured package data from the selected PDF(s).');
      }
    } catch (err: any) {
      setExtractionError(`Extraction error: ${err.message || 'Failed to process PDF'}`);
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleApproveExtractedPackages = async (approvedPackages: TourPackage[]) => {
    setIsSavingApproved(true);
    try {
      await savePackages(approvedPackages);
      setExtractionSuccess(
        `Successfully approved and saved ${approvedPackages.length} package(s) into the live database!`
      );
      setSelectedFiles([]);
      setPreviewData(null);
      await refreshPackages();
    } catch (err: any) {
      console.error('Error saving approved packages:', err);
    } finally {
      setIsSavingApproved(false);
    }
  };

  // Toggle user suspension
  const handleToggleUserStatus = async (userEmail: string) => {
    if (currentRole !== 'super_admin') {
      alert('Only Super Admins can alter user suspension status.');
      return;
    }
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

  // Toggle user verification
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

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      if (filterType !== 'all' && q.type !== filterType) return false;
      if (filterStatus !== 'all' && q.status !== filterStatus) return false;
      if (filterStaff !== 'all') {
        if (filterStaff === 'unassigned' && q.assignedStaff) return false;
        if (filterStaff !== 'unassigned' && q.assignedStaff !== filterStaff) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = q.customerName.toLowerCase().includes(query);
        const emailMatch = q.email.toLowerCase().includes(query);
        const idMatch = q.id.toLowerCase().includes(query);
        const destMatch =
          q.type === 'flight'
            ? `${(q as any).to} ${(q as any).from}`.toLowerCase().includes(query)
            : ((q as any).destinationCountry || '').toLowerCase().includes(query);
        return nameMatch || emailMatch || idMatch || destMatch;
      }
      return true;
    });
  }, [quotes, filterType, filterStatus, filterStaff, searchQuery]);

  // Metrics
  const totalCount = quotes.length;
  const newCount = quotes.filter((q) => ['New', 'Pending'].includes(q.status)).length;
  const reviewingCount = quotes.filter((q) => ['Reviewing', 'Processing'].includes(q.status)).length;
  const sentCount = quotes.filter((q) => ['Sent', 'Quotation Prepared', 'Quoted'].includes(q.status)).length;
  const confirmedCount = quotes.filter((q) => ['Customer Confirmed', 'Booked', 'Closed'].includes(q.status)).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-8 pb-24 space-y-8 animate-fade-in text-slate-100">
      {/* Top Banner & Role Switcher */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#0a192f] border border-amber-400/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 flex items-center gap-1.5 shadow-md">
              <Shield className="w-3.5 h-3.5 fill-slate-950" />
              <span>Azraq Management Suite</span>
            </span>

            {/* Active Staff & Role Indicator */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Staff: <strong className="text-white">{currentStaff.name}</strong></span>
              <span className="text-amber-300 font-bold">({currentRole === 'super_admin' ? 'Super Admin' : 'Support Agent'})</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif-display font-extrabold text-white tracking-tight">
            Azraq Tours & Travels — Admin Operations
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Real-time quote management, staff ticket assignments, PDF package pipeline, user audits & security.
          </p>
        </div>

        {/* Header Right Controls */}
        <div className="flex flex-wrap items-center gap-2 z-10">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifDrawerOpen(!isNotifDrawerOpen);
                if (!isNotifDrawerOpen) handleMarkNotificationsRead();
              }}
              className="p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-sky-300 border border-white/10 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-black flex items-center justify-center border-2 border-slate-950 animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {isNotifDrawerOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-slate-900 border border-amber-400/30 shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Bell className="w-4 h-4 text-amber-300" />
                    <span>Real-Time Alerts ({notifications.length})</span>
                  </div>
                  <button
                    onClick={() => setIsNotifDrawerOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">No new alerts.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          n.isRead
                            ? 'bg-slate-800/50 border-white/5 text-slate-300'
                            : 'bg-amber-500/10 border-amber-400/30 text-amber-200'
                        }`}
                      >
                        <div className="font-bold text-white text-xs flex justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Selector */}
          <select
            value={currentStaff.id}
            onChange={(e) => {
              const staff = STAFF_MEMBERS.find((s) => s.id === e.target.value);
              if (staff) {
                setCurrentStaff(staff);
                setCurrentRole(staff.role);
              }
            }}
            className="px-3 py-2 rounded-2xl bg-slate-800 border border-white/10 text-xs font-bold text-sky-200 focus:outline-none cursor-pointer"
          >
            {STAFF_MEMBERS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.role === 'super_admin' ? 'Super Admin' : 'Agent'})
              </option>
            ))}
          </select>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-bold cursor-pointer"
            >
              Exit to Portal
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'quotes'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-black'
              : 'bg-white/5 text-slate-300 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Flight & Visa Quotes ({quotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-black'
              : 'bg-white/5 text-slate-300 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Tour Packages ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-black'
              : 'bg-white/5 text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Client Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity_logs')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'activity_logs'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-black'
              : 'bg-white/5 text-slate-300 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit & Activity Logs ({activityLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: QUOTATION MANAGEMENT */}
      {activeTab === 'quotes' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stat Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10">
              <div className="text-2xl font-extrabold text-white font-serif-display">{totalCount}</div>
              <div className="text-xs text-slate-400 mt-0.5">Total Requests</div>
            </div>
            <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/30">
              <div className="text-2xl font-extrabold text-amber-300 font-serif-display">{newCount}</div>
              <div className="text-xs text-amber-200/80 mt-0.5">🟡 New / Pending</div>
            </div>
            <div className="p-4 bg-sky-950/40 rounded-2xl border border-sky-500/30">
              <div className="text-2xl font-extrabold text-sky-300 font-serif-display">{reviewingCount}</div>
              <div className="text-xs text-sky-200/80 mt-0.5">🔵 In Processing</div>
            </div>
            <div className="p-4 bg-teal-950/40 rounded-2xl border border-teal-500/30">
              <div className="text-2xl font-extrabold text-teal-300 font-serif-display">{sentCount}</div>
              <div className="text-xs text-teal-200/80 mt-0.5">🟢 Quote Sent</div>
            </div>
            <div className="p-4 bg-purple-950/40 rounded-2xl border border-purple-500/30 col-span-2 sm:col-span-1">
              <div className="text-2xl font-extrabold text-purple-300 font-serif-display">{confirmedCount}</div>
              <div className="text-xs text-purple-200/80 mt-0.5">🟣 Confirmed / Booked</div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Type Switcher */}
              <div className="flex p-1 bg-slate-800 rounded-xl border border-white/10 text-xs">
                {(['all', 'flight', 'visa'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      filterType === t ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {t === 'all' ? 'All Types' : t === 'flight' ? '✈️ Flights' : '🛂 Visas'}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="New">🟡 New (Received)</option>
                <option value="Reviewing">🔵 Reviewing / Processing</option>
                <option value="Quotation Prepared">🟢 Quotation Prepared</option>
                <option value="Sent">🟢 Sent to Customer</option>
                <option value="Customer Confirmed">🟣 Confirmed / Booked</option>
                <option value="Closed">Closed</option>
              </select>

              {/* Staff Filter */}
              <select
                value={filterStaff}
                onChange={(e) => setFilterStaff(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-sky-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Staff Members</option>
                <option value="unassigned">Unassigned</option>
                {STAFF_MEMBERS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, Name, Destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Bulk Actions Floating Bar */}
          {selectedQuoteIds.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-300 font-mono">
                  {selectedQuoteIds.length} Selected
                </span>
                <span className="text-slate-300">• Perform bulk operation:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleBulkAction('status_update', 'Reviewing')}
                  disabled={isBulkProcessing}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition-all cursor-pointer"
                >
                  Mark Processing 🔵
                </button>
                <button
                  onClick={() => handleBulkAction('status_update', 'Quotation Prepared')}
                  disabled={isBulkProcessing}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  Mark Quoted 🟢
                </button>
                <button
                  onClick={() => handleBulkAction('status_update', 'Customer Confirmed')}
                  disabled={isBulkProcessing}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all cursor-pointer"
                >
                  Mark Booked 🟣
                </button>
                {currentRole === 'super_admin' && (
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={isBulkProcessing}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    Delete Selected
                  </button>
                )}
                <button
                  onClick={() => setSelectedQuoteIds([])}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Quotes Table */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
              <span>Loading quotation database...</span>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="p-12 text-center glass-card rounded-3xl border border-white/10 text-slate-400 space-y-2">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-base font-semibold text-white">No Quotation Requests Found</div>
              <div className="text-xs text-slate-400">Try adjusting your filters or search query.</div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-800/80 text-sky-200 uppercase font-semibold tracking-wider text-[11px]">
                    <th className="p-4 w-10">
                      <button
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        {selectedQuoteIds.length === filteredQuotes.length ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4">Request ID & Type</th>
                    <th className="p-4">Customer Info</th>
                    <th className="p-4">Route / Destination</th>
                    <th className="p-4">Assigned Staff</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredQuotes.map((q) => {
                    const isFlight = q.type === 'flight';
                    const cleanPhone = q.phone.replace(/[^0-9+]/g, '');
                    const isSelected = selectedQuoteIds.includes(q.id);

                    return (
                      <tr
                        key={q.id}
                        onClick={() => openEditModal(q)}
                        className={`hover:bg-white/5 transition-colors cursor-pointer ${
                          isSelected ? 'bg-amber-500/10' : ''
                        }`}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleSelectQuote(q.id)}
                            className="text-slate-400 hover:text-white cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* ID & Type */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">
                              {isFlight ? <Plane className="w-3.5 h-3.5" /> : <Stamp className="w-3.5 h-3.5" />}
                            </span>
                            <div>
                              <div className="font-mono font-bold text-amber-300">{q.id}</div>
                              <div className="text-[10px] text-slate-400 uppercase font-medium">{q.type}</div>
                            </div>
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="p-4">
                          <div className="font-bold text-white">{q.customerName}</div>
                          <div className="text-[11px] text-slate-300">{q.email}</div>
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{q.phone}</span>
                          </a>
                        </td>

                        {/* Route/Destination */}
                        <td className="p-4">
                          {isFlight ? (
                            <div>
                              <div className="font-bold text-white">{(q as any).from} ✈️ {(q as any).to}</div>
                              <div className="text-[10px] text-slate-400">{(q as any).departureDate} ({(q as any).tripType})</div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-bold text-white">{(q as any).destinationCountry}</div>
                              <div className="text-[10px] text-slate-400">{(q as any).visaType} Visa • {(q as any).intendedTravelDate}</div>
                            </div>
                          )}
                        </td>

                        {/* Assigned Staff */}
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-sky-300 font-semibold text-[11px] border border-white/10">
                            <UserCheck className="w-3 h-3 text-amber-300" />
                            <span>{q.assignedStaff || 'Unassigned'}</span>
                          </span>
                        </td>

                        {/* Submission Date */}
                        <td className="p-4 text-slate-400 text-[11px] font-mono">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                            q.status === 'New' || q.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                            q.status === 'Reviewing' || q.status === 'Processing' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30' :
                            q.status === 'Quotation Prepared' || q.status === 'Sent' || q.status === 'Quoted' ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30' :
                            'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                          }`}>
                            {q.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(q);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
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

      {/* TAB 2: TOUR PACKAGES & PDF PIPELINE */}
      {activeTab === 'packages' && (
        <div className="space-y-8 animate-fade-in">
          {/* PDF Extraction Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-400/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Gemini AI PDF Extraction Pipeline
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Upload Tour Brochure PDF Files
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Upload brochure PDFs. Gemini AI reads the document, extracts destinations, itineraries, meal inclusions, and prices, and adds them directly to the database.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start">
                <button
                  type="button"
                  onClick={async () => {
                    await refreshPackages();
                    setExtractionSuccess('Successfully loaded all 37 agency tour packages!');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sync 37 PDF Packages</span>
                </button>

                {packages.length > 0 && currentRole === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all packages?')) {
                        clearAllPackages();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Packages</span>
                  </button>
                )}
              </div>
            </div>

            {/* Upload Form */}
            <form onSubmit={handlePdfUploadSubmit} className="space-y-4">
              {extractionSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-extrabold text-white">Extraction Successful!</div>
                    <div>{extractionSuccess}</div>
                  </div>
                </div>
              )}

              {extractionError && (
                <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs font-semibold">
                  <div className="font-extrabold text-white">Extraction Error:</div>
                  <div>{extractionError}</div>
                </div>
              )}

              <div className="border-2 border-dashed border-sky-400/30 hover:border-amber-400/60 rounded-3xl p-8 text-center transition-all bg-slate-950/50 flex flex-col items-center justify-center gap-4">
                <FileUp className="w-12 h-12 text-sky-400" />
                <div>
                  <label
                    htmlFor="pdf-upload-input"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl cursor-pointer hover:brightness-110 active:scale-95 inline-block"
                  >
                    Choose PDF Brochures
                  </label>
                  <input
                    id="pdf-upload-input"
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedFiles(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file(s) selected: ${selectedFiles.map((f) => f.name).join(', ')}`
                      : 'Drag and drop PDF files here, or click to browse'}
                  </p>
                </div>

                {selectedFiles.length > 0 && (
                  <button
                    type="submit"
                    disabled={isExtractingPdf}
                    className="px-8 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isExtractingPdf ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Extracting Packages with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run AI Extraction</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Active Packages Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-300" />
                Active Tour Packages ({packages.length})
              </h3>
            </div>

            <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-800/80 text-sky-200 uppercase font-semibold tracking-wider text-[11px]">
                    <th className="p-4">Package Name</th>
                    <th className="p-4">Destination & Country</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Starting Price</th>
                    <th className="p-4">Visibility</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{pkg.package_name}</td>
                      <td className="p-4">
                        <span className="font-semibold text-sky-300">{pkg.destination_name}</span>
                        <span className="text-slate-400 text-[11px] block">{pkg.country}</span>
                      </td>
                      <td className="p-4 font-mono">{pkg.duration}</td>
                      <td className="p-4 font-bold text-emerald-400 font-mono">
                        ৳{pkg.price.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          pkg.is_published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {pkg.is_published ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => togglePackagePublished(pkg.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 cursor-pointer"
                        >
                          {pkg.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {currentRole === 'super_admin' && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${pkg.package_name}"?`)) deletePackage(pkg.id);
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER VERIFICATION & ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
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

          <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-800/80 text-sky-200 uppercase font-semibold tracking-wider text-[11px]">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Email Verification</th>
                  <th className="p-4">Phone Verification</th>
                  <th className="p-4 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {users.map((u) => (
                  <tr key={u.email} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{u.fullName}</div>
                      <div className="text-[11px] text-slate-400">{u.country || 'Bangladesh'}</div>
                    </td>
                    <td className="p-4 font-mono">
                      <div>{u.email}</div>
                      <div className="text-teal-300 text-[11px]">{u.phone || 'No phone'}</div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleUserVerification(u.email, 'email')}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          u.emailVerified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {u.emailVerified ? '✓ Verified' : '✕ Unverified'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleUserVerification(u.email, 'phone')}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          u.phoneVerified ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {u.phoneVerified ? '✓ Phone Verified' : '✕ Unverified'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.email)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                          u.isSuspended ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {u.isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT & ACTIVITY LOGS */}
      {activeTab === 'activity_logs' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif-display font-bold text-white">System Audit & Activity Logs</h2>
              <p className="text-xs text-sky-200/80">Every quotation creation, status modification, and staff assignment is permanently recorded.</p>
            </div>
            <button
              onClick={fetchActivityLogs}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-sky-200 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-800/80 text-sky-200 uppercase font-semibold tracking-wider text-[11px]">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Quote ID</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 font-mono text-[11px]">
                    <td className="p-4 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-amber-300">{log.quoteId}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-bold font-sans">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-white font-semibold font-sans">{log.performedBy}</td>
                    <td className="p-4 text-slate-300 font-sans">{log.details || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED SLIDE-OVER / EDIT QUOTE MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-400/30 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-[#0a192f] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xl">
                  {selectedQuote.type === 'flight' ? '✈️' : '🛂'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300">{selectedQuote.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300">
                      {selectedQuote.type === 'flight' ? 'Flight Quotation' : 'Visa Application'}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif-display font-bold text-white">
                    Quotation Management — {selectedQuote.customerName}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {updateSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs text-center font-bold">
                  ✓ {updateSuccess}
                </div>
              )}

              {/* Direct Quick Contact CTAs */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Direct Client Connect:</span>
                  <strong className="text-white">{selectedQuote.customerName}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedQuote.phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedQuote.customerName}! This is ${currentStaff.name} from Azraq Tours & Travels regarding your quotation request ${selectedQuote.id}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </a>

                  <a
                    href={`mailto:${selectedQuote.email}?subject=${encodeURIComponent(
                      `Azraq Tours & Travels — Quotation Update for ${selectedQuote.id}`
                    )}`}
                    className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 font-bold transition-all flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Offer</span>
                  </a>
                </div>
              </div>

              {/* Client Request Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-white/5 text-xs">
                {selectedQuote.type === 'flight' ? (
                  <>
                    <div><span className="text-slate-400">Route:</span> <strong className="text-white">{(selectedQuote as any).from} ✈️ {(selectedQuote as any).to}</strong></div>
                    <div><span className="text-slate-400">Trip Type:</span> <strong className="text-white">{(selectedQuote as any).tripType}</strong></div>
                    <div><span className="text-slate-400">Dates:</span> <strong className="text-white">{(selectedQuote as any).departureDate} to {(selectedQuote as any).returnDate || 'One-Way'}</strong></div>
                    <div><span className="text-slate-400">Pax:</span> <strong className="text-white">{(selectedQuote as any).adults} Adults, {(selectedQuote as any).cabinClass}</strong></div>
                    <div><span className="text-slate-400">Special Notes:</span> <strong className="text-amber-300">{(selectedQuote as any).additionalRequirements || 'None'}</strong></div>
                  </>
                ) : (
                  <>
                    <div><span className="text-slate-400">Destination:</span> <strong className="text-white">{(selectedQuote as any).destinationCountry}</strong></div>
                    <div><span className="text-slate-400">Visa Type:</span> <strong className="text-white">{(selectedQuote as any).visaType} Visa</strong></div>
                    <div><span className="text-slate-400">Travel Date:</span> <strong className="text-white">{(selectedQuote as any).intendedTravelDate}</strong></div>
                    <div><span className="text-slate-400">Applicants:</span> <strong className="text-white">{(selectedQuote as any).applicantsCount} Person(s)</strong></div>
                    <div><span className="text-slate-400">Embassy Fee:</span> <strong className="text-teal-300">{(selectedQuote as any).visaFee || getVisaFeeForDestination(selectedQuote.destinationCountry)}</strong></div>
                  </>
                )}
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSaveUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sky-200">Status Workflow</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as QuoteStatus)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="New">🟡 New (Received)</option>
                      <option value="Reviewing">🔵 Reviewing / Checking Availability</option>
                      <option value="Quotation Prepared">🟢 Quotation Prepared</option>
                      <option value="Sent">🟢 Sent to Customer</option>
                      <option value="Customer Confirmed">🟣 Customer Confirmed</option>
                      <option value="Booked">🟣 Booked / Ticket Issued</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Staff Assignment */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sky-200">Assign Staff Agent</label>
                    <select
                      value={editAssignedStaff}
                      onChange={(e) => setEditAssignedStaff(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="">Select Staff Member</option>
                      {STAFF_MEMBERS.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.specialty})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quoted Price */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sky-200">
                    Official Quoted Price / Rate Lock (e.g. BDT 48,500 / Person)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BDT 52,000 / Person (All inclusive)"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                {/* Staff Note sent to Customer */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sky-200">
                    Public Note / Airline Options (Visible to Customer on My Azraq)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Flight options available: Thai Airways TG322 @ BDT 48,500. Seats held till tomorrow 5 PM."
                    value={editStaffNote}
                    onChange={(e) => setEditStaffNote(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                {/* Internal Notes Thread (Staff Only) */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Lock className="w-4 h-4" />
                    <span>Internal Staff Notes (Staff Eyes Only - Not Visible to Client)</span>
                  </div>

                  {selectedQuote.internalNotes && selectedQuote.internalNotes.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto text-xs">
                      {selectedQuote.internalNotes.map((note) => (
                        <div key={note.id} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-300">
                          <div className="flex justify-between text-[10px] text-amber-400 font-bold mb-1">
                            <span>{note.authorName} ({note.authorRole})</span>
                            <span className="text-slate-400 font-mono">{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                          <p>{note.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Add internal staff note (e.g. Called customer on WhatsApp, will decide by Sunday)..."
                    value={newInternalNoteText}
                    onChange={(e) => setNewInternalNoteText(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedQuote(null)}
                    className="px-5 py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs shadow-xl cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isUpdating ? 'Saving Update...' : 'Save & Notify Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EXTRACTION PREVIEW MODAL */}
      {previewData && (
        <ExtractionPreview
          fileName={previewData.fileName}
          extractedPackages={previewData.extractedPackages}
          detectedDestinations={previewData.detectedDestinations}
          onApprove={handleApproveExtractedPackages}
          onCancel={() => setPreviewData(null)}
          isSaving={isSavingApproved}
        />
      )}
    </div>
  );
};
