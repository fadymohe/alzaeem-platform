import { useState, type FormEvent } from 'react';
import {
  Sparkles, Plus, Eye, Share2, Copy, Check, ExternalLink, Globe,
  ShoppingBag, ArrowLeft, Trash2, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { IRAQ_GOVERNORATES, formatIQD, type Governorate } from '../data/iraqData';

export interface LandingPageData {
  id: string;
  slug: string;
  title: string;
  template: 'classic' | 'modern' | 'minimal';
  productName: string;
  description: string;
  price: number;
  compareAtPrice: number;
  discountPercentage: number;
  stock: number;
  features: string[];
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
}

const DEMO_LANDING_PAGES: LandingPageData[] = [
  {
    id: '1',
    slug: 'perfume-royal-cairo',
    title: 'عطر الفخامة الملكي - عروض الموسم',
    template: 'modern',
    productName: 'عطر الفخامة الملكي (100 مل)',
    description: 'عطر رجالي فخم بتركيز عالي يدوم طويلاً، مع خلطة العود والصندل الفاخر.',
    price: 450,
    compareAtPrice: 650,
    discountPercentage: 30,
    stock: 25,
    features: ['ثبات يدوم 48 ساعة', 'عطور أصلية 100%', 'توصيل سريع لجميع المحافظات'],
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    isPublished: true,
    createdAt: '2026-09-01',
  },
];

export function LandingPageBuilderPage() {
  const [pages, setPages] = useState<LandingPageData[]>(DEMO_LANDING_PAGES);
  const [isCreating, setIsCreating] = useState(false);
  const [previewPage, setPreviewPage] = useState<LandingPageData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    productName: '',
    slug: '',
    template: 'modern' as 'classic' | 'modern' | 'minimal',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '50',
    featureInput: '',
    features: [] as string[],
    imageUrl: '',
  });

  const handleAddFeature = () => {
    if (!form.featureInput.trim()) return;
    setForm({
      ...form,
      features: [...form.features, form.featureInput.trim()],
      featureInput: '',
    });
  };

  const handleRemoveFeature = (index: number) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  const handleSavePage = (publish: boolean) => {
    if (!form.productName.trim()) return;
    const finalSlug = form.slug.trim()
      ? form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
      : form.productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const priceNum = Number(form.price) || 0;
    const compareNum = Number(form.compareAtPrice) || priceNum;
    const discount = compareNum > priceNum ? Math.round(((compareNum - priceNum) / compareNum) * 100) : 0;

    const newPage: LandingPageData = {
      id: String(Date.now()),
      slug: finalSlug || `page-${Date.now()}`,
      title: form.productName,
      template: form.template,
      productName: form.productName,
      description: form.description,
      price: priceNum,
      compareAtPrice: compareNum,
      discountPercentage: discount,
      stock: Number(form.stock) || 10,
      features: form.features.length > 0 ? form.features : ['جودة عالية وضمان استبدال', 'توصيل سريع لكافة المحافظات'],
      imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      isPublished: publish,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPages([newPage, ...pages]);
    setIsCreating(false);
  };

  const copyUrl = (slug: string, id: string) => {
    const fullUrl = `${window.location.origin}/p/${slug}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 rf-appear">
      {/* Top Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Globe className="size-4" /> التسويق المباشر
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إنشاء صفحة هبوط (Landing Pages)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            صمم صفحات بيع احترافية سريعة ومخصصة للمنتجات لزيادة نسبة المبيعات عبر الإعلانات.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="size-4" /> إنشاء صفحة هبوط جديدة
          </button>
        )}
      </div>

      {/* Form / Builder */}
      {isCreating ? (
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="size-5 text-teal-700" /> إعداد صفحة الهبوط
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="size-4" /> إلغاء والعودة
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم المنتج / الصفحة <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="مثال: ساعة لومينور الفاخرة"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الرابط الفرعي للصفحة (Slug)
              </label>
              <div className="flex items-center">
                <span className="h-11 px-3 bg-slate-100 dark:bg-slate-800 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-xl text-xs font-mono text-slate-500 flex items-center">
                  /p/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="product-name"
                  className="w-full h-11 px-3.5 rounded-l-xl border border-slate-200 dark:border-slate-700 text-sm ltr text-right outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                السعر الحالي (د.ع) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="مثال: 35000"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                السعر قبل الخصم (د.ع)
              </label>
              <input
                type="number"
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                placeholder="مثال: 50000"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                رابط صورة المنتج
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm ltr text-right outline-none focus:border-teal-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                وصف المنتج التسويقي
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="اكتب وصفاً مشوقاً يوضح فوائد المنتج للزبائن..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Features Builder */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              مميزات المنتج
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={form.featureInput}
                onChange={(e) => setForm({ ...form, featureInput: e.target.value })}
                placeholder="مثال: توصيل سريع خلال 24 ساعة في بغداد"
                className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-teal-600"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 h-10 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900"
              >
                + إضافة ميزة
              </button>
            </div>

            {form.features.length > 0 && (
              <ul className="space-y-1.5">
                {form.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-teal-600" /> {feat}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => handleSavePage(false)}
              className="px-5 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            >
              حفظ كمسودة
            </button>
            <button
              type="button"
              onClick={() => handleSavePage(true)}
              className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md"
            >
              حفظ ونشر الصفحة مباشرة
            </button>
          </div>
        </div>
      ) : (
        /* Pages List */
        <div className="grid gap-5 md:grid-cols-2">
          {pages.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1.5 ${
                        p.isPublished
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {p.isPublished ? 'منشورة وزاد إقبالها' : 'مسودة غير منشورة'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {p.title}
                    </h3>
                  </div>

                  <span className="font-mono text-xs text-slate-400">{p.createdAt}</span>
                </div>

                <div className="flex items-center gap-3 my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <img
                    src={p.imageUrl}
                    alt={p.productName}
                    className="size-14 rounded-lg object-cover bg-slate-200"
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{p.productName}</p>
                    <div className="flex items-center gap-2 mt-1 font-mono text-xs">
                      <span className="font-extrabold text-teal-700 dark:text-teal-400">
                        {formatIQD(p.price)}
                      </span>
                      {p.compareAtPrice > p.price && (
                        <span className="line-through text-slate-400 text-[11px]">
                          {formatIQD(p.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewPage(p)}
                  className="px-3 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Eye className="size-3.5" /> معاينة
                </button>

                <button
                  onClick={() => copyUrl(p.slug, p.id)}
                  className="px-3 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 flex items-center gap-1.5"
                >
                  {copiedId === p.id ? <Check className="size-3.5 text-teal-600" /> : <Copy className="size-3.5" />}
                  {copiedId === p.id ? 'تم النسخ' : 'نسخ الرابط'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-teal-700">معاينة صفحة الهبوط العامة</span>
              <button
                onClick={() => setPreviewPage(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                إغلاق
              </button>
            </div>

            <div className="text-center space-y-4">
              <img
                src={previewPage.imageUrl}
                alt={previewPage.productName}
                className="w-full h-64 object-cover rounded-2xl bg-slate-100"
              />
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {previewPage.productName}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {previewPage.description}
              </p>

              <div className="flex items-center justify-center gap-3 font-mono">
                <span className="text-2xl font-extrabold text-teal-700 dark:text-teal-400">
                  {formatIQD(previewPage.price)}
                </span>
                {previewPage.compareAtPrice > previewPage.price && (
                  <span className="line-through text-slate-400 text-sm">
                    {formatIQD(previewPage.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Order Form simulation */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-5 text-right space-y-3 border border-slate-200/60 dark:border-slate-700">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white border-b pb-2">
                  نموذج اطلب الآن (الدفع عند الاستلام والتوصيل السريع)
                </h3>
                <input
                  disabled
                  placeholder="اسم المستلم الثلاثي"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white dark:bg-slate-900"
                />
                <input
                  disabled
                  placeholder="+964 770 000 0000"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs ltr text-right bg-white dark:bg-slate-900"
                />
                <select
                  disabled
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white dark:bg-slate-900"
                >
                  {IRAQ_GOVERNORATES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <button
                  disabled
                  className="w-full h-11 bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  اطلب الآن — الدفع عند الاستلام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
