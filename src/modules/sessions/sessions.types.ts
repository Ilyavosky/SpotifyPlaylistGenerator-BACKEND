export interface Session {
  id: number;
  session_uuid: string;
  name: string;
  target_valence: number;
  target_energy: number;
  target_danceability: number;
  is_exported: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSessionInput {
  name: string;
  target_valence: number;
  target_energy: number;
  target_danceability: number;
  seed_genres: string[];
}