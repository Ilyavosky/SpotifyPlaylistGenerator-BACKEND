export interface RecommendationParams {
  target_valence: number;
  target_energy: number;
  target_danceability: number;
  seed_genres: string[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  album: {
    id: string;
    name: string;
    release_date: string;
    images: { url: string }[];
  };
  artists: {
    id: string;
    name: string;
  }[];
}

export interface SpotifyRecommendationsResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface SavedTrack {
  id: number;
  spotify_id: string;
  name: string;
  uri: string;
  duration_ms: number;
  valence: number;
  energy: number;
  danceability: number;
}