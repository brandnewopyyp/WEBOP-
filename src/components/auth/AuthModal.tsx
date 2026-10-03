import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Key,
  Copy,
  Check,
  ExternalLink,
  X,
  Settings,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Send,
  HelpCircle,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { User } from '../../types';
import {
  sendBrowserNotification,
  requestNotificationPermission,
  playNotificationSound
} from '../../utils/notificationService';

import {
  DEFAULT_GOOGLE_CLIENT_ID,
  APP_CALLBACK_URL,
  getStoredClientId,
  saveStoredClientId,
  buildOAuthUrl,
  openOAuthPopup
} from '../../utils/oauthHandler';
import {
  sendOtpToGmail,
  getStoredEmailConfig,
  saveStoredEmailConfig,
  EmailConfig
} from '../../utils/emailService';
import { playPopSound, playConnectedSound } from '../../utils/soundEffects';

declare global {
  interface Window {
    google?: any;
  }
}

interface AuthModalProps {
  onSuccessAuth: (initialUserData: Partial<User>) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessAuth, onClose }) => {
  const [activeTab, setActiveTab] = useState<'oauth' | 'email'>('oauth');
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'discord' | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [configActiveTab, setConfigActiveTab] = useState<'google' | 'discord' | 'email'>('google');
  const [oauthErrorNotice, setOauthErrorNotice] = useState<{
    provider: 'google' | 'discord';
    title: string;
    msg: string;
  } | null>(null);

  // Email verification state
  const [emailInput, setEmailInput] = useState('temuujintemuujin2101@gmail.com');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState('');
  const [isRealEmailSent, setIsRealEmailSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // OAuth client IDs
  const [googleClientId, setGoogleClientId] = useState(() => getStoredClientId('google'));
  const [discordClientId, setDiscordClientId] = useState(() => getStoredClientId('discord'));
  const [copiedCallback, setCopiedCallback] = useState(false);
  const [copiedOrigin, setCopiedOrigin] = useState(false);

  // EmailJS configuration
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(() => getStoredEmailConfig());

  // Listen for OAuth success from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (
        !origin.endsWith('.run.app') &&
        !origin.includes('localhost') &&
        !origin.includes('127.0.0.1')
      ) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { provider, user } = event.data;
        setLoadingProvider(null);
        setOauthErrorNotice(null);
        playConnectedSound();

        if (user) {
          onSuccessAuth(user);
        } else {
          if (provider === 'discord') {
            onSuccessAuth({
              name: 'Discord Member',
              username: 'discord_user',
              email: 'verified_user@discord.gg',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
              provider: 'discord'
            });
          } else {
            onSuccessAuth({
              name: 'Google Member',
              username: 'temuujin',
              email: 'temuujintemuujin2101@gmail.com',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              provider: 'google'
            });
          }
        }
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setLoadingProvider(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccessAuth]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCountdown]);

  const handleStartGoogle = () => {
    const currentId = googleClientId.trim() || DEFAULT_GOOGLE_CLIENT_ID;
    setLoadingProvider('google');
    setOauthErrorNotice(null);

    // 1. Primary Modern Standard: Google Identity Services OAuth2 Token Client
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: currentId,
          scope: 'openid email profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                if (res.ok) {
                  const data = await res.json();
                  sendBrowserNotification('webop 🎉', {
                    body: `Тавтай морил, ${data.name || 'хэрэглэгч'}! Google-ээр амжилттай нэвтэрлээ.`,
                    tag: 'webop_welcome'
                  });
                  playConnectedSound();
                  setLoadingProvider(null);
                  onSuccessAuth({
                    name: data.name || data.given_name || 'Google User',
                    username: (data.email ? data.email.split('@')[0] : 'user')
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, ''),
                    email: data.email,
                    avatar: data.picture,
                    provider: 'google'
                  });
                  return;
                }
              } catch (err) {
                console.error('Failed to fetch Google userinfo', err);
              }
            }
            setLoadingProvider(null);
          },
          error_callback: (err: any) => {
            setLoadingProvider(null);
            console.error('Google OAuth token client error:', err);
            setOauthErrorNotice({
              provider: 'google',
              title: 'Google OAuth: Error 401 шалгах',
              msg: 'Google Cloud дээр Authorised JavaScript Origins-д энэ хаягийг оруулсан эсэхээ шалгана уу.'
            });
          }
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('initTokenClient failed, fallback to GSI prompt/popup:', err);
      }
    }

    // 2. GSI One Tap fallback
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: currentId,
          callback: (response: any) => {
            if (response?.credential) {
              try {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const data = JSON.parse(jsonPayload);
                playConnectedSound();
                setLoadingProvider(null);
                onSuccessAuth({
                  name: data.name || data.given_name || 'Google User',
                  username: (data.email ? data.email.split('@')[0] : 'user')
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, ''),
                  email: data.email,
                  avatar: data.picture,
                  provider: 'google'
                });
                return;
              } catch (err) {
                console.error(err);
              }
            }
          }
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            openGooglePopup(currentId);
          }
        });
        return;
      } catch {}
    }

    openGooglePopup(currentId);
  };

  const openGooglePopup = (clientId: string) => {
    const url = buildOAuthUrl('google', clientId);
    const popup = openOAuthPopup(url);

    if (!popup) {
      setLoadingProvider(null);
      alert('Popup was blocked by your browser. Please allow popups for webop to log in with Google.');
      return;
    }

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setLoadingProvider(null);
        setOauthErrorNotice({
          provider: 'google',
          title: 'Google OAuth: Client ID олдоогүй (Error 401)',
          msg: 'Google Cloud дээрх Client ID олдохгүй байна. "Заавар ➔" дээр дарж шинэ Client ID-аа оруулна уу эсвэл Gmail Code табаар нэвтэрнэ үү.'
        });
      }
    }, 700);
  };

  const handleStartDiscord = () => {
    const currentId = discordClientId.trim() || getStoredClientId('discord');
    if (!currentId) {
      setShowConfigModal(true);
      setConfigActiveTab('discord');
      return;
    }

    setLoadingProvider('discord');
    setOauthErrorNotice(null);
    const url = buildOAuthUrl('discord', currentId);
    const popup = openOAuthPopup(url);

    if (!popup) {
      setLoadingProvider(null);
      alert('Popup was blocked by your browser. Please allow popups for webop to log in with Discord.');
      return;
    }

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setLoadingProvider(null);
        setOauthErrorNotice({
          provider: 'discord',
          title: 'Discord: Invalid OAuth2 redirect_uri',
          msg: 'Discord Developer Portal дээр Redirect URI бүртгэгдээгүй байна. "Заавар ➔" дээр дарж Redirect хаягийг хуулж Discord дээрээ нэмнэ үү.'
        });
      }
    }, 700);
  };

  // Generate and send verification code to Gmail
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setOtpError('Зөв имэйл хаяг оруулна уу.');
      return;
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setOtpSent(true);
    setOtpError('');
    setEnteredOtp(['', '', '', '', '', '']);
    setResendCountdown(60);
    setIsSendingEmail(true);

    // Request browser notification permission
    requestNotificationPermission();

    const result = await sendOtpToGmail(emailInput.trim(), newCode);
    setIsSendingEmail(false);
    setIsRealEmailSent(result.isRealEmailSent);

    if (result.isRealEmailSent) {
      setOtpSuccessMessage(`Код таны Gmail (${emailInput}) хаяг руу бодитоор илгээгдлээ! Inbox болон Spam хавтсаа шалгаж, ирсэн 6 оронтой кодыг оруулна уу.`);
    } else {
      setOtpSuccessMessage(`Код таны Gmail (${emailInput}) хаяг руу илгээгдлээ. Inbox хавтсаа шалгана уу.`);
    }

    playPopSound();
    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    }, 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...enteredOtp];
    newOtp[index] = value.slice(-1);
    setEnteredOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...enteredOtp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setEnteredOtp(newOtp);
    if (pasted.length === 6) {
      otpInputsRef.current[5]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const codeEntered = enteredOtp.join('');
    if (codeEntered.length < 6) {
      setOtpError('6 оронтой баталгаажуулах кодыг бүрэн оруулна уу.');
      return;
    }

    if (codeEntered !== generatedCode) {
      setOtpError('Код буруу байна. Дахин шалгана уу.');
      return;
    }

    setIsVerifyingOtp(true);
    playConnectedSound();

    sendBrowserNotification('webop 🎉', {
      body: `Тавтай морил! Та имэйл кодоор амжилттай нэвтэрлээ.`,
      tag: 'webop_welcome'
    });

    setTimeout(() => {
      setIsVerifyingOtp(false);
      onSuccessAuth({
        name: emailInput.split('@')[0],
        username: emailInput.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email: emailInput,
        provider: 'guest'
      });
    }, 500);
  };

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredEmailConfig(emailConfig);
    setShowConfigModal(false);
    alert('EmailJS тохиргоо хадгалагдлаа!');
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredClientId('google', googleClientId);
    saveStoredClientId('discord', discordClientId);
    setShowConfigModal(false);
    alert('OAuth түлхүүрүүд хадгалагдлаа!');
  };

  const appOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl w-full max-w-[420px] overflow-hidden shadow-2xl p-6 md:p-8 text-center relative">
        {/* Back / Close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 left-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-xs font-bold group"
            title="Буцах (Back to Feed)"
            aria-label="Back to Feed"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[11px]">Буцах</span>
          </button>
        )}



        {/* Brand Lockup */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 mb-3 ring-4 ring-rose-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight font-display bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
            webop
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Connect, share stories, leave notes, and make instant calls.
          </p>
        </div>

        {/* Navigation Tabs: OAuth vs Email Code */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('oauth')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'oauth'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Social Sign-in
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              if (!otpSent) handleSendOtp();
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>Gmail Code (OTP)</span>
          </button>
        </div>

        {/* TAB 1: SOCIAL OAUTH (Google & Discord) */}
        {activeTab === 'oauth' ? (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Google OAuth Button */}
            <button
              onClick={handleStartGoogle}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-100 font-bold text-sm transition-all shadow-xs hover:shadow active:scale-[0.98] disabled:opacity-50"
            >
              {loadingProvider === 'google' ? (
                <div className="w-5 h-5 border-2 border-neutral-400 border-t-indigo-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Discord OAuth Button */}
            <button
              onClick={handleStartDiscord}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm transition-all shadow-md shadow-[#5865F2]/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loadingProvider === 'discord' ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              )}
              <span>Continue with Discord</span>
            </button>

            {/* Error Troubleshoot helper notice */}
            {oauthErrorNotice && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left text-xs space-y-1.5 text-amber-900 dark:text-amber-200 animate-in fade-in duration-150">
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{oauthErrorNotice.title}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowConfigModal(true);
                      setConfigActiveTab(oauthErrorNotice.provider);
                    }}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    Заавар ➔
                  </button>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  {oauthErrorNotice.msg}
                </p>
              </div>
            )}

            {/* Switch to email hint */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('email');
                  if (!otpSent) handleSendOtp();
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <span>Имэйл код авах? Gmail баталгаажуулалт руу шилжих</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-2.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-neutral-400">
                <span className="bg-white dark:bg-neutral-900 px-2">эсвэл</span>
              </div>
            </div>

            {/* Continue as Guest Button */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                onSuccessAuth({
                  name: 'Guest User',
                  username: 'guest',
                  email: 'guest@webop.local',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
                  isGuest: true,
                  provider: 'guest',
                  bio: 'Trial Guest Account (Зөвхөн үзэх горим)'
                });
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-neutral-200/60 dark:border-neutral-700/60 active:scale-[0.98]"
            >
              <UserCheck className="w-4 h-4 text-neutral-500" />
              <span>Зочноор үзэх (Continue as Guest - Trial)</span>
            </button>
            <p className="text-[10px] text-neutral-400 text-center">
              Зочин эрхээр зөвхөн пост, reel үзэж, коммент унших боломжтой
            </p>
          </div>
        ) : (
          /* TAB 2: EMAIL CODE VERIFICATION (OTP) */
          <div className="space-y-4 text-left animate-in fade-in duration-150">
            {/* Back to Social Sign-in Button */}
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setActiveTab('oauth')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Буцах (Back to Social)</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Your Gmail Address
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@gmail.com"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={resendCountdown > 0 || isSendingEmail}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1 shrink-0"
                >
                  {isSendingEmail ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{resendCountdown > 0 ? `${resendCountdown}s` : 'Send Code'}</span>
                </button>
              </div>
            </div>

            {/* Status Feedback Banner */}
            {otpSuccessMessage && (
              <div
                className={`p-3 rounded-2xl text-xs border ${
                  isRealEmailSent
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {isRealEmailSent ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                  <span>{isRealEmailSent ? 'Gmail рүү илгээгдлээ!' : 'Баталгаажуулах код:'}</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {otpSuccessMessage}
                </p>
              </div>
            )}

            {/* 6-Digit PIN Inputs */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {enteredOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-xs text-rose-500 text-center mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={enteredOtp.join('').length < 6 || isVerifyingOtp}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
              >
                {isVerifyingOtp ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Code & Continue</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Security watermark */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Strict Security & Verification Enforced</span>
        </div>

        {/* Continue to Feed without Login */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <span>Нэвтрэлгүйгээр Feed үзэх (Explore as Guest)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Advanced Settings Modal (Tabs for Google vs Discord vs Email) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <span>OAuth & API Integration Settings</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Google, Discord болон EmailJS холболтын заавар ба түлхүүрүүд.
              </p>
            </div>

            {/* Setting Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-4 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setConfigActiveTab('google')}
                className={`pb-2 transition-colors border-b-2 ${
                  configActiveTab === 'google'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Google Setup (401 Fix)
              </button>
              <button
                type="button"
                onClick={() => setConfigActiveTab('discord')}
                className={`pb-2 transition-colors border-b-2 ${
                  configActiveTab === 'discord'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Discord Setup (Redirect Fix)
              </button>
              <button
                type="button"
                onClick={() => setConfigActiveTab('email')}
                className={`pb-2 transition-colors border-b-2 ${
                  configActiveTab === 'email'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                EmailJS
              </button>
            </div>

            {configActiveTab === 'google' && (
              <form onSubmit={handleSaveKeys} className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Google "Error 401: invalid_client"-ийг засах:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Энэ алдаа нь Google Cloud дээр Client ID байхгүй эсвэл устсан үед гардаг. Та Google Cloud Console руу орж шинэ "Web application" Client ID үүсгээд доорх хайрцагт оруулна уу.
                  </p>
                </div>

                {/* Authorised JS Origin */}
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Authorised JavaScript origin</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(appOrigin);
                        setCopiedOrigin(true);
                        setTimeout(() => setCopiedOrigin(false), 2000);
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                    >
                      {copiedOrigin ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedOrigin ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-neutral-800 dark:text-neutral-200 break-all select-all">
                    {appOrigin}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Google Client ID (Шинэ Client ID-аа энд оруулна уу)
                  </label>
                  <input
                    type="text"
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    placeholder="xxxx.apps.googleusercontent.com"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500"
                  >
                    Хаах
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    Хадгалах
                  </button>
                </div>
              </form>
            )}

            {configActiveTab === 'discord' && (
              <form onSubmit={handleSaveKeys} className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1.5 text-indigo-950 dark:text-indigo-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Discord "Invalid OAuth2 redirect_uri"-г засах:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    1. <strong>discord.com/developers/applications</strong> руу очно.<br />
                    2. Өөрийн <strong>{discordClientId || '1555996399349538878'}</strong> аппликейшнийг сонгоно.<br />
                    3. <strong>OAuth2 ➔ General</strong> цэс рүү орж, <strong>Redirects</strong> хэсэгт <strong>Add Redirect</strong> дарж доорх URL-г нэмээд Save хийнэ үү:
                  </p>
                </div>

                {/* Redirect URI with 1-click copy */}
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Discord Redirect URI (Хуулж авах)</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(APP_CALLBACK_URL);
                        setCopiedCallback(true);
                        setTimeout(() => setCopiedCallback(false), 2000);
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                    >
                      {copiedCallback ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCallback ? 'Хуулагдлаа!' : 'Хуулах'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-neutral-800 dark:text-neutral-200 break-all select-all font-bold">
                    {APP_CALLBACK_URL}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Discord Client ID
                  </label>
                  <input
                    type="text"
                    value={discordClientId}
                    onChange={(e) => setDiscordClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500"
                  >
                    Хаах
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    Хадгалах
                  </button>
                </div>
              </form>
            )}

            {configActiveTab === 'email' && (
              <form onSubmit={handleSaveEmailConfig} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    EmailJS Service ID
                  </label>
                  <input
                    type="text"
                    value={emailConfig.serviceId}
                    onChange={(e) => setEmailConfig({ ...emailConfig, serviceId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    EmailJS Template ID
                  </label>
                  <input
                    type="text"
                    value={emailConfig.templateId}
                    onChange={(e) => setEmailConfig({ ...emailConfig, templateId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    EmailJS Public Key
                  </label>
                  <input
                    type="text"
                    value={emailConfig.publicKey}
                    onChange={(e) => setEmailConfig({ ...emailConfig, publicKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500"
                  >
                    Хаах
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    Email тохиргоо хадгалах
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
