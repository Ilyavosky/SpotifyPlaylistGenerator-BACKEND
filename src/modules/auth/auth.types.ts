export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface TokenPayload {
  access_token: string;
  expires_in: number;
}

export interface SpotifyAuthUrlParams {
  client_id: string;
  response_type: 'code';
  redirect_uri: string;
  state: string;
  scope: string;
}