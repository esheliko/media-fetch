const OAUTH_TOKEN_URL = "https://accounts.spotify.com/api/token";
const CLIENT_ID = "69a6c4582b67413b8089faedf2e2c081";
const CLIENT_SECRET = "885ef9b770e748c69914f2db7e39ca83";

type SpotifyToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
};

let current_token: SpotifyToken | null = null;

const safeJsonParse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const get_auth_headers = async () => {
  const token: string | null = await get_access_token();
  if (token === null) return null;
  return { Authorization: `Bearer ${token}` };
};

const get_access_token = async () => {
  if (current_token && !is_token_expired(current_token)) {
    return current_token.access_token;
  }

  const token_info = await request_access_token();
  current_token = token_info;
  if (token_info === null) return null;

  return token_info.access_token;
};

const request_access_token = async (): Promise<SpotifyToken | null> => {
  const payload = { grant_type: "client_credentials" };
  const auth_text = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const headers = { Authorization: `Basic ${btoa(auth_text)}` };

  const { fetch, Body, ResponseType } = await import("@tauri-apps/api/http");

  const response = await fetch<SpotifyToken>(OAUTH_TOKEN_URL, {
    method: "POST",
    responseType: ResponseType.JSON,
    body: Body.form(payload),
    headers: headers,
  });

  if (response.status !== 200) {
    console.error("Spotify Search Auth: ERROR:", response.data ?? response);
    return null;
  } else {
    const expires_at = get_expiry(response.data);
    return { ...response.data, expires_at } as SpotifyToken;
  }
};

const get_expiry = (token: SpotifyToken) =>
  new Date().getTime() + token.expires_in;

const is_token_expired = (token: SpotifyToken) =>
  token.expires_at - new Date().getTime() < 60;
