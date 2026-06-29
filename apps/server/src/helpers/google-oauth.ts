import { requireEnv } from './require-env';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

type TGoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type TGoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

const getGoogleAuthUrl = (state: string, redirectUri: string) => {
  const url = new URL(GOOGLE_AUTH_URL);

  url.searchParams.set('client_id', requireEnv('GOOGLE_CLIENT_ID'));
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  url.searchParams.set('prompt', 'select_account');

  return url.toString();
};

const getGoogleAccessToken = async (code: string, redirectUri: string) => {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      client_id: requireEnv('GOOGLE_CLIENT_ID'),
      client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  const data = (await response.json()) as TGoogleTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description ?? data.error ?? 'Google login failed'
    );
  }

  return data.access_token;
};

const getGoogleUserInfo = async (accessToken: string) => {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google profile');
  }

  const userInfo = (await response.json()) as TGoogleUserInfo;

  if (!userInfo.email || !userInfo.email_verified) {
    throw new Error('Google account email must be verified');
  }

  return userInfo;
};

export { getGoogleAccessToken, getGoogleAuthUrl, getGoogleUserInfo };
export type { TGoogleUserInfo };
