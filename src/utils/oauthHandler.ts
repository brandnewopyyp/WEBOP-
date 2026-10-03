// OAuth Integration helper for webop (Google & Discord)
// Follows AI Studio iframe-safe popup protocol

export const DEFAULT_GOOGLE_CLIENT_ID =
  '785341097976-rela4pq6o0acabtb64b54s802ejo64ou.apps.googleusercontent.com';

export const APP_CALLBACK_URL = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback.html`;

export function getStoredClientId(provider: 'google' | 'discord'): string {
  if (typeof window === 'undefined') return '';
  if (provider === 'google') {
    return (
      localStorage.getItem('webop_google_client_id') ||
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
      DEFAULT_GOOGLE_CLIENT_ID
    );
  } else {
    return (
      localStorage.getItem('webop_discord_client_id') ||
      (import.meta.env.VITE_DISCORD_CLIENT_ID as string) ||
      ''
    );
  }
}

export function saveStoredClientId(provider: 'google' | 'discord', clientId: string) {
  if (typeof window === 'undefined') return;
  if (provider === 'google') {
    localStorage.setItem('webop_google_client_id', clientId.trim());
  } else {
    localStorage.setItem('webop_discord_client_id', clientId.trim());
  }
}

export function buildOAuthUrl(provider: 'google' | 'discord', clientId: string): string {
  const redirectUri = APP_CALLBACK_URL;

  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
      state: `google_${Date.now()}`,
      prompt: 'select_account'
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  } else {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'identify email',
      state: `discord_${Date.now()}`
    });
    return `https://discord.com/oauth2/authorize?${params.toString()}`;
  }
}

export function openOAuthPopup(url: string): Window | null {
  const width = 580;
  const height = 680;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  return window.open(
    url,
    'webop_oauth_popup',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
  );
}

export async function processCallbackInApp(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.location.pathname.includes('/auth/callback')) return false;

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
  const state = searchParams.get('state') || hashParams.get('state') || '';

  const provider = state.includes('discord') ? 'discord' : 'google';
  let userInfo = null;

  if (accessToken) {
    try {
      if (provider === 'discord') {
        const res = await fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          userInfo = {
            id: data.id,
            name: data.global_name || data.username,
            username: data.username,
            email: data.email || `${data.username}@discord.gg`,
            avatar: data.avatar
              ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            provider: 'discord'
          };
        }
      } else {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          userInfo = {
            id: data.sub,
            name: data.name,
            username: (data.email ? data.email.split('@')[0] : data.name).toLowerCase().replace(/[^a-z0-9_]/g, ''),
            email: data.email,
            avatar: data.picture,
            provider: 'google'
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (window.opener) {
    window.opener.postMessage(
      {
        type: 'OAUTH_AUTH_SUCCESS',
        provider,
        user: userInfo
      },
      '*'
    );
    window.close();
    return true;
  }

  return false;
}
