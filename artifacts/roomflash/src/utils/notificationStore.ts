/**
 * Notifications Management Store for Al-Zaeem Platform
 * Manages live notifications for:
 * 1. New orders (استقبال طلب جديد)
 * 2. Shipment status changes (تغيير حالة الشحنة)
 * 3. Platform & system updates (حدوث تحديث جديد للموقع)
 * 4. Support ticket interactions (التواصل مع الدعم الفني)
 */

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  read: boolean;
  type: 'order' | 'shipment' | 'system' | 'support';
  link?: string;
}

const NOTIFICATIONS_KEY = 'zaeem_notifications';

function formatArabicRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) {
      const parsed: AppNotification[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Update dynamic relative time strings
        return parsed.map((n) => ({
          ...n,
          time: n.timestamp ? formatArabicRelativeTime(n.timestamp) : n.time || 'الآن',
        }));
      }
    }
  } catch (e) {
    console.warn('Error reading notifications:', e);
  }

  // Seed default platform update notification if empty
  const initial: AppNotification[] = [
    {
      id: 'sys-update-init',
      title: 'تحديث جديد لمنصة الزعيم 🚀',
      desc: 'تم تفعيل نظام الإشعارات الفورية للطلبات، متابعة حركة الشحنات، والتواصل السريع مع الدعم الفني.',
      time: 'الآن',
      timestamp: Date.now(),
      read: false,
      type: 'system',
      link: '/dashboard',
    },
  ];

  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initial));
  } catch {}

  return initial;
}

export function saveStoredNotifications(notifications: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications.slice(0, 50)));
    window.dispatchEvent(new CustomEvent('zaeem_notifications_updated'));
  } catch (e) {
    console.warn('Error saving notifications:', e);
  }
}

export function addAppNotification(item: {
  title: string;
  desc: string;
  type: 'order' | 'shipment' | 'system' | 'support';
  link?: string;
}): AppNotification {
  const current = getStoredNotifications();

  // Avoid duplicate spam notifications within 1 minute
  const isDuplicate = current.some(
    (n) => n.title === item.title && n.desc === item.desc && Date.now() - n.timestamp < 60000
  );
  if (isDuplicate) {
    return current[0];
  }

  const newNotif: AppNotification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: item.title,
    desc: item.desc,
    type: item.type,
    link: item.link,
    read: false,
    timestamp: Date.now(),
    time: 'الآن',
  };

  const updated = [newNotif, ...current].slice(0, 40);
  saveStoredNotifications(updated);
  return newNotif;
}

export function markAllNotificationsRead(): void {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  saveStoredNotifications(updated);
}

export function markNotificationRead(id: string): void {
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveStoredNotifications(updated);
}

export function clearAllNotifications(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(NOTIFICATIONS_KEY);
    window.dispatchEvent(new CustomEvent('zaeem_notifications_updated'));
  } catch {}
}
