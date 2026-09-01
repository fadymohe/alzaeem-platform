import { Link, useLocation } from 'wouter';
import { useClerk } from '@clerk/react';
import {
  LayoutDashboard, ShoppingCart, Box, Users, Truck, Store,
  Megaphone, Grid, BarChart3, CreditCard, Settings2, HelpCircle,
  LogOut, X, ChevronLeft, Building, Sparkles
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/orders', label: 'الطلبات', icon: ShoppingCart },
  { href: '/products', label: 'المنتجات', icon: Box },
  { href: '/customers', label: 'الزبائن', icon: Users },
  { href: '/shipments', label: 'الشحن والتوصيل', icon: Truck, badge: 'جديد' },
  { href: '/zaeem-logistics', label: 'شركة الزعيم للشحن', icon: Building },
  { href: '/store', label: 'المتجر الإلكتروني', icon: Store },
  { href: '/landing-pages', label: 'صفحات الهبوط', icon: Sparkles },
  { href: '/marketing', label: 'التسويق والكوبونات', icon: Megaphone },
  { href: '/applications', label: 'التطبيقات', icon: Grid },
  { href: '/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/subscriptions', label: 'الاشتراكات والفوترة', icon: CreditCard },
  { href: '/settings', label: 'الإعدادات', icon: Settings2 },
  { href: '/support', label: 'المساعدة والدعم', icon: HelpCircle },
];

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const [location, setLocation] = useLocation();

  const handleSignOut = () => {
    try {
      const { signOut } = useClerk();
      signOut();
    } catch {
      setLocation('/');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-slate-100 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out border-l border-slate-800 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Close */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <Logo inverse />
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Store Quick Card */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 block">المتجر الفعّال</span>
            <div className="flex items-center justify-between mt-1">
              <div className="min-w-0">
                <p className="font-bold text-xs text-white truncate">متجر الزعيم - بغداد</p>
                <p className="font-mono text-[10px] text-teal-400 truncate">fady.za3em.shop</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                نشط
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-5 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] rf-scrollbar pr-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-teal-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Sign out */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="size-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
