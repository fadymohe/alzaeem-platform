import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { ArrowLeft, Check, RefreshCw, Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import {
  getStoredProducts,
  addStoredProduct,
  updateStoredProduct,
  syncProductToLiveStoreAndServer,
  type StoreProduct
} from '../data/storeState';
import { compressImageFile } from '../utils/imageHelper';

const PRODUCT_CATEGORIES = [
  'عطور وتجميل',
  'أزياء وملابس رجالي',
  'أزياء وملابس نسائي',
  'إلكترونيات وموبايل',
  'ساعات وإكسسوارات',
  'أحذية وحقائب',
  'عناية وصحة',
  'مستلزمات المنزل',
  'هدايا وتحف',
  'عام'
];

export function ProductEditorPage() {
  const params = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();

  const allStored = getStoredProducts();
  const existingItem = params.id ? allStored.find((p) => p.id === Number(params.id)) : null;

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('45000');
  const [compareAtPrice, setCompareAtPrice] = useState('58000');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState('عطور وتجميل');
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [images, setImages] = useState<string[]>(['', '', '']);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fileInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null)
  ];

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setSku(existingItem.sku);
      setDescription(existingItem.description || '');
      setPrice(String(existingItem.price));
      setCompareAtPrice(existingItem.compareAtPrice ? String(existingItem.compareAtPrice) : '');
      setStock(String(existingItem.stock));
      setCategory(existingItem.category || 'عطور وتجميل');
      setStatus(existingItem.status === 'archived' ? 'draft' : existingItem.status);

      const existingImgs = existingItem.images && existingItem.images.length > 0
        ? [...existingItem.images]
        : (existingItem.imageUrl ? [existingItem.imageUrl] : []);
      while (existingImgs.length < 3) existingImgs.push('');
      setImages(existingImgs.slice(0, 3));
    } else {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setSku(`PRD-${randomSuffix}`);
    }
  }, [existingItem]);

  const handleImageFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(index);
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.8);
      setImages((prev) => {
        const next = [...prev];
        next[index] = compressedDataUrl;
        return next;
      });

      if (index === 0 && formErrors.mainImage) {
        setFormErrors((prev) => ({ ...prev, mainImage: '' }));
      }
    } catch (err) {
      console.error('Failed to compress image:', err);
      alert('حدث خطأ أثناء قراءة ملف الصورة من جهازك');
    } finally {
      setIsUploading(null);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
  };

  const validateProductForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. اسم المنتج: يمنع استخدام الرموز (حروف وأرقام ومسافات فقط)
    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = 'يرجى إدخال اسم المنتج';
    } else if (/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`\-]/.test(trimmedName)) {
      errors.name = 'يُمنع استخدام الرموز في اسم المنتج (يُسمح فقط بالحروف والأرقام والمسافات)';
    }

    // 2. رمز المنتج: يجب أن يكتب بالإنجليزي ولا يزيد عن 15 حرفاً
    const trimmedSku = sku.trim();
    if (!trimmedSku) {
      errors.sku = 'يرجى كتابة رمز المنتج (SKU)';
    } else if (!/^[A-Za-z0-9_-]{1,15}$/.test(trimmedSku)) {
      errors.sku = 'رمز المنتج يجب أن يُكتب بالإنجليزية ولا يتعدى 15 حرفاً';
    }

    // 3. السعر بالدينار العراقي
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'السعر يجب أن يكون رقماً صحيحاً أكبر من 0 بالدينار العراقي';
    }

    // 4. السعر قبل الخصم: يجب أن يكون أكبر من السعر بعد الخصم
    if (compareAtPrice && compareAtPrice.trim() !== '') {
      const compareNum = Number(compareAtPrice);
      if (!isNaN(compareNum) && compareNum > 0) {
        if (compareNum <= priceNum) {
          errors.compareAtPrice = 'السعر قبل الخصم يجب أن يكون أكبر قطيعاً من السعر بعد الخصم (سعر البيع)';
        }
      }
    }

    // 5. الكمية: لا يمكن أن تقل عن 1 قطعة
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 1) {
      errors.stock = 'الكمية لا يمكن أن تقل عن قطعة واحدة (1)';
    }

    // 6. التصنيف: قائمة منسدلة
    if (!category) {
      errors.category = 'يرجى اختيار تصنيف المنتج';
    }

    // 7. الصور: صورة أساسية للمنتج إجباري واثنتين اختياري من ملفات الجهاز
    if (!images[0] || images[0].trim() === '') {
      errors.mainImage = 'الصورة الأساسية للمنتج إجبارية ويجب رفعها من ملفات جهازك';
    }

    // 8. وصف المنتج: لا يتعدى 150 حرفاً
    if (description.length > 150) {
      errors.description = 'وصف المنتج يجب ألا يتعدى 150 حرفاً كحد أقصى';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    try {
      setIsSaving(true);
      const priceNum = Number(price);
      const compareNum = compareAtPrice ? Number(compareAtPrice) : null;
      const stockNum = parseInt(stock, 10) || 1;
      const validImages = images.filter((img) => Boolean(img && img.trim()));

      if (existingItem) {
        const updated = updateStoredProduct(existingItem.id, {
          name: name.trim(),
          sku: sku.trim(),
          price: priceNum,
          compareAtPrice: compareNum,
          stock: stockNum,
          category,
          description: description.trim(),
          status,
          imageUrl: validImages[0] || '',
          images: validImages,
        });
        if (updated) {
          await syncProductToLiveStoreAndServer(updated);
        }
      } else {
        const newProd = addStoredProduct({
          name: name.trim(),
          sku: sku.trim(),
          price: priceNum,
          compareAtPrice: compareNum,
          stock: stockNum,
          lowStockThreshold: 3,
          category,
          description: description.trim(),
          status,
          imageUrl: validImages[0] || '',
          images: validImages,
          weightGrams: 300,
        });
        await syncProductToLiveStoreAndServer(newProd);
      }

      setLocation('/products');
    } catch (err) {
      console.error('Error saving product in editor:', err);
      alert('حدث خطأ أثناء حفظ بيانات المنتج.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 rf-appear">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400">كتالوج المنتجات</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {existingItem ? 'تعديل بيانات المنتج الحالية' : 'إضافة منتج جديد'}
          </h1>
        </div>
        <Link
          href="/products"
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <ArrowLeft className="size-4" /> العودة للقائمة
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6 text-right">
        {/* Row 1: Name and SKU */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اسم المنتج <span className="text-rose-500">*</span>
              <span className="text-[10px] font-normal text-slate-400 mr-1.5">(يُمنع استخدام الرموز)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="مثال: عطر الفخامة الملكي"
              className={`w-full h-11 px-3.5 rounded-xl border ${
                formErrors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600`}
            />
            {formErrors.name && (
              <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" /> {formErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              رمز المنتج (SKU) <span className="text-rose-500">*</span>
              <span className="text-[10px] font-normal text-slate-400 mr-1.5">(بالإنجليزي - أقصى 15 حرف)</span>
            </label>
            <input
              type="text"
              maxLength={15}
              value={sku}
              onChange={(e) => {
                setSku(e.target.value.replace(/[^A-Za-z0-9_-]/g, ''));
                if (formErrors.sku) setFormErrors((prev) => ({ ...prev, sku: '' }));
              }}
              placeholder="BAG-101"
              dir="ltr"
              className={`w-full h-11 px-3.5 rounded-xl border ${
                formErrors.sku ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-teal-600`}
            />
            {formErrors.sku && (
              <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" /> {formErrors.sku}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              السعر بالدينار العراقي (د.ع) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (formErrors.price) setFormErrors((prev) => ({ ...prev, price: '' }));
                if (formErrors.compareAtPrice) setFormErrors((prev) => ({ ...prev, compareAtPrice: '' }));
              }}
              placeholder="45000"
              className={`w-full h-11 px-3.5 rounded-xl border ${
                formErrors.price ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-teal-600`}
            />
            {formErrors.price && (
              <p className="text-[10px] font-bold text-rose-500">{formErrors.price}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              السعر قبل الخصم (د.ع)
              <span className="text-[10px] font-normal text-slate-400 mr-1.5">(أكبر من سعر البيع)</span>
            </label>
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => {
                setCompareAtPrice(e.target.value);
                if (formErrors.compareAtPrice) setFormErrors((prev) => ({ ...prev, compareAtPrice: '' }));
              }}
              placeholder="60000"
              className={`w-full h-11 px-3.5 rounded-xl border ${
                formErrors.compareAtPrice ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-teal-600`}
            />
            {formErrors.compareAtPrice && (
              <p className="text-[10px] font-bold text-rose-500">{formErrors.compareAtPrice}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              كمية المخزون المتوفرة <span className="text-rose-500">*</span>
              <span className="text-[10px] font-normal text-slate-400 mr-1.5">(لا تقل عن 1)</span>
            </label>
            <input
              type="number"
              min="1"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                if (formErrors.stock) setFormErrors((prev) => ({ ...prev, stock: '' }));
              }}
              className={`w-full h-11 px-3.5 rounded-xl border ${
                formErrors.stock ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-teal-600`}
            />
            {formErrors.stock && (
              <p className="text-[10px] font-bold text-rose-500">{formErrors.stock}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              التصنيف <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (formErrors.category) setFormErrors((prev) => ({ ...prev, category: '' }));
              }}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-600"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  🏷️ {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Images Uploaded from Device */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              صور المنتج من ملفات الجهاز <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-500">
              (صورة أساسية إجبارية + صورتان إضافيتان اختياريتان)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => {
              const isMain = idx === 0;
              const imgUrl = images[idx];
              const uploading = isUploading === idx;

              return (
                <div
                  key={idx}
                  className={`relative rounded-2xl border-2 ${
                    isMain && !imgUrl && formErrors.mainImage
                      ? 'border-rose-400 bg-rose-50/10'
                      : isMain
                      ? 'border-teal-600/50 bg-teal-50/20 dark:bg-teal-950/20'
                      : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50'
                  } p-3 text-center flex flex-col justify-between items-center min-h-[165px] transition-all`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRefs[idx]}
                    onChange={(e) => handleImageFileChange(idx, e)}
                    className="hidden"
                  />

                  <div className="w-full flex justify-between items-center text-[10px] font-extrabold mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        isMain
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isMain ? 'الصورة الأساسية (إجباري)' : `صورة إضافية ${idx} (اختياري)`}
                    </span>

                    {imgUrl && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="text-rose-500 hover:text-rose-700 p-0.5"
                        title="حذف الصورة"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {imgUrl ? (
                    <div className="w-full my-auto flex flex-col items-center">
                      <div className="relative size-20 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 mb-1.5">
                        <img src={imgUrl} alt={`صورة ${idx + 1}`} className="size-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRefs[idx].current?.click()}
                        className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline"
                      >
                        استبدال الصورة
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRefs[idx].current?.click()}
                      disabled={uploading}
                      className="w-full my-auto py-4 flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
                    >
                      {uploading ? (
                        <RefreshCw className="size-6 animate-spin text-teal-600" />
                      ) : (
                        <Upload className="size-6 text-slate-400" />
                      )}
                      <span className="text-xs font-bold">
                        {uploading ? 'جارٍ المعالجة...' : 'اختر صورة من جهازك'}
                      </span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {formErrors.mainImage && (
            <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1">
              <AlertCircle className="size-3 shrink-0" /> {formErrors.mainImage}
            </p>
          )}
        </div>

        {/* Description: max 150 chars */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              وصف المنتج <span className="text-slate-400 text-[10px] mr-1">(لا يتعدى 150 حرفاً)</span>
            </label>
            <span
              className={`text-[11px] font-mono font-bold ${
                description.length > 150 ? 'text-rose-500' : 'text-slate-500'
              }`}
            >
              {description.length} / 150 حرف
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={150}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (formErrors.description) setFormErrors((prev) => ({ ...prev, description: '' }));
            }}
            placeholder="اكتب وصفاً شاملاً ومختصراً للمنتج..."
            className={`w-full p-3.5 rounded-xl border ${
              formErrors.description ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
            } bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600`}
          />
          {formErrors.description && (
            <p className="text-[11px] font-bold text-rose-500">{formErrors.description}</p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="active">نشط (ظاهر بالمتجر فوراً)</option>
            <option value="draft">مسودة</option>
          </select>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                <span>جارٍ الرفع والنشر...</span>
              </>
            ) : (
              <>
                <Check className="size-4" />
                <span>الحفظ والإنهاء</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
