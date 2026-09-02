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

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'طلب جديد وصل من بغداد',
    desc: 'الزبون حيدر علي طلب "عطر الفخامة الملكي" بقيمة 45,000 د.ع.',
    time: 'منذ 5 دقائق',
    read: false,
    type: 'order',
  },
  {
    id: '2',
    title: 'تم تسليم الشحنة في البصرة',
    desc: 'قام مندوب الزعيم بتسليم الشحنة ZAEEM-2026-000102 بنجاح.',
    time: 'منذ ساعة',
    read: false,
    type: 'shipment',
  },
  {
    id: '3',
    title: 'تنبيه انخفاض المخزون',
    desc: 'المنتج "ساعة لومينور" متبقي منه 3 قطع فقط.',
    time: 'منذ 3 ساعات',
    read: true,
    type: 'stock',
  },
];

function SafeUserAvatar() {
  try {
    const { user } = useUser();
    const name = user?.firstName || user?.fullName || 'تاجر الزعيم';

    return (
      <div className="flex items-center gap-2 pl-1 border-r border-slate-200 dark:border-slate-800 pr-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {name}
          </p>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">تاجر معتمد</span>
        </div>
        <UserButton appearance={{ elements: { userButtonAvatarBox: 'size-9 rounded-xl' } }} />
      </div>
    );
  } catch {
    return (
      <div className="flex items-center gap-2 pl-1 border-r border-slate-200 dark:border-slate-800 pr-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            تاجر الزعيم
          </p>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">تاجر معتمد</span>
        </div>
        <span className="size-9 rounded-xl bg-teal-700 text-white font-extrabold text-xs grid place-items-center">
          ز
        </span>
      </div>
    );
  }
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
          <span>مصر (ج.م)</span>
        </div>

        {/* Notification Center Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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

              <div className="space-y-2 max-h-72 overflow-y-auto rf-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border transition-colors ${
                      n.read
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
            </div>
          )}
        </div>

        {/* Safe User Avatar */}
        <SafeUserAvatar />
      </div>
    </header>
  );
}
