import { supabase, isSupabaseConfigured } from './supabase';
import { Post, Comment, Reaction, SavedPost, Story, Profile, ReactionType } from './types';
import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
} from 'firebase/firestore';

const LOCAL_STORAGE_POSTS_KEY = 'azraq_travel_buddies_posts';
const LOCAL_STORAGE_SAVED_KEY = 'azraq_travel_buddies_saved';
const LOCAL_STORAGE_STORIES_KEY = 'azraq_travel_buddies_stories';

// Seed initial authentic Azraq Tour traveler community stories & posts if empty
export const INITIAL_COMMUNITY_STORIES: Story[] = [
  {
    id: 'story_azraq_official',
    user_id: 'azraq_official_id',
    media_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=75',
    media_type: 'image',
    caption: '🌴 Floating over the azure crystal lagoons in Maldives with Azraq VIP group!',
    location: 'Maldives • Azraq Tour Official',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    expires_at: new Date(Date.now() + 22 * 3600000).toISOString(),
    profile: {
      id: 'azraq_official_id',
      username: 'azraq_official',
      full_name: 'Azraq Tour Official',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=70',
      bio: 'Leading Travel & Tourism Concierge in Bangladesh',
      created_at: '2024-01-01',
      is_verified: true,
      role: 'admin',
    },
    seen: false,
  },
  {
    id: 'story_tanvir_sajek',
    user_id: 'user_tanvir',
    media_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75',
    media_type: 'image',
    caption: 'Morning sea of clouds above Sajek Valley ☁️ Helipad sunrise was unreal.',
    location: 'Sajek Valley, Bangladesh',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    expires_at: new Date(Date.now() + 19 * 3600000).toISOString(),
    profile: {
      id: 'user_tanvir',
      username: 'tanvir_explorer',
      full_name: 'Tanvir Ahmed',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=70',
      bio: 'Dhaka ➡️ Everywhere ✈️',
      created_at: '2024-03-10',
      is_verified: false,
    },
    seen: false,
  },
  {
    id: 'story_sadia_bali',
    user_id: 'user_sadia',
    media_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=75',
    media_type: 'image',
    caption: 'Hidden waterfalls in Ubud! Booked smoothly via Azraq Tour visa & flight assistance ✨',
    location: 'Ubud, Bali',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    expires_at: new Date(Date.now() + 16 * 3600000).toISOString(),
    profile: {
      id: 'user_sadia',
      username: 'sadia_travels',
      full_name: 'Sadia Rahman',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70',
      bio: 'Solo female traveler exploring SE Asia',
      created_at: '2024-02-15',
      is_verified: true,
    },
    seen: false,
  },
  {
    id: 'story_rahim_cox',
    user_id: 'user_rahim',
    media_url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=75',
    media_type: 'image',
    caption: 'Longest natural sea beach in the world. Cox’s Bazar sunset glow 🌅',
    location: 'Inani Beach, Cox’s Bazar',
    created_at: new Date(Date.now() - 11 * 3600000).toISOString(),
    expires_at: new Date(Date.now() + 13 * 3600000).toISOString(),
    profile: {
      id: 'user_rahim',
      username: 'rahim_lens',
      full_name: 'Rahim Chowdhury',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70',
      bio: 'Landscape & Travel Photographer',
      created_at: '2024-04-01',
      is_verified: false,
    },
    seen: false,
  },
];

export const INITIAL_COMMUNITY_POSTS: Post[] = [
  {
    id: 'post_1',
    user_id: 'azraq_official_id',
    location: 'Maafushi & Male, Maldives',
    caption: 'Crystal turquoise waters and private sandbank picnic on our 5D4N luxury Maldives package. Our travelers experienced manta ray snorkeling and sunset dolphin cruises! 🐬✨ #AzraqDiaries #MaldivesTravel #LuxuryTravel #TravelBuddies',
    media_urls: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=75',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=75',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=75',
    ],
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    likes_count: 42,
    comments_count: 9,
    is_approved: true,
    hashtags: ['#AzraqDiaries', '#MaldivesTravel', '#LuxuryTravel', '#TravelBuddies'],
    profile: {
      id: 'azraq_official_id',
      username: 'azraq_official',
      full_name: 'Azraq Tour Official',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=70',
      bio: 'Authorized Travel Agency in Dhaka. Curated Group & VIP Tours.',
      created_at: '2024-01-01',
      is_verified: true,
      role: 'admin',
    },
    reaction_counts: {
      love: 28,
      fire: 10,
      wow: 4,
      like: 0,
    },
  },
  {
    id: 'post_2',
    user_id: 'user_sadia',
    location: 'Tegalalang Rice Terrace, Ubud, Bali',
    caption: 'Waking up to this breathtaking green serenity in Ubud. Huge shoutout to Azraq Tour for processing my Indonesia Visa on Arrival documentation in just 48 hours without any hassle! 🌿🛵 #BaliDiaries #AzraqDiaries #SoutheastAsia #TravelBuddies',
    media_urls: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=75',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=75',
    ],
    created_at: new Date(Date.now() - 7 * 3600000).toISOString(),
    likes_count: 31,
    comments_count: 6,
    is_approved: true,
    hashtags: ['#BaliDiaries', '#AzraqDiaries', '#SoutheastAsia', '#TravelBuddies'],
    profile: {
      id: 'user_sadia',
      username: 'sadia_travels',
      full_name: 'Sadia Rahman',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70',
      bio: 'Solo female traveler & travel blogger',
      created_at: '2024-02-15',
      is_verified: true,
    },
    reaction_counts: {
      love: 19,
      fire: 8,
      wow: 4,
      like: 0,
    },
  },
  {
    id: 'post_3',
    user_id: 'user_tanvir',
    location: 'Cox’s Bazar Marine Drive, Bangladesh',
    caption: 'Cruising the scenic Marine Drive road between the rolling lush green hills on the left and roaring Bay of Bengal on the right! Pure magic during golden hour 🌅 #ExploreBangladesh #CoxsBazar #AzraqTours #BangladeshTravel',
    media_urls: [
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=75',
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=75',
    ],
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    likes_count: 54,
    comments_count: 12,
    is_approved: true,
    hashtags: ['#ExploreBangladesh', '#CoxsBazar', '#AzraqTours', '#BangladeshTravel'],
    profile: {
      id: 'user_tanvir',
      username: 'tanvir_explorer',
      full_name: 'Tanvir Ahmed',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=70',
      bio: 'Traveler & Drone Pilot',
      created_at: '2024-03-10',
      is_verified: false,
    },
    reaction_counts: {
      love: 30,
      fire: 18,
      wow: 6,
      like: 0,
    },
  },
  {
    id: 'post_4',
    user_id: 'user_rahim',
    location: 'Petronas Twin Towers, Kuala Lumpur, Malaysia',
    caption: 'Night view of the iconic Petronas Towers from the KLCC Park sky bridge. Street food at Jalan Alor right after was phenomenal 🍜🇲🇾 #MalaysiaTrulyAsia #KualaLumpur #AzraqDiaries #TravelBuddies',
    media_urls: [
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=75',
    ],
    created_at: new Date(Date.now() - 22 * 3600000).toISOString(),
    likes_count: 27,
    comments_count: 4,
    is_approved: true,
    hashtags: ['#MalaysiaTrulyAsia', '#KualaLumpur', '#AzraqDiaries', '#TravelBuddies'],
    profile: {
      id: 'user_rahim',
      username: 'rahim_lens',
      full_name: 'Rahim Chowdhury',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70',
      bio: 'Photographer & wanderer',
      created_at: '2024-04-01',
      is_verified: false,
    },
    reaction_counts: {
      love: 12,
      fire: 11,
      wow: 4,
      like: 0,
    },
  },
];

// Helper to extract hashtags from caption
export function extractHashtags(caption: string): string[] {
  const matches = caption.match(/#[a-zA-Z0-9_\u0980-\u09FF]+/g);
  return matches ? Array.from(new Set(matches)) : [];
}

/**
 * Fetch paginated approved posts
 */
export async function getPostsPage({
  limitCount = 10,
  cursorCreatedAt,
  filterHashtag,
  userId,
}: {
  limitCount?: number;
  cursorCreatedAt?: string;
  filterHashtag?: string;
  userId?: string;
} = {}): Promise<{ posts: Post[]; nextCursor?: string }> {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured) {
    try {
      let q = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(limitCount);

      if (cursorCreatedAt) {
        q = q.lt('created_at', cursorCreatedAt);
      }

      if (filterHashtag) {
        q = q.ilike('caption', `%${filterHashtag}%`);
      }

      const { data, error } = await q;

      if (!error && data && data.length > 0) {
        const posts: Post[] = data.map((row: any) => ({
          id: row.id,
          user_id: row.user_id,
          location: row.location || 'Global Explorer',
          caption: row.caption || '',
          media_urls: row.media_urls || [],
          created_at: row.created_at,
          likes_count: row.likes_count || 0,
          comments_count: row.comments_count || 0,
          is_approved: row.is_approved,
          profile: row.profiles
            ? {
                id: row.profiles.id,
                username: row.profiles.username,
                full_name: row.profiles.full_name,
                avatar_url: row.profiles.avatar_url,
                bio: row.profiles.bio,
                created_at: row.profiles.created_at,
                is_verified: row.profiles.is_verified,
              }
            : undefined,
          hashtags: extractHashtags(row.caption || ''),
        }));

        const nextCursor = posts.length === limitCount ? posts[posts.length - 1].created_at : undefined;
        return { posts, nextCursor };
      }
    } catch (err) {
      console.warn('Supabase query fallback:', err);
    }
  }

  // 2. Fallback to Firestore / Local Storage Cache
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    let allPosts: Post[] = saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;

    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(INITIAL_COMMUNITY_POSTS));
    }

    if (filterHashtag) {
      allPosts = allPosts.filter((p) =>
        p.caption.toLowerCase().includes(filterHashtag.toLowerCase())
      );
    }

    const approvedOnly = allPosts.filter((p) => p.is_approved);
    approvedOnly.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    let startIndex = 0;
    if (cursorCreatedAt) {
      const idx = approvedOnly.findIndex((p) => p.created_at === cursorCreatedAt);
      if (idx !== -1) startIndex = idx + 1;
    }

    const sliced = approvedOnly.slice(startIndex, startIndex + limitCount);
    const nextCursor = sliced.length === limitCount ? sliced[sliced.length - 1].created_at : undefined;

    return { posts: sliced, nextCursor };
  } catch (e) {
    return { posts: INITIAL_COMMUNITY_POSTS };
  }
}

/**
 * Fetch active Stories
 */
export async function getStories(): Promise<Story[]> {
  if (isSupabaseConfigured) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('stories')
        .select(`*, profiles:user_id (*)`)
        .gt('expires_at', now)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          user_id: row.user_id,
          media_url: row.media_url,
          media_type: row.media_type || 'image',
          caption: row.caption,
          location: row.location,
          created_at: row.created_at,
          expires_at: row.expires_at,
          profile: row.profiles,
          seen: false,
        }));
      }
    } catch (e) {
      console.warn('Stories Supabase query notice:', e);
    }
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_STORIES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return INITIAL_COMMUNITY_STORIES;
}

/**
 * Create a new Post
 * Default is_approved = false (Post Moderation requirement)
 */
export async function createPost({
  userId,
  userProfile,
  location,
  caption,
  mediaUrls,
  isAdmin = false,
}: {
  userId: string;
  userProfile: Profile;
  location: string;
  caption: string;
  mediaUrls: string[];
  isAdmin?: boolean;
}): Promise<{ success: boolean; post?: Post; error?: string }> {
  // If admin/owner, auto-approve; normal users go to moderation review
  const isApproved = isAdmin;

  const newPost: Post = {
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    user_id: userId,
    location: location.trim() || 'Global Explorer',
    caption: caption.trim(),
    media_urls: mediaUrls,
    created_at: new Date().toISOString(),
    likes_count: 0,
    comments_count: 0,
    is_approved: isApproved,
    profile: userProfile,
    hashtags: extractHashtags(caption),
    reaction_counts: { love: 0, fire: 0, wow: 0, like: 0 },
  };

  // 1. Write to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      await supabase.from('posts').insert([
        {
          id: newPost.id,
          user_id: userId,
          location: newPost.location,
          caption: newPost.caption,
          media_urls: newPost.media_urls,
          is_approved: isApproved,
          created_at: newPost.created_at,
        },
      ]);
    } catch (e) {
      console.warn('Supabase post insert notice:', e);
    }
  }

  // 2. Also write to local storage cache
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    const posts: Post[] = saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
    posts.unshift(newPost);
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {}

  return { success: true, post: newPost };
}

/**
 * Add / Toggle reaction
 */
export async function togglePostReaction({
  postId,
  userId,
  reactionType,
  currentReaction,
}: {
  postId: string;
  userId: string;
  reactionType: ReactionType;
  currentReaction?: ReactionType | null;
}): Promise<{ newReaction: ReactionType | null; likesDelta: number }> {
  const isRemoving = currentReaction === reactionType;
  const newReaction = isRemoving ? null : reactionType;
  const likesDelta = isRemoving ? -1 : currentReaction ? 0 : 1;

  if (isSupabaseConfigured) {
    try {
      if (isRemoving) {
        await supabase
          .from('reactions')
          .delete()
          .match({ post_id: postId, user_id: userId });
      } else {
        await supabase.from('reactions').upsert([
          {
            post_id: postId,
            user_id: userId,
            reaction_type: reactionType,
          },
        ]);
      }
    } catch (e) {
      console.warn('Supabase reaction error:', e);
    }
  }

  return { newReaction, likesDelta };
}

/**
 * Fetch Comments for a Post
 */
export async function getComments(postId: string): Promise<Comment[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`*, profiles:user_id (*)`)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          post_id: row.post_id,
          user_id: row.user_id,
          content: row.content,
          created_at: row.created_at,
          profile: row.profiles,
        }));
      }
    } catch (e) {}
  }

  // Fallback initial comments
  return [
    {
      id: `comm_${postId}_1`,
      post_id: postId,
      user_id: 'user_sadia',
      content: 'This looks stunning! How many days in advance should we book with Azraq Tour?',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      profile: {
        id: 'user_sadia',
        username: 'sadia_travels',
        full_name: 'Sadia Rahman',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70',
        bio: 'Solo traveler',
        created_at: '2024-02-15',
        is_verified: true,
      },
    },
    {
      id: `comm_${postId}_2`,
      post_id: postId,
      user_id: 'azraq_official_id',
      content: 'Hello Sadia! For Maldives and Bali, 10–14 days in advance is ideal for the best flight & resort rates.',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      profile: {
        id: 'azraq_official_id',
        username: 'azraq_official',
        full_name: 'Azraq Tour Official',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=70',
        bio: 'Official Support',
        created_at: '2024-01-01',
        is_verified: true,
      },
    },
  ];
}

/**
 * Add Comment to a Post
 */
export async function createComment({
  postId,
  userId,
  userProfile,
  content,
}: {
  postId: string;
  userId: string;
  userProfile: Profile;
  content: string;
}): Promise<Comment> {
  const newComment: Comment = {
    id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    post_id: postId,
    user_id: userId,
    content: content.trim(),
    created_at: new Date().toISOString(),
    profile: userProfile,
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('comments').insert([
        {
          id: newComment.id,
          post_id: postId,
          user_id: userId,
          content: newComment.content,
          created_at: newComment.created_at,
        },
      ]);
    } catch (e) {}
  }

  return newComment;
}

/**
 * Toggle Save / Bookmark
 */
export async function toggleSavePost({
  postId,
  userId,
  isCurrentlySaved,
}: {
  postId: string;
  userId: string;
  isCurrentlySaved: boolean;
}): Promise<boolean> {
  const newSavedState = !isCurrentlySaved;

  if (isSupabaseConfigured) {
    try {
      if (isCurrentlySaved) {
        await supabase.from('saved_posts').delete().match({ post_id: postId, user_id: userId });
      } else {
        await supabase.from('saved_posts').upsert([{ post_id: postId, user_id: userId }]);
      }
    } catch (e) {}
  }

  return newSavedState;
}
