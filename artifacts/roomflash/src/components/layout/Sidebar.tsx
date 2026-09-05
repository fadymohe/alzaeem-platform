import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useClerk } from '@clerk/react';
import {
  LayoutDashboard, ShoppingCart, Box, Users, Truck, Store,
  Megaphone, Grid, BarChart3, CreditCard, Settings2, HelpCircle,
  LogOut, X, ChevronLeft, Sparkles
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { supabase } from '../../utils/supabase';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/orders', label: 'الطلبات', icon: ShoppingCart },
  { href: '/products', label: 'المنتجات', icon: Box },
  { href: '/customers', label: 'الزبائن', icon: Users },
  { href: '/shipments', label: 'الشحن والتتبع', icon: Truck },
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

  // Dynamic Store Info and Subdomain
  const [storeName, setStoreName] = useState('متجر الزعيم');
  const [subdomain, setSubdomain] = useState('shop.za3em.shop');
  const [isStoreActive, setIsStoreActive] = useState(true);

  const syncStoreData = () => {
    try {
      // 1. Check Store Active status
      const activeVal = localStorage.getItem('zaeem_store_active');
      setIsStoreActive(activeVal !== 'false');

      // 2. Check Onboarded or Stored Store
      const rawStore = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      const rawUser = localStorage.getItem('zaeem_user');
      let userObj: any = null;
      let storeObj: any = null;

      if (rawStore) {
        try { storeObj = JSON.parse(rawStore); } catch {}
      }
      if (rawUser) {
        try { userObj = JSON.parse(rawUser); } catch {}
      }

      const cleanSub = (storeObj?.subdomain || userObj?.subdomain || 'alzaeem')
        .replace('.za3em.shop', '')
        .replace(/^https?:\/\//, '')
        .trim();

      const name = storeObj?.storeName || userObj?.storeName || (cleanSub ? `متجر ${cleanSub}` : 'متجر الزعيم');
      setStoreName(name);
      setSubdomain(`${cleanSub}.za3em.shop`);
    } catch {}
  };

  useEffect(() => {
    syncStoreData();

    // Listen for custom updates dispatched when settings or store details change
    const handleUpdate = () => syncStoreData();
    window.addEventListener('zaeem_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('zaeem_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('zaeem_user');
      localStorage.removeItem('zaeem_auth_action');
      supabase.auth.signOut().catch(() => null);
    } catch {}
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
              <div className="min-w-0 flex-1 pl-2">
                <p className="font-bold text-xs text-white truncate" title={storeName}>{storeName}</p>
                <p className="font-mono text-[10px] text-teal-400 truncate dir-ltr text-right" title={subdomain}>{subdomain}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 transition-colors ${
                isStoreActive
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {isStoreActive ? 'نشط' : 'معطل'}
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
