import React, { useState, useEffect, useMemo } from 'react';
import { BudgetItem, ExpenseCategory, Itinerary, ItineraryBudget } from '../types';
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  PieChart,
  Filter,
  Download,
  Plane,
  Building,
  Ticket,
  Utensils,
  Car,
  ShoppingBag,
  ShieldCheck,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BudgetTrackerProps {
  itinerary: Itinerary;
  onUpdateItinerary?: (updatedItinerary: Itinerary) => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (৳)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit (RM)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (S$)' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht (฿)' },
];

const CATEGORIES: { name: ExpenseCategory; icon: any; color: string }[] = [
  { name: 'Flights', icon: Plane, color: 'text-sky-400 bg-sky-500/20 border-sky-400/30' },
  { name: 'Accommodation', icon: Building, color: 'text-purple-400 bg-purple-500/20 border-purple-400/30' },
  { name: 'Activities', icon: Ticket, color: 'text-amber-400 bg-amber-500/20 border-amber-400/30' },
  { name: 'Food & Dining', icon: Utensils, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-400/30' },
  { name: 'Transport', icon: Car, color: 'text-blue-400 bg-blue-500/20 border-blue-400/30' },
  { name: 'Shopping', icon: ShoppingBag, color: 'text-pink-400 bg-pink-500/20 border-pink-400/30' },
  { name: 'Visa & Insurance', icon: ShieldCheck, color: 'text-teal-400 bg-teal-500/20 border-teal-400/30' },
  { name: 'Miscellaneous', icon: MoreHorizontal, color: 'text-slate-300 bg-slate-500/20 border-slate-400/30' },
];

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  itinerary,
  onUpdateItinerary,
}) => {
  // Local storage key per itinerary
  const storageKey = `azraq_itinerary_budget_${itinerary.id || 'default'}`;

  // Default initial budget setup
  const getInitialBudget = (): ItineraryBudget => {
    if (itinerary.budget) return itinerary.budget;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    // Generate sensible defaults for new itinerary
    const days = itinerary.durationDays || itinerary.days?.length || 5;
    return {
      currency: 'USD',
      totalBudget: 1500,
      items: [
        {
          id: 'exp_1',
          name: `Round-trip Flights to ${itinerary.destination.split(',')[0]}`,
          category: 'Flights',
          estimatedCost: 650,
          isPaid: false,
          notes: 'Estimated economy fare with checked baggage',
        },
        {
          id: 'exp_2',
          name: `Hotel / Stay (${days} Nights)`,
          category: 'Accommodation',
          estimatedCost: days * 90,
          isPaid: false,
          notes: 'Standard 3/4-star central hotel accommodation',
        },
        {
          id: 'exp_3',
          name: `Daily Dining & Food (${days} Days)`,
          category: 'Food & Dining',
          estimatedCost: days * 40,
          isPaid: false,
          notes: 'Local meals, street food, and cafes',
        },
        {
          id: 'exp_4',
          name: 'Local Transport & Rail Passes',
          category: 'Transport',
          estimatedCost: 80,
          isPaid: false,
          notes: 'Subway, bus, and taxi transfers',
        },
      ],
    };
  };

  const [budget, setBudget] = useState<ItineraryBudget>(getInitialBudget);
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [tempTotalInput, setTempTotalInput] = useState(budget.totalBudget.toString());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form State for Adding / Editing Expense
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Activities');
  const [formCost, setFormCost] = useState('');
  const [formDayNumber, setFormDayNumber] = useState<number | undefined>(undefined);
  const [formSpotName, setFormSpotName] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formIsPaid, setFormIsPaid] = useState(false);

  // Sync with localStorage & parent on budget changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(budget));
      if (onUpdateItinerary) {
        onUpdateItinerary({
          ...itinerary,
          budget,
        });
      }
    } catch {}
  }, [budget]);

  // Currency helper
  const currentCurrencyObj =
    CURRENCIES.find((c) => c.code === budget.currency) || CURRENCIES[0];

  const formatMoney = (amount: number) => {
    return `${currentCurrencyObj.symbol}${amount.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  };

  // Calculations
  const totalEstimatedCost = useMemo(() => {
    return budget.items.reduce((acc, item) => acc + (Number(item.estimatedCost) || 0), 0);
  }, [budget.items]);

  const totalPaidCost = useMemo(() => {
    return budget.items
      .filter((item) => item.isPaid)
      .reduce((acc, item) => acc + (Number(item.estimatedCost) || 0), 0);
  }, [budget.items]);

  const remainingBudget = budget.totalBudget - totalEstimatedCost;
  const percentUsed =
    budget.totalBudget > 0
      ? Math.min(Math.round((totalEstimatedCost / budget.totalBudget) * 100), 200)
      : 0;

  // Category breakdown calculation
  const categoryBreakdown = useMemo(() => {
    const map = new Map<ExpenseCategory, number>();
    budget.items.forEach((item) => {
      map.set(item.category, (map.get(item.category) || 0) + (Number(item.estimatedCost) || 0));
    });
    return CATEGORIES.map((cat) => ({
      ...cat,
      total: map.get(cat.name) || 0,
      percentage: totalEstimatedCost > 0 ? Math.round(((map.get(cat.name) || 0) / totalEstimatedCost) * 100) : 0,
    })).filter((c) => c.total > 0);
  }, [budget.items, totalEstimatedCost]);

  // Handle Save Total Budget
  const handleSaveTotalBudget = () => {
    const val = parseFloat(tempTotalInput);
    if (!isNaN(val) && val >= 0) {
      setBudget((prev) => ({ ...prev, totalBudget: val }));
    }
    setIsEditingTotal(false);
  };

  // Handle Currency Change
  const handleCurrencyChange = (newCurr: string) => {
    setBudget((prev) => ({ ...prev, currency: newCurr }));
  };

  // Toggle Item Paid status
  const handleTogglePaid = (itemId: string) => {
    setBudget((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === itemId ? { ...it, isPaid: !it.isPaid } : it)),
    }));
  };

  // Delete Expense Item
  const handleDeleteItem = (itemId: string) => {
    setBudget((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== itemId),
    }));
  };

  // Open Edit Modal
  const handleStartEdit = (item: BudgetItem) => {
    setEditingItemId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormCost(item.estimatedCost.toString());
    setFormDayNumber(item.dayNumber);
    setFormSpotName(item.spotName || '');
    setFormNotes(item.notes || '');
    setFormIsPaid(!!item.isPaid);
    setShowAddModal(true);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setFormName('');
    setFormCategory('Activities');
    setFormCost('');
    setFormDayNumber(undefined);
    setFormSpotName('');
    setFormNotes('');
    setFormIsPaid(false);
    setShowAddModal(true);
  };

  // Submit Add / Edit Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(formCost);
    if (!formName.trim() || isNaN(cost) || cost < 0) return;

    if (editingItemId) {
      // Edit
      setBudget((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === editingItemId
            ? {
                ...it,
                name: formName.trim(),
                category: formCategory,
                estimatedCost: cost,
                dayNumber: formDayNumber,
                spotName: formSpotName.trim() || undefined,
                notes: formNotes.trim() || undefined,
                isPaid: formIsPaid,
              }
            : it
        ),
      }));
    } else {
      // Add
      const newItem: BudgetItem = {
        id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        name: formName.trim(),
        category: formCategory,
        estimatedCost: cost,
        dayNumber: formDayNumber,
        spotName: formSpotName.trim() || undefined,
        notes: formNotes.trim() || undefined,
        isPaid: formIsPaid,
      };
      setBudget((prev) => ({
        ...prev,
        items: [newItem, ...prev.items],
      }));
    }

    setShowAddModal(false);
  };

  // Auto-generate expenses from current itinerary spots & days
  const handleAutoGenerateFromItinerary = () => {
    if (!itinerary.days || itinerary.days.length === 0) return;

    const daysCount = itinerary.durationDays || itinerary.days.length;
    const generated: BudgetItem[] = [
      {
        id: `gen_flight_${Date.now()}`,
        name: `Airfare / Tickets to ${itinerary.destination.split(',')[0]}`,
        category: 'Flights',
        estimatedCost: 600,
        isPaid: false,
        notes: 'Estimated round-trip airfare',
      },
      {
        id: `gen_hotel_${Date.now()}`,
        name: `Hotel Booking (${daysCount} Nights in ${itinerary.destination.split(',')[0]})`,
        category: 'Accommodation',
        estimatedCost: daysCount * 110,
        isPaid: false,
        notes: 'Average 3-star to 4-star hotel stay',
      },
      {
        id: `gen_food_${Date.now()}`,
        name: `Meals & Dining (${daysCount} Days)`,
        category: 'Food & Dining',
        estimatedCost: daysCount * 45,
        isPaid: false,
        notes: 'Breakfast, lunches, and local dinners',
      },
      {
        id: `gen_transit_${Date.now()}`,
        name: `Local City Passes & Taxis`,
        category: 'Transport',
        estimatedCost: daysCount * 15,
        isPaid: false,
        notes: 'Metro, bus, and local rides',
      },
    ];

    // Add spots as activities
    itinerary.days.forEach((d) => {
      d.spots?.forEach((sp) => {
        generated.push({
          id: `gen_spot_${Math.random().toString(36).substring(2, 7)}`,
          name: `${sp.name} Entry & Tour`,
          category: 'Activities',
          estimatedCost: 25,
          dayNumber: d.dayNumber,
          spotName: sp.name,
          isPaid: false,
          notes: sp.description?.substring(0, 60) || 'Attraction visit',
        });
      });
    });

    const totalEst = generated.reduce((s, it) => s + it.estimatedCost, 0);

    setBudget((prev) => ({
      ...prev,
      totalBudget: Math.max(prev.totalBudget, totalEst + 200),
      items: generated,
    }));
  };

  // Filter items
  const filteredItems = budget.items.filter((item) => {
    const matchesCategory =
      selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.spotName && item.spotName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Export CSV summary
  const handleExportCSV = () => {
    const headers = ['Category', 'Item Name', 'Cost', 'Currency', 'Day', 'Paid Status', 'Notes'];
    const rows = budget.items.map((it) => [
      `"${it.category}"`,
      `"${it.name.replace(/"/g, '""')}"`,
      it.estimatedCost,
      budget.currency,
      it.dayNumber || 'General',
      it.isPaid ? 'Paid' : 'Pending',
      `"${(it.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Trip_Budget_${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Card: Top Metrics & Target Budget */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/15 shadow-2xl relative overflow-hidden flex flex-col gap-5">
        {/* Glow ambient background */}
        <div
          className={`absolute -top-12 -right-12 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
            remainingBudget < 0 ? 'bg-rose-500/15' : 'bg-primary/15'
          }`}
        ></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
                <DollarSign className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-serif-display text-lg sm:text-xl font-bold text-white">
                  Trip Budget & Expense Tracker
                </h3>
                <p className="text-xs text-sky-200/80">
                  Plan, allocate, and monitor costs for {itinerary.destination}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white">
              <span className="text-sky-300 font-semibold">Currency:</span>
              <select
                value={budget.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                aria-label="Select trip budget currency"
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Auto-Estimate Button */}
            <button
              onClick={handleAutoGenerateFromItinerary}
              className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Auto populate estimates from days & spots"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Auto-Estimate Trip</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Target Budget */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-2 relative group">
            <div className="flex items-center justify-between text-xs text-sky-200/80">
              <span>Target Budget</span>
              <button
                onClick={() => {
                  setTempTotalInput(budget.totalBudget.toString());
                  setIsEditingTotal(!isEditingTotal);
                }}
                className="text-primary hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Edit Target Budget"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {isEditingTotal ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={tempTotalInput}
                  onChange={(e) => setTempTotalInput(e.target.value)}
                  className="w-full bg-slate-900 border border-primary/50 text-white font-bold text-sm px-2.5 py-1 rounded-lg focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveTotalBudget}
                  className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                {formatMoney(budget.totalBudget)}
              </p>
            )}

            <span className="text-[11px] text-outline">
              Click edit icon to adjust ceiling
            </span>
          </div>

          {/* 2. Total Planned Expenses */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between text-xs text-sky-200/80">
              <span>Planned Expenses</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-sky-200">
                {budget.items.length} items
              </span>
            </div>

            <p className="font-serif-display text-2xl sm:text-3xl font-bold text-amber-300">
              {formatMoney(totalEstimatedCost)}
            </p>

            <div className="flex items-center justify-between text-[11px] text-outline">
              <span>Paid: <strong className="text-emerald-400 font-semibold">{formatMoney(totalPaidCost)}</strong></span>
              <span>Pending: <strong className="text-slate-200 font-semibold">{formatMoney(Math.max(0, totalEstimatedCost - totalPaidCost))}</strong></span>
            </div>
          </div>

          {/* 3. Remaining Balance */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between gap-2 ${
              remainingBudget < 0
                ? 'bg-rose-500/10 border-rose-400/40 text-rose-300'
                : 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-medium">
              <span>{remainingBudget < 0 ? 'Budget Deficit' : 'Remaining Balance'}</span>
              {remainingBudget < 0 ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              )}
            </div>

            <p className="font-serif-display text-2xl sm:text-3xl font-bold">
              {remainingBudget < 0
                ? `-${formatMoney(Math.abs(remainingBudget))}`
                : formatMoney(remainingBudget)}
            </p>

            <span className="text-[11px] font-semibold">
              {percentUsed}% of budget allocated
            </span>
          </div>
        </div>

        {/* Progress Bar & Status Chip */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-sky-200/90 font-medium">Expense Allocation</span>
            <div className="flex items-center gap-2">
              {percentUsed > 100 ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Over Budget by {percentUsed - 100}%
                </span>
              ) : percentUsed >= 85 ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Near Budget Ceiling ({percentUsed}%)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Healthy & On Track ({percentUsed}%)
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-3.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10 relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentUsed > 100
                  ? 'bg-rose-500 shadow-lg shadow-rose-500/50'
                  : percentUsed >= 85
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-400 to-primary'
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Badges */}
      {categoryBreakdown.length > 0 && (
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-sky-200 uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-primary" />
            <span>Category Spending Breakdown</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categoryBreakdown.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() =>
                    setSelectedCategoryFilter(
                      selectedCategoryFilter === cat.name ? 'All' : cat.name
                    )
                  }
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    selectedCategoryFilter === cat.name
                      ? 'bg-primary/20 border-primary shadow-md'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg border ${cat.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{cat.name}</p>
                    <div className="flex items-center justify-between text-[11px] text-sky-200/80">
                      <span>{formatMoney(cat.total)}</span>
                      <span className="text-outline font-medium">{cat.percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expenses Control Bar: Search, Category Filter, Add Expense & Export */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses or spots..."
              className="glass-input w-full py-2 pl-3 pr-8 rounded-xl text-xs text-white placeholder:text-outline"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            aria-label="Filter expenses by category"
            className="bg-slate-900/90 border border-white/15 text-white text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sky-200 hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="flex flex-col gap-2.5">
        {filteredItems.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3 border border-white/10">
            <DollarSign className="w-10 h-10 text-outline" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">No expenses found</p>
              <p className="text-xs text-outline">
                {searchTerm || selectedCategoryFilter !== 'All'
                  ? 'Try clearing the search or category filter.'
                  : 'Add your first expense or click "Auto-Estimate Trip" above.'}
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="mt-2 px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40 text-xs font-semibold transition-all"
            >
              + Add New Expense Item
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const catObj = CATEGORIES.find((c) => c.name === item.category) || CATEGORIES[7];
            const Icon = catObj.icon;

            return (
              <div
                key={item.id}
                className={`glass-card rounded-2xl p-3.5 sm:p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  item.isPaid
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Left info */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Paid status button */}
                  <button
                    onClick={() => handleTogglePaid(item.id)}
                    className="shrink-0 p-1 text-outline hover:text-emerald-400 transition-colors"
                    title={item.isPaid ? 'Mark as Pending' : 'Mark as Paid'}
                  >
                    {item.isPaid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div className={`p-2 rounded-xl border ${catObj.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h5
                        className={`text-xs sm:text-sm font-bold truncate ${
                          item.isPaid ? 'text-emerald-200' : 'text-white'
                        }`}
                      >
                        {item.name}
                      </h5>

                      {item.dayNumber && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                          Day {item.dayNumber}
                        </span>
                      )}

                      {item.spotName && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30 truncate max-w-[120px]">
                          📍 {item.spotName}
                        </span>
                      )}

                      {item.isPaid && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                          Paid ✓
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-outline mt-0.5 line-clamp-1">{item.notes}</p>
                    )}
                  </div>
                </div>

                {/* Right Cost & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold font-serif-display text-white">
                      {formatMoney(item.estimatedCost)}
                    </span>
                    <span className="text-[10px] text-outline block">{item.category}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-outline hover:text-white transition-colors"
                      title="Edit expense"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-outline hover:text-rose-400 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 border border-white/20 shadow-2xl relative">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
              <h3 className="font-serif-display text-lg font-bold text-white">
                {editingItemId ? 'Edit Expense Item' : 'Add New Expense Item'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-outline hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Expense Title / Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Kyoto Rail Pass / Fushimi Inari Ticket"
                  className="glass-input w-full p-2.5 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sky-200 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sky-200 mb-1">
                    Estimated Cost ({budget.currency}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    placeholder="e.g. 50"
                    className="glass-input w-full p-2.5 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sky-200 mb-1">
                    Associate with Day (Optional)
                  </label>
                  <select
                    value={formDayNumber || ''}
                    onChange={(e) =>
                      setFormDayNumber(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    className="w-full bg-slate-900 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="">General Trip Item</option>
                    {itinerary.days?.map((d) => (
                      <option key={d.dayNumber} value={d.dayNumber}>
                        Day {d.dayNumber} - {d.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sky-200 mb-1">
                    Spot Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formSpotName}
                    onChange={(e) => setFormSpotName(e.target.value)}
                    placeholder="e.g. Kinkaku-ji"
                    className="glass-input w-full p-2.5 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Notes & Details (Optional)
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Book in advance online for discount"
                  className="glass-input w-full p-2.5 rounded-xl text-xs text-white"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-sky-200 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formIsPaid}
                  onChange={(e) => setFormIsPaid(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-emerald-400 focus:ring-0"
                />
                <span>Already Paid / Booked</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-xs font-bold shadow-md"
                >
                  {editingItemId ? 'Update Expense' : 'Add to Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
