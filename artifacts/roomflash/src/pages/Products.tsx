import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import {
  Plus,
  Search,
  Box,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Save,
  HelpCircle
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import {
  getStoredProducts,
  addStoredProduct,
  updateStoredProduct,
  deleteStoredProduct,
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

export function ProductsPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('45000');
  const [compareAtPrice, setCompareAtPrice] = useState('58000');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState('عطور وتجميل');
  const [description, setDescription] = useState('');
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const reloadProducts = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setProducts(getStoredProducts());
      setIsRefreshing(false);
      showToast('تم تحديث قائمة المنتجات والمخزون بنجاح ✅');
    }, 450);
  };

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setSku(`PRD-${randomSuffix}`);
    setPrice('45000');
    setCompareAtPrice('58000');
    setStock('10');
    setCategory('عطور وتجميل');
    setDescription('');
    setStatus('active');
    setImages(['', '', '']);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (p: StoreProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setPrice(String(p.price));
    setCompareAtPrice(p.compareAtPrice ? String(p.compareAtPrice) : '');
    setStock(String(p.stock));
    setCategory(p.category || 'عام');
    setDescription(p.description || '');
    setStatus(p.status === 'archived' ? 'draft' : p.status);
    
    // Load existing images
    const existingImgs = p.images && p.images.length > 0
      ? [...p.images]
      : (p.imageUrl ? [p.imageUrl] : []);
    while (existingImgs.length < 3) existingImgs.push('');
    setImages(existingImgs.slice(0, 3));
    setFormErrors({});
    setShowModal(true);
  };

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
      alert('حدث خطأ أثناء قراءة ملف الصورة من جهازك، يرجى تجربة صورة أخرى.');
    } finally {
      setIsUploading(null);
      // Reset input value so re-uploading the same file triggers onChange
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
      errors.sku = 'رمز المنتج يجب أن يُكتب بالإنجليزية ولا يتعدى 15 حرفاً (أحرف إنجليزية، أرقام، أو شرطة)';
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
          errors.compareAtPrice = 'السعر قبل الخصم يجب أن يكون أكبر قطيعاً من السعر بعد الخصم (سعر البيع الحالي)';
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
      errors.category = 'يرجى اختيار تصنيف المنتج من القائمة';
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    try {
      setIsSaving(true);
      const priceNum = Number(price);
      const compareNum = compareAtPrice ? Number(compareAtPrice) : null;
      const stockNum = parseInt(stock, 10) || 1;
      const validImages = images.filter((img) => Boolean(img && img.trim()));

      if (editingProduct) {
        // Edit Mode
        const updated = updateStoredProduct(editingProduct.id, {
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
        showToast('تم حفظ تعديلات المنتج ورفعها على السيرفر ونشرها في الموقع فوراً! ✅');
      } else {
        // Add Mode
        const newProduct = addStoredProduct({
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

        await syncProductToLiveStoreAndServer(newProduct);
        showToast('تمت إضافة المنتج ورفعه على السيرفر ونشره على المتجر فوراً! ✅');
      }

      setProducts(getStoredProducts());
      setShowModal(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('حدث خطأ أثناء حفظ المنتج، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل تريد بالتأكيد حذف هذا المنتج من كتالوج المتجر؟')) {
      deleteStoredProduct(id);
      setProducts(getStoredProducts());
      showToast('تم حذف المنتج بنجاح ✅');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 rf-appear">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-teal-500/50 text-white px-5 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Box className="size-4" /> كتالوج بضائعك
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إدارة المنتجات والمخزون
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            أضف وعدل بضاعتك وارفع الصور من جهازك لتُنشر فوراً على السيرفر ومتجرك الحي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isRefreshing}
            onClick={reloadProducts}
            className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
            <span>{isRefreshing ? 'جارٍ التحديث...' : 'تحديث'}</span>
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="size-4" /> إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3.5 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المنتج أو الرمز (SKU) أو القسم..."
            className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:border-teal-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
        >
          <option value="all">جميع الحالات ({products.length})</option>
          <option value="active">نشط (Active)</option>
          <option value="draft">مسودة (Draft)</option>
          <option value="archived">مؤرشف (Archived)</option>
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Product Header / Image */}
              <div>
                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden group">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="size-full grid place-items-center text-slate-400 font-bold text-xs">
                      لا توجد صورة
                    </div>
                  )}

                  <span className="absolute top-3 right-3 text-[10px] font-black bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-mono border border-white/20">
                    {p.sku}
                  </span>

                  <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    p.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'
                  }`}>
                    {p.status === 'active' ? 'نشط' : 'مسودة'}
                  </span>

                  {p.images && p.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 text-[10px] font-black bg-teal-900/90 text-teal-200 border border-teal-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md">
                      <ImageIcon className="size-3" /> {p.images.length} صور
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      المخزون: {p.stock} قطعة
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {p.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'لا يوجد وصف للمنتج.'}
                  </p>
                </div>
              </div>

              {/* Product Footer Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-[11px] text-slate-400 line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(p)}
                    title="تعديل تفاصيل المنتج"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Pencil className="size-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    title="حذف المنتج"
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <Box className="size-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300">لا توجد منتجات مطابقة</h3>
          <p className="text-xs text-slate-500">أضف منتجاتك الأولى لتبدأ بالبيع فوراً.</p>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-5 shadow-2xl text-right animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                  {editingProduct ? 'تعديل بيانات المنتج الحالية' : 'إضافة منتج جديد للكتالوج'}
                </span>
                <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                  {editingProduct ? editingProduct.name : 'إضافة منتج جديد'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-right">
              {/* Row 1: Name and SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* اسم المنتج */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
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
                    placeholder="مثال: عطر الفخامة الملكي الفاخر"
                    className={`w-full h-11 px-3.5 rounded-xl border ${
                      formErrors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    } bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {formErrors.name && (
                    <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="size-3 shrink-0" /> {formErrors.name}
                    </p>
                  )}
                </div>

                {/* رمز المنتج (SKU) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
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
                    placeholder="PERFUME-01"
                    dir="ltr"
                    className={`w-full h-11 px-3.5 rounded-xl border ${
                      formErrors.sku ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    } bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {formErrors.sku && (
                    <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="size-3 shrink-0" /> {formErrors.sku}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Price and CompareAtPrice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* السعر بالدينار العراقي */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    سعر البيع بالدينار العراقي (د.ع) <span className="text-rose-500">*</span>
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
                      formErrors.price ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    } bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {formErrors.price && (
                    <p className="text-[10px] font-bold text-rose-500">{formErrors.price}</p>
                  )}
                </div>

                {/* السعر قبل الخصم */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    السعر قبل الخصم (د.ع)
                    <span className="text-[10px] font-normal text-slate-400 mr-1.5">(يجب أن يكون أكبر من سعر البيع)</span>
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
                      formErrors.compareAtPrice ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    } bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {formErrors.compareAtPrice && (
                    <p className="text-[10px] font-bold text-rose-500 leading-tight">{formErrors.compareAtPrice}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Stock and Category Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* الكمية */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    كمية المخزون <span className="text-rose-500">*</span>
                    <span className="text-[10px] font-normal text-slate-400 mr-1.5">(لا يمكن أن تقل عن قطعة واحدة)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                      if (formErrors.stock) setFormErrors((prev) => ({ ...prev, stock: '' }));
                    }}
                    placeholder="10"
                    className={`w-full h-11 px-3.5 rounded-xl border ${
                      formErrors.stock ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    } bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {formErrors.stock && (
                    <p className="text-[10px] font-bold text-rose-500">{formErrors.stock}</p>
                  )}
                </div>

                {/* التصنيف (قائمة منسدلة) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    التصنيف <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (formErrors.category) setFormErrors((prev) => ({ ...prev, category: '' }));
                    }}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        🏷️ {cat}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-[10px] font-bold text-rose-500">{formErrors.category}</p>
                  )}
                </div>
              </div>

              {/* Row 4: Device File Uploads for 3 images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
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
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRefs[idx]}
                          onChange={(e) => handleImageFileChange(idx, e)}
                          className="hidden"
                        />

                        {/* Top Badge */}
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

                        {/* Image Preview or Upload Prompt */}
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

              {/* Row 5: Description with 150 characters limit */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
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
                  placeholder="اكتب وصفاً جذاباً ومختصراً للمنتج (مميزاته، مواصفاته، خاماته)..."
                  className={`w-full p-3 rounded-xl border ${
                    formErrors.description ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                  } bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                />
                {formErrors.description && (
                  <p className="text-[11px] font-bold text-rose-500">{formErrors.description}</p>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">حالة المنتج:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
                    className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="active">نشط (يظهر بالمتجر فوراً)</option>
                    <option value="draft">مسودة (غير معروض)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60 active:scale-95"
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
