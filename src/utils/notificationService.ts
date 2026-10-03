// Browser Notification & Sound Service for webop

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.warn('Failed to request notification permission:', e);
    return 'denied';
  }
}

export function playNotificationSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    
    // Friendly melodic 2-tone notification chime (E5 -> B5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12); // B5
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch (err) {
    // audio context might be blocked by browser policy
  }
}

export function sendBrowserNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    onClick?: () => void;
  }
) {
  playNotificationSound();

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  const iconUrl =
    options?.icon ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80';

  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body: options?.body,
        icon: iconUrl,
        tag: options?.tag || 'webop_notif',
        silent: true // we play our own chime
      });

      if (options?.onClick) {
        notif.onclick = () => {
          window.focus();
          options.onClick?.();
          notif.close();
        };
      }
    } catch (e) {
      console.warn('Could not spawn native notification:', e);
    }
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        try {
          new Notification(title, {
            body: options?.body,
            icon: iconUrl,
            tag: options?.tag || 'webop_notif'
          });
        } catch (e) {}
      }
    });
  }
}
