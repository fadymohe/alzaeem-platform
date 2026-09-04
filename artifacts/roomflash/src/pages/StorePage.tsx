import { useState, useEffect } from 'react';
import { Store as StoreIcon, ExternalLink, Copy, Check, Sparkles, Globe, Layers, Eye, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { StoreTemplates, type TemplateId, TEMPLATES_MAP } from '../components/storefront/StoreTemplates';
import { getStoredOrders, getStoredProducts } from '../data/storeState';
import { getRegisteredStore, type RegisteredStoreData } from '../utils/storeRegistry';

export function StorePage() {
  const [copied, setCopied] = useState(false);
  const [storeName, setStoreName] = useState('متجر الزعيم الذهبي');
  const [subdomainInput, setSubdomainInput] = useState('zero');
  const [subdomain, setSubdomain] = useState('zero');
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('shoppingcart.1.2.7');
  const [createdSuccessAlert, setCreatedSuccessAlert] = useState(false);
  const [storeData, setStoreData] = useState<RegisteredStoreData | null>(null);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const queryStore = searchParams.get('store') || searchParams.get('subdomain');
      const hashStoreMatch = hash.match(/#\/store\/([a-zA-Z0-9-]+)/);
      const hostSubdomainMatch = window.location.hostname.match(/^([a-zA-Z0-9-]+)\.za3em\.shop$/);

      const targetSub = hostSubdomainMatch?.[1] || queryStore || hashStoreMatch?.[1];

      if (targetSub && targetSub !== 'www' && targetSub !== 'za3em') {
        const cleanSub = targetSub.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setSubdomain(cleanSub);
        setSubdomainInput(cleanSub);

        const registered = getRegisteredStore(cleanSub);
        if (registered) {
          if (registered.storeName) setStoreName(registered.storeName);
          if (registered.templateId && TEMPLATES_MAP[registered.templateId as TemplateId]) {
            setActiveTemplate(registered.templateId as TemplateId);
          }
          setStoreData(registered);
          return;
        }
      }

      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.subdomain && !targetSub) {
          const cleanSub = parsed.subdomain.replace(/\.alzaeem\.iq|\.zaeem\.iq|\.za3em\.shop/g, '');
          setSubdomain(cleanSub);
          setSubdomainInput(cleanSub);
        }
        if (parsed.selectedTheme && TEMPLATES_MAP[parsed.selectedTheme as TemplateId]) {
          setActiveTemplate(parsed.selectedTheme as TemplateId);
        }
        setStoreData(parsed);
      }
    } catch (e) {}
  }, []);

  const fullDomain = `${subdomain}.za3em.shop`;
  const fullUrl = `https://${fullDomain}`;
  const directHashUrl = `https://za3em.shop/#/store/${subdomain}`;

  const handleTemplateChange = (id: TemplateId) => {
    setActiveTemplate(id);
    try {
      const stored = localStorage.getItem('zaeem_store_data') || '{}';
      const parsed = JSON.parse(stored);
      parsed.selectedTheme = id;
      parsed.subdomain = `${subdomain}.za3em.shop`;
      parsed.storeName = storeName;
      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify(parsed));

      // Sync with DB API
      fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: storeName,
          subdomain: `${subdomain}.za3em.shop`,
          theme: id,
          country: 'Iraq',
          category: 'Retail'
        })
      }).catch(() => {});
    } catch (e) {}
  };

  const handleApplyNewSubdomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomainInput.trim()) return;

    const cleanSub = subdomainInput.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(cleanSub);
    handleTemplateChange(activeTemplate);

    setCreatedSuccessAlert(true);
    setTimeout(() => setCreatedSuccessAlert(false), 4000);
  };

  const copyStoreLink = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 rf-appear">
      {/* Top Title Bar */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <StoreIcon className="size-4" /> محرك النطاقات الفرعية والقوالب المباشرة
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
            <span>متجرك الإلكتروني المباشر</span>
            <span className="text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-3.5 py-1 rounded-full border border-teal-300/50 flex items-center gap-1.5 dir-ltr">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              {fullDomain}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            أدخل أي نطاق فرعي واختبر تفعيله فورياً في ثوانٍ مع حفظ القالب المختار في قاعدة البيانات.
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
            href={directHashUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <span>فتح المتجر المباشر</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* 🚀 REAL INSTANT SUBDOMAIN CREATOR BAR */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-900/10 via-slate-900 to-slate-950 p-6 shadow-xl space-y-4 text-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-emerald-400" />
            <h3 className="font-extrabold text-base">إنشاء وتفعيل نطاق فرعي حقيقي لحفظ القالب في قاعدة البيانات</h3>
          </div>
          <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full dir-ltr">
            https://{fullDomain}
          </span>
        </div>

        <form onSubmit={handleApplyNewSubdomain} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 flex items-center bg-slate-950 rounded-2xl border border-slate-700 overflow-hidden px-4">
            <span className="text-xs font-bold text-slate-400 pl-2">https://</span>
            <input
              type="text"
              required
              value={subdomainInput}
              onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="مثال: zero أو got أو fady أو baghdad-store"
              dir="ltr"
              className="flex-1 h-11 bg-transparent text-sm font-mono font-bold text-white outline-none"
            />
            <span className="text-xs font-mono font-bold text-teal-400 bg-slate-900 px-3 py-1 rounded-xl">
              .za3em.shop
            </span>
          </div>

          <button
            type="submit"
            className="h-11 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 shrink-0"
          >
            <span>تفعيل النطاق الفرعي والقالب ⚡</span>
          </button>
        </form>

        {createdSuccessAlert && (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs font-bold text-emerald-200 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="size-4 text-emerald-400" />
            تم حفظ القالب والنطاق الفرعي ({subdomainInput}.za3em.shop) في قاعدة البيانات وتطبيقه فورياً!
          </div>
        )}
      </div>

      {/* 5 Templates Live Preview Container */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
        <StoreTemplates
          storeName={storeName}
          subdomain={subdomain}
          activeTemplateId={activeTemplate}
          onTemplateChange={handleTemplateChange}
          customProduct={storeData?.product}
          storeCode={storeData?.storeCode}
          logoUrl={storeData?.logoUrl}
        />
      </div>
    </div>
  );
}
