export interface SpotifyCreatePlaylistResponse {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

export interface SavedPlaylist {
  session_id: number;
  spotify_playlist_id: string;
  name: string;
  spotify_url: string;
}