import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
  Eye,
  User as UserIcon,
  Globe,
  Compass,
} from 'lucide-react';
import {
  TravelBuddyProfile,
  BuddyContactPreference,
  BuddyVisibility,
} from '../../types';
import {
  AVAILABLE_DESTINATIONS,
  AVAILABLE_TRAVEL_STYLES,
  AVAILABLE_LANGUAGES,
  validateBuddyProfile,
} from '../../lib/travelBuddyQueries';
import { useAuth } from '../../context/AuthContext';

interface TravelBuddyProfileEditorProps {
  existingProfile: TravelBuddyProfile | null;
  onSave: (profile: TravelBuddyProfile) => Promise<{ success: boolean; error?: string }>;
  onViewBuddiesTab: () => void;
}

export const TravelBuddyProfileEditor: React.FC<TravelBuddyProfileEditorProps> = ({
  existingProfile,
  onSave,
  onViewBuddiesTab,
}) => {
  const { user, isGuest, openAuthModal, showToast } = useAuth();

  const [displayName, setDisplayName] = useState(
    existingProfile?.displayName || user?.fullName || ''
  );
  const [avatarUrl, setAvatarUrl] = useState(
    existingProfile?.avatarUrl || user?.photoURL || ''
  );
  const [homeLocation, setHomeLocation] = useState(
    existingProfile?.homeLocation || user?.homeLocation || 'Dhaka, Bangladesh'
  );
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    existingProfile?.destinations || ['Bangkok']
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    existingProfile?.travelStyles || ['Food & Culture']
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    existingProfile?.languages || ['Bangla', 'English']
  );
  const [travelStart, setTravelStart] = useState(
    existingProfile?.travelStart || ''
  );
  const [travelEnd, setTravelEnd] = useState(existingProfile?.travelEnd || '');
  const [groupSize, setGroupSize] = useState<number>(
    existingProfile?.groupSize || 1
  );
  const [contactPreference, setContactPreference] =
    useState<BuddyContactPreference>(
      existingProfile?.contactPreference || 'WhatsApp'
    );
  const [visibility, setVisibility] = useState<BuddyVisibility>(
    existingProfile?.visibility || 'public'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (existingProfile) {
      setDisplayName(existingProfile.displayName);
      setAvatarUrl(existingProfile.avatarUrl || '');
      setHomeLocation(existingProfile.homeLocation || 'Dhaka, Bangladesh');
      setBio(existingProfile.bio || '');
      setSelectedDestinations(existingProfile.destinations || ['Bangkok']);
      setSelectedStyles(existingProfile.travelStyles || ['Food & Culture']);
      setSelectedLanguages(existingProfile.languages || ['Bangla', 'English']);
      setTravelStart(existingProfile.travelStart || '');
      setTravelEnd(existingProfile.travelEnd || '');
      setGroupSize(existingProfile.groupSize || 1);
      setContactPreference(existingProfile.contactPreference || 'WhatsApp');
      setVisibility(existingProfile.visibility || 'public');
    } else if (user) {
      if (!displayName && user.fullName) setDisplayName(user.fullName);
      if (!avatarUrl && user.photoURL) setAvatarUrl(user.photoURL);
      if (!homeLocation && user.homeLocation) setHomeLocation(user.homeLocation);
    }
  }, [existingProfile, user]);

  const toggleDestination = (dest: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuest || !user) {
      openAuthModal();
      showToast('Please sign in or create an account to save your Travel Buddy profile.', 'info');
      return;
    }

    const payload: Partial<TravelBuddyProfile> = {
      displayName: displayName.trim(),
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      homeLocation: homeLocation.trim(),
      bio: bio.trim(),
      destinations: selectedDestinations,
      travelStyles: selectedStyles,
      languages: selectedLanguages,
      travelStart: travelStart || undefined,
      travelEnd: travelEnd || undefined,
      groupSize,
      contactPreference,
      visibility,
      isActive: true,
    };

    const validation = validateBuddyProfile(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const fullProfile: TravelBuddyProfile = {
        id: user.uid,
        displayName: payload.displayName!,
        avatarUrl: payload.avatarUrl!,
        homeLocation: payload.homeLocation!,
        bio: payload.bio || '',
        destinations: payload.destinations!,
        travelStyles: payload.travelStyles!,
        languages: payload.languages!,
        travelStart: payload.travelStart,
        travelEnd: payload.travelEnd,
        groupSize: payload.groupSize!,
        contactPreference: payload.contactPreference!,
        visibility: payload.visibility!,
        isActive: true,
        createdAt: existingProfile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await onSave(fullProfile);
      if (result.success) {
        setSavedSuccess(true);
        showToast('Your Travel Buddy profile has been published successfully!', 'success');
        setTimeout(() => setSavedSuccess(false), 5000);
      } else {
        setErrors({ form: result.error || 'Failed to save profile.' });
      }
    } catch {
      setErrors({ form: 'An unexpected error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="travel-buddy-profile-editor" className="max-w-4xl mx-auto space-y-6">
      {/* Safety Compliance Alert */}
      <div className="flex items-start gap-3.5 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-xs dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="font-semibold block text-sm mb-0.5">
            Security & Privacy Rule
          </strong>
          Never publish passport numbers, ticket references, payment information, or other sensitive documents in your Travel Buddy profile or messages.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
            <UserIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Traveler Profile Information
            </h3>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-buddy-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Tanvir Hossain"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {errors.displayName && (
                <p className="mt-1 text-xs text-rose-600">{errors.displayName}</p>
              )}
            </div>

            {/* Home Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Home City / Country
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="input-buddy-home-location"
                  type="text"
                  value={homeLocation}
                  onChange={(e) => setHomeLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Profile Photo URL
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={
                    avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  }
                  alt="Preview"
                  className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <input
                  id="input-buddy-avatar-url"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                About Your Travel Vibes (Bio)
              </label>
              <textarea
                id="input-buddy-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={350}
                rows={3}
                placeholder="Share your travel interests, favorite food, typical pacing, or activities you'd like to share with a buddy..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>{errors.bio && <span className="text-rose-600">{errors.bio}</span>}</span>
                <span>{bio.length} / 350 characters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Plans & Destinations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
            <Compass className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Planned Destinations & Styles
            </h3>
          </div>

          {/* Destinations Selection */}
          <div className="mt-5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Destinations on Your Radar <span className="text-rose-500">*</span> (Click to toggle)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_DESTINATIONS.map((dest) => {
                const isSelected = selectedDestinations.includes(dest);
                return (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => toggleDestination(dest)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {dest}
                  </button>
                );
              })}
            </div>
            {errors.destinations && (
              <p className="mt-1.5 text-xs text-rose-600">{errors.destinations}</p>
            )}
          </div>

          {/* Travel Styles Selection */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Preferred Travel Styles
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TRAVEL_STYLES.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages Spoken */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Languages Spoken
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Dates & Party Logistics */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Earliest Departure
              </label>
              <input
                id="input-buddy-travel-start"
                type="date"
                value={travelStart}
                onChange={(e) => setTravelStart(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Latest Return
              </label>
              <input
                id="input-buddy-travel-end"
                type="date"
                value={travelEnd}
                onChange={(e) => setTravelEnd(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {errors.travelEnd && (
                <p className="mt-1 text-xs text-rose-600">{errors.travelEnd}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Party Size
              </label>
              <select
                id="select-buddy-group-size"
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value={1}>1 (Solo Traveler)</option>
                <option value={2}>2 Travelers</option>
                <option value={3}>3 Travelers</option>
                <option value={4}>4 Travelers (Family / Friends)</option>
                <option value={5}>5+ Group</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Contact Preferences */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
            <Globe className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Privacy & Contact Settings
            </h3>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Channel After Connecting
              </label>
              <select
                id="select-buddy-contact-pref"
                value={contactPreference}
                onChange={(e) =>
                  setContactPreference(e.target.value as BuddyContactPreference)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="In-app only">In-App Messages Only</option>
                <option value="Email">Email</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                Shared only with accepted connections.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Profile Visibility
              </label>
              <select
                id="select-buddy-visibility"
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as BuddyVisibility)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="public">Public (Visible to all travelers)</option>
                <option value="matches">Matches Only (Destination overlaps)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {errors.form && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            id="btn-view-buddies-hub"
            type="button"
            onClick={onViewBuddiesTab}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white min-h-[44px]"
          >
            ← Back to Find Buddies
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Profile Published!
              </span>
            )}
            <button
              id="btn-save-buddy-profile"
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-sky-500 active:scale-[0.99] disabled:opacity-50 min-h-[44px]"
            >
              {isSaving ? (
                <span>Publishing Profile...</span>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save & Publish Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
