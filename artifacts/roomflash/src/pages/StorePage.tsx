import { useState, useEffect } from 'react';
import { Store as StoreIcon, ExternalLink, Copy, Check, Sparkles, Globe, Layers, Eye } from 'lucide-react';
import { StoreTemplates, type TemplateId, TEMPLATES_MAP } from '../components/storefront/StoreTemplates';

export function StorePage() {
  const [copied, setCopied] = useState(false);
  const [storeName, setStoreName] = useState('متجر الزعيم الذهبي');
  const [subdomain, setSubdomain] = useState('fady');
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('volt');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.subdomain) {
          const cleanSub = parsed.subdomain.replace(/\.alzaeem\.iq|\.zaeem\.iq|\.za3em\.shop/g, '');
          setSubdomain(cleanSub);
        }
        if (parsed.selectedTheme && TEMPLATES_MAP[parsed.selectedTheme as TemplateId]) {
          setActiveTemplate(parsed.selectedTheme as TemplateId);
        }
      }
    } catch (e) {}
  }, []);

  const fullDomain = `${subdomain}.za3em.shop`;
  const fullUrl = `https://${fullDomain}`;

  const copyStoreLink = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 rf-appear">
      {/* Header Bar */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <StoreIcon className="size-4" /> واجهة المتجر والنطاق المباشر
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>متجرك الإلكتروني</span>
            <span className="text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-3 py-1 rounded-full border border-teal-300/50">
              {fullDomain}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            اختر واستعرض القوالب الـ 5 الجاهزة وانسخ رابط متجرك المباشر للزبائن.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyStoreLink}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
            {copied ? 'تم نسخ الرابط' : `نسخ ${fullDomain}`}
          </button>
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <span>فتح المتجر</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* 5 Templates Live Preview Container */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
        <StoreTemplates
          storeName={storeName}
          subdomain={subdomain}
          activeTemplateId={activeTemplate}
          onTemplateChange={(id) => setActiveTemplate(id)}
        />
      </div>
    </div>
  );
}
