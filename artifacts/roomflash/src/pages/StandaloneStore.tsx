import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { StoreTemplates, TEMPLATES_MAP, type TemplateId } from '../components/storefront/StoreTemplates';
import { getRegisteredStore, type RegisteredStoreData } from '../utils/storeRegistry';

export function StandaloneStorePage() {
  const [match, params] = useRoute('/view-store/:subdomain');
  const [match2, params2] = useRoute('/store/:subdomain');

  // Extract subdomain from hostname (e.g. zero.za3em.shop) or route params
  const hostMatch = window.location.hostname.match(/^([a-zA-Z0-9-]+)\.za3em\.shop$/i);
  const hostSub = hostMatch?.[1]?.toLowerCase();

  const rawSub = (hostSub && hostSub !== 'www' && hostSub !== 'za3em')
    ? hostSub
    : params?.subdomain || params2?.subdomain || 'zero';

  const cleanSub = rawSub.toLowerCase().replace(/[^a-z0-9-]/g, '');

  const [storeName, setStoreName] = useState('متجر الزعيم الذهبي');
  const [templateId, setTemplateId] = useState<TemplateId>('shoppingcart.1.2.7');
  const [storeData, setStoreData] = useState<RegisteredStoreData | null>(null);

  useEffect(() => {
    // 1. If cleanSub directly names a template (volt, rose, nitro, sepia, oret)
    if (TEMPLATES_MAP[cleanSub as TemplateId]) {
      setTemplateId(cleanSub as TemplateId);
      return;
    }

    // 2. Check registered store from registry (URL seed, cookies, localStorage, catalog)
    const registered = getRegisteredStore(cleanSub);
    if (registered) {
      if (registered.storeName) setStoreName(registered.storeName);
      if (registered.templateId && TEMPLATES_MAP[registered.templateId as TemplateId]) {
        setTemplateId(registered.templateId as TemplateId);
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
  }, [cleanSub]);

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950">
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
  );
}
