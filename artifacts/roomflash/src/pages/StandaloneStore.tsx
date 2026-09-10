import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import {
  StoreTemplates,
  TEMPLATES_MAP,
  normalizeTemplateId,
  isTemplatePreview,
  type TemplateId
} from '../components/storefront/StoreTemplates';
import { getRegisteredStore, type RegisteredStoreData } from '../utils/storeRegistry';
import { fetchCloudStore } from '../utils/cloudDb';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { setStoreDocumentIdentity, restoreDefaultDocumentIdentity } from '../utils/storeIdentityHelper';

export function StandaloneStorePage() {
  const [match, params] = useRoute('/view-store/:subdomain');
  const [match2, params2] = useRoute('/store/:subdomain');

  // 1. Extract subdomain from hostname (e.g. nova.za3em.shop)
  const hostMatch = typeof window !== 'undefined' ? window.location.hostname.match(/^([a-zA-Z0-9-]+)\.za3em\.shop$/i) : null;
  const hostSub = hostMatch?.[1]?.toLowerCase();

  // 2. Extract from hash route fallback (e.g. #/store/nova or #/view-store/classic)
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const hashMatch = hash.match(/#\/(?:store|view-store)\/([a-zA-Z0-9_-]+)/i);
  const hashSub = hashMatch?.[1];

  // 3. Extract from pathname (e.g. /store/nova or /view-store/nova)
  const pathMatch = typeof window !== 'undefined' ? window.location.pathname.match(/\/(?:store|view-store)\/([a-zA-Z0-9_-]+)/i) : null;
  const pathSub = pathMatch?.[1];

  const rawSub = (hostSub && hostSub !== 'www' && hostSub !== 'za3em')
    ? hostSub
    : hashSub || pathSub || params?.subdomain || params2?.subdomain || 'nova';

  const cleanSub = rawSub.toLowerCase().replace(/[^a-z0-9-]/g, '');

  const initialNormalized = normalizeTemplateId(cleanSub);
  const initialTmpl: TemplateId = TEMPLATES_MAP[cleanSub as TemplateId]
    ? (cleanSub as TemplateId)
    : (TEMPLATES_MAP[initialNormalized as TemplateId] ? initialNormalized : 'store-sprout');

  const [storeName, setStoreName] = useState(TEMPLATES_MAP[initialTmpl]?.name || 'متجر الزعيم الذهبي');
  const [templateId, setTemplateId] = useState<TemplateId>(initialTmpl);
  const [storeData, setStoreData] = useState<RegisteredStoreData | null>(null);

  useEffect(() => {
    if (storeName) {
      setStoreDocumentIdentity(storeName, storeData?.logoUrl);
    }
    return () => {
      restoreDefaultDocumentIdentity();
    };
  }, [storeName, storeData?.logoUrl]);

  useEffect(() => {
    // 1. If cleanSub directly names a template or alias (nova, classic, aurit, brick, etc.)
    const normalized = normalizeTemplateId(cleanSub);
    if (isPreviewMode || (normalized && normalized !== 'store-sprout') || cleanSub === 'sprout') {
      const targetTmpl = TEMPLATES_MAP[cleanSub as TemplateId] ? (cleanSub as TemplateId) : normalized;
      setTemplateId(targetTmpl);
      const tmplInfo = TEMPLATES_MAP[targetTmpl];
      if (tmplInfo) {
        setStoreName(tmplInfo.name);
      }
      return;
    }

    // 2. Check registered store from registry (URL seed, cookies, localStorage, catalog)
    const registered = getRegisteredStore(cleanSub);
    if (registered) {
      if (registered.storeName) setStoreName(registered.storeName);
      if (registered.templateId) {
        setTemplateId(normalizeTemplateId(registered.templateId));
      }
      setStoreData(registered);
      return;
    }

    // 3. Fallback to single onboarded store keys
    try {
      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.selectedTheme && TEMPLATES_MAP[parsed.selectedTheme as TemplateId]) {
          setTemplateId(parsed.selectedTheme as TemplateId);
        }
        setStoreData(parsed);
      }
    } catch (e) {}

    // 4. Fetch from central Neon PostgreSQL database
    fetchCloudStore(cleanSub).then(record => {
      if (record) {
        if (record.name) setStoreName(record.name);
        if (record.template_id) {
          const normTmpl = normalizeTemplateId(record.template_id);
          if (TEMPLATES_MAP[normTmpl]) setTemplateId(normTmpl);
        }
        setStoreData(prev => ({
          ...prev,
          storeName: record.name || prev?.storeName || `متجر ${cleanSub}`,
          subdomain: cleanSub,
          templateId: record.template_id || prev?.templateId || 'store-sprout',
          logoUrl: record.logo_url || prev?.logoUrl,
          bannerUrl: record.banner_url || prev?.bannerUrl,
          slogan: record.slogan || prev?.slogan,
          products: record.products || prev?.products,
          isActive: typeof record.is_active === 'boolean' ? record.is_active : (prev?.isActive ?? true)
        }));
      }
    }).catch(() => {});
  }, [cleanSub, isPreviewMode]);

  const activeThemeConfig = TEMPLATES_MAP[templateId];

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Sleek Live Template Preview Ribbon */}
      {isPreviewMode && (
        <div className="sticky top-0 z-[9999] bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-2.5 flex items-center justify-between shadow-2xl text-xs sm:text-sm" dir="rtl">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-bold">
              معاينة حية للمتجر
            </span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              القالب: <strong className="text-white font-black">{activeThemeConfig?.name || templateId}</strong>
            </span>
            <span className="text-[11px] text-teal-400 font-mono hidden md:inline bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {cleanSub.replace('store-', '')}.za3em.shop
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) ? `/#/onboarding?theme=${templateId}` : `https://www.za3em.shop/#/onboarding?theme=${templateId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>اعتماد هذا القالب لمتجري</span>
              <ArrowRight className="size-3.5 rotate-180" />
            </a>
            <a
              href={typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) ? '/' : 'https://www.za3em.shop'}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors"
            >
              منصة الزعيم
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      )}

      {/* Render the full interactive template */}
      <div className="flex-1 w-full">
        <StoreTemplates
          storeName={storeName}
          subdomain={cleanSub}
          activeTemplateId={templateId}
          standalone={true}
          customProduct={storeData?.product}
          storeCode={storeData?.storeCode}
          logoUrl={storeData?.logoUrl}
        />
      </div>
    </div>
  );
}
