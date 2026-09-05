import { useState } from 'react';

import { useUser, UserButton } from '@clerk/react';
import { Menu, Bell, Check, ShoppingBag, Truck, AlertTriangle, Sparkles, X, User } from 'lucide-react';

interface HeaderProps {
  onOpenMobile: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'order' | 'shipment' | 'stock' | 'system';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

function SafeUserAvatar() {
  let zaeemUser: any = null;
  try {
    const raw = localStorage.getItem('zaeem_user');
    if (raw) zaeemUser = JSON.parse(raw);
  } catch {}

  let clerkUser: any = null;
  try {
    const { user } = useUser();
    clerkUser = user;
  } catch {}

  const isApple = zaeemUser?.provider === 'apple';
  const isGoogle = zaeemUser?.provider === 'google' || Boolean(zaeemUser?.avatarUrl) || Boolean(zaeemUser?.picture) || Boolean(zaeemUser?.avatar_url);
  const avatarUrl = zaeemUser?.avatarUrl || zaeemUser?.picture || zaeemUser?.avatar_url || zaeemUser?.photoURL || clerkUser?.imageUrl;
  const name = zaeemUser?.name || clerkUser?.firstName || clerkUser?.fullName || 'تاجر الزعيم';

  return (
    <div className="flex items-center gap-2 pl-1 border-r border-slate-200 dark:border-slate-800 pr-3">
      <div className="text-right hidden sm:block">
        <div className="flex items-center gap-1.5 justify-end">
          {isApple && (
            <svg className="size-3 fill-current text-slate-800 dark:text-slate-200 shrink-0" viewBox="0 0 24 24">
              <title>مسجل بـ Apple ID</title>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.6-1.12.98-2.67.87-4.22-1.42.06-3.08.95-3.86 1.86-.54.63-.98 1.63-.86 2.82 1.57.12 3.18-.8 3.85-1.46z"/>
            </svg>
          )}
          {isGoogle && (
            <svg className="size-3 shrink-0" viewBox="0 0 24 24">
              <title>مسجل بحساب Google</title>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          )}
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {name}
          </p>
        </div>
        <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">
          {isGoogle ? 'حساب Google معتمد' : isApple ? 'حساب Apple معتمد' : 'تاجر معتمد'}
        </span>
      </div>

      {isGoogle && avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          referrerPolicy="no-referrer"
          className="size-9 rounded-xl object-cover shadow-sm border border-teal-600/40"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <span className="size-9 rounded-xl bg-teal-700 text-white font-extrabold text-xs grid place-items-center shadow-sm">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export function Header({ onOpenMobile }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 md:px-8 backdrop-blur-md">
      {/* Mobile Toggle & Desktop Store title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden lg:block text-xs font-semibold text-slate-600 dark:text-slate-400">
          منصة <b className="text-slate-900 dark:text-white font-extrabold">الزعيم للشحن والتجارة الإلكترونية</b>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Currency & Market Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold">
          <span>العراق (د.ع)</span>
        </div>

        {/* Notification Center Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="الإشعارات"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">الإشعارات والتنبيهات</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline"
                  >
                    تحديد الكل كقروء
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-7 px-4 text-center space-y-2">
                  <div className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 grid place-items-center mx-auto">
                    <Bell className="size-5" />
                  </div>
                  <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                    لا توجد إشعارات حالياً
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                    ستصلك هنا تنبيهات الطلبات الجديدة، حركات الشحن، وتحديثات المتجر لحظة بلحظة.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto rf-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border transition-colors ${n.read
                        ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-70'
                        : 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/50'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-extrabold text-xs text-slate-900 dark:text-white">{n.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Safe User Avatar */}
        <SafeUserAvatar />
      </div>
    </header>
  );
}
