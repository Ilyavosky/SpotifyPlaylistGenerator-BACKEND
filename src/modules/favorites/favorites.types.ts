export interface Favorite {
  id: number;
  session_id: number;
  track_id: number;
  status: 'accepted' | 'rejected' | 'pending';
  added_at: Date;
  updated_at: Date;
}

export interface FavoriteWithDetails {
  id: number;
  session_id: number;
  track_id: number;
  status: string;
  track_name: string;
  track_uri: string;
  duration_ms: number;
  artist_name: string;
  album_name: string;
  cover_url: string;
}