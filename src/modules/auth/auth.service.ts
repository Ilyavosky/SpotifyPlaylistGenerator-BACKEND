import axios from 'axios';
import crypto from 'crypto';
import { SpotifyTokenResponse} from './auth.types';
import { AppError } from '../../lib/errors/AppError';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

const SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email',
].join(' ');

export function generateAuthUrl(): { url: string; state: string } {
  const state = crypto.randomBytes(16).toString('hex');

  const params: Record<string, string> = { //Permisos que le pedimos al usuario de Spotify. Necesario para que la API de Spotify sepa que puede hacer con la cuenta del usuario.
  client_id: CLIENT_ID,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  state,
  scope: SCOPES,
};

  const url = `${SPOTIFY_AUTH_URL}?${new URLSearchParams(params).toString()}`;
  return { url, state };
}

export async function exchangeCode(code: string): Promise<SpotifyTokenResponse> {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const { data } = await axios.post<SpotifyTokenResponse>(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return data;
  } catch {
    throw new AppError('SPOTIFY_AUTH_ERROR', 'Error al obtener tokens de Spotify', 502);
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const { data } = await axios.post<SpotifyTokenResponse>(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return data;
  } catch {
    throw new AppError('SPOTIFY_REFRESH_ERROR', 'Error al renovar el token de Spotify', 502);
  }
}