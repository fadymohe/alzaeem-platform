import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { StoreTemplates, TEMPLATES_MAP, type TemplateId } from '../components/storefront/StoreTemplates';

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

  useEffect(() => {
    // If cleanSub directly names a template (volt, rose, nitro, sepia, oret)
    if (TEMPLATES_MAP[cleanSub as TemplateId]) {
      setTemplateId(cleanSub as TemplateId);
      return;
    }

    try {
      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.selectedTheme && TEMPLATES_MAP[parsed.selectedTheme as TemplateId]) {
          setTemplateId(parsed.selectedTheme as TemplateId);
        }
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
      />
    </div>
  );
}
