export type ReactionType = 'like' | 'love' | 'fire' | 'wow';

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url: string;
  bio?: string;
  created_at: string;
  is_verified?: boolean;
  role?: 'user' | 'admin' | 'moderator';
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  public_id?: string;
  width?: number;
  height?: number;
  thumbnail_url?: string;
}

export interface Post {
  id: string;
  user_id: string;
  location: string;
  caption: string;
  media_urls: string[];
  media_items?: MediaItem[];
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_approved: boolean;
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  // Hydrated user profile
  profile?: Profile;
  // Client state
  user_reaction?: ReactionType | null;
  reaction_counts?: Record<ReactionType, number>;
  is_saved?: boolean;
  hashtags?: string[];
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

export interface SavedPost {
  id: string;
  post_id: string;
  user_id: string;
  created_at?: string;
}

export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  expires_at: string;
  caption?: string;
  location?: string;
  profile?: Profile;
  seen?: boolean;
}

export interface TrendingDestination {
  name: string;
  country: string;
  postsCount: string;
  imageUrl: string;
}
