import React, { useState, useEffect } from 'react';
import { BlogPost, BlogCategory } from '../types';
import { useBlog } from '../context/BlogContext';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  Share2,
  Heart,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  Stamp,
  Plane,
  Award,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { SocialProofTicker } from './SocialProofTicker';

interface BlogViewProps {
  onNavigateToView?: (view: string) => void;
  onOpenFlightQuote?: () => void;
  onOpenVisaQuote?: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  onNavigateToView,
  onOpenFlightQuote,
  onOpenVisaQuote,
}) => {
  const {
    posts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activePost,
    setActivePost,
    likeBlogPost,
    isLoading,
  } = useBlog();

  const [copiedLink, setCopiedLink] = useState(false);

  // Set JSON-LD Schema for active article or blog list
  useEffect(() => {
    if (activePost) {
      const scriptId = 'json-ld-blog-post';
      let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: activePost.title,
        description: activePost.seoDescription || activePost.excerpt,
        image: activePost.coverImage,
        author: {
          '@type': 'Person',
          name: activePost.author.name,
          jobTitle: activePost.author.role,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Azraq Tours & Travels',
          logo: {
            '@type': 'ImageObject',
            url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
          },
        },
        datePublished: activePost.publishedAt,
        articleSection: activePost.category,
      };

      scriptTag.text = JSON.stringify(structuredData);
    }
  }, [activePost]);

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy', post: BlogPost) => {
    const url = window.location.href;
    const text = `${post.title} - Read on Azraq Tours & Travels:`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getCategoryColor = (category: BlogCategory) => {
    switch (category) {
      case 'Destination Guide':
        return 'bg-sky-500/20 text-sky-300 border-sky-400/30';
      case 'Visa Update':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
      case 'Client Spotlight':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
      case 'Travel Tips':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const remainingPosts = posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="w-full min-h-screen pt-20 md:pt-14 pb-24 text-on-surface">
      {/* Live Social Proof Activity Ticker */}
      <SocialProofTicker variant="ticker" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Azraq Travel Editorial & Knowledge Hub</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif-display font-bold text-white tracking-tight">
              Travel Inspiration & Visa Intelligence
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Curated destination guides, official consular visa updates for Bangladeshi passport holders, and real client journeys.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, visa rules, Bali..."
              className="w-full bg-white/5 border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary font-semibold shadow-lg shadow-primary/20 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {cat === 'All' && <BookOpen className="w-3.5 h-3.5" />}
              {cat === 'Destination Guide' && <Compass className="w-3.5 h-3.5" />}
              {cat === 'Visa Update' && <Stamp className="w-3.5 h-3.5" />}
              {cat === 'Client Spotlight' && <Award className="w-3.5 h-3.5" />}
              {cat === 'Travel Tips' && <Sparkles className="w-3.5 h-3.5" />}
              <span>{cat}</span>
              <span className="text-[10px] opacity-70 ml-1">
                ({cat === 'All' ? posts.length : posts.filter((p) => p.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Featured Story Hero Card (When in 'All' view and no search) */}
        {selectedCategory === 'All' && !searchQuery && featuredPost && (
          <div
            onClick={() => setActivePost(featuredPost)}
            className="group relative rounded-3xl overflow-hidden glass-card border border-white/20 shadow-2xl mb-12 cursor-pointer hover:border-primary/50 transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
              {/* Image side */}
              <div className="lg:col-span-7 relative h-72 lg:h-full overflow-hidden">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured Story
                  </span>
                </div>
              </div>

              {/* Text side */}
              <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between bg-slate-950/80 backdrop-blur-md">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${getCategoryColor(
                        featuredPost.category
                      )}`}
                    >
                      {featuredPost.category}
                    </span>
                    <span className="text-xs text-white/50 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-serif-display font-bold text-white group-hover:text-sky-300 transition-colors leading-tight mb-3">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Author & CTA */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-primary/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-sky-200/70">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Masonry Grid of Articles (Pinterest-Style Layout) */}
        {posts.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-3xl border border-white/10 my-8">
            <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No articles found</h3>
            <p className="text-xs text-slate-300 mt-1">Try searching for a different keyword or select another category.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {(selectedCategory === 'All' && !searchQuery ? remainingPosts : posts).map((post) => (
              <article
                key={post.id}
                onClick={() => setActivePost(post)}
                className="break-inside-avoid group rounded-3xl overflow-hidden glass-card border border-white/15 shadow-xl hover:border-sky-400/40 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md shadow-md ${getCategoryColor(
                        post.category
                      )}`}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-white/50 mb-2 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-serif-display font-bold text-white group-hover:text-sky-300 transition-colors leading-snug mb-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(post.tags || []).slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] text-sky-300/80 bg-white/5 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Author Box & Action */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/20"
                      />
                      <span className="text-[11px] font-medium text-slate-200 truncate max-w-[120px]">
                        {post.author.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Quick Quotation Promo Banner in Blog */}
        <div className="mt-16 rounded-3xl p-6 md:p-8 bg-gradient-to-r from-sky-900/60 via-indigo-900/40 to-slate-900/80 border border-sky-400/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready to Turn Inspiration into Reality?</span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif-display font-bold text-white">
              Get an Instant Wholesale Airfare or Visa Assessment
            </h3>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Azraq certified travel consultants check live IATA GDS systems to guarantee maximum savings and hassle-free embassy appointments.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenFlightQuote && (
              <button
                onClick={onOpenFlightQuote}
                className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Plane className="w-4 h-4" />
                Flight Quote
              </button>
            )}
            {onOpenVisaQuote && (
              <button
                onClick={onOpenVisaQuote}
                className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Stamp className="w-4 h-4" />
                Visa Quote
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Full-Screen Article Reader Modal with SEO & Author Card */}
      {/* ======================================================== */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
          onClick={() => setActivePost(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Sticky Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                    activePost.category
                  )}`}
                >
                  {activePost.category}
                </span>
                <span className="text-xs text-white/60 font-mono">{activePost.readTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => likeBlogPost(activePost.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-rose-300 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  <span>{activePost.likesCount || 0}</span>
                </button>

                <button
                  onClick={() => handleShare('whatsapp', activePost)}
                  className="p-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleShare('copy', activePost)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
                  title="Copy Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActivePost(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Reader Body */}
            <div className="overflow-y-auto p-6 sm:p-8 flex-1">
              {/* Featured Cover */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 shadow-xl border border-white/10">
                <img src={activePost.coverImage} alt={activePost.title} className="w-full h-full object-cover" />
              </div>

              {/* Title & Metadata */}
              <h1 className="text-2xl sm:text-4xl font-serif-display font-bold text-white leading-tight mb-4">
                {activePost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pb-6 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src={activePost.author.avatar}
                    alt={activePost.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-primary"
                  />
                  <span className="font-semibold text-white">{activePost.author.name}</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  {activePost.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  {activePost.viewsCount || 1} Views
                </span>
              </div>

              {/* Formatted Article Body */}
              <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
                {activePost.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-xl font-bold font-serif-display text-sky-300 mt-6 mb-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('#### ')) {
                    return (
                      <h4 key={pIdx} className="text-lg font-bold text-white mt-4 mb-2">
                        {paragraph.replace('#### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={pIdx} className="border-l-4 border-primary pl-4 py-1 italic text-slate-300 bg-white/5 rounded-r-xl my-4">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-slate-200">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 my-8 pt-4 border-t border-white/10">
                {(activePost.tags || []).map((tag, idx) => (
                  <span key={idx} className="text-xs text-sky-300 bg-sky-500/10 border border-sky-400/20 px-3 py-1 rounded-full font-mono">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author Box Card (Builds authority & trust) */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center gap-4 my-8">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/50 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{activePost.author.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-medium">
                      Author
                    </span>
                  </div>
                  <p className="text-xs text-sky-200/80 font-medium mb-1">{activePost.author.role}</p>
                  <p className="text-xs text-slate-300 leading-snug">
                    {activePost.author.bio || 'Certified travel specialist at Azraq Tours & Travels.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Reader */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-white">Need personal assistance for this trip?</p>
                  <p className="text-[11px] text-slate-300">Our desk provides wholesale flights, hotel bookings, and verified visa documents.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenFlightQuote && (
                    <button
                      onClick={() => {
                        setActivePost(null);
                        onOpenFlightQuote();
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-transform hover:scale-105"
                    >
                      Request Quote
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
