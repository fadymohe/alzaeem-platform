import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useGetProducts, useCreateProduct, useUpdateProduct, getGetProductsQueryKey } from '@workspace/api-client-react';
import type { ProductInput } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Box, Check, Save } from 'lucide-react';

export function ProductEditorPage() {
  const params = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const products = useGetProducts();
  const create = useCreateProduct();
  const update = useUpdateProduct();

  const item = products.data?.find((p) => p.id === Number(params.id));

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '10',
    lowStockThreshold: '5',
    category: 'أزياء',
    status: 'active',
    imageUrl: '',
    weightGrams: '0',
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        sku: item.sku,
        description: item.description,
        price: String(item.price),
        compareAtPrice: item.compareAtPrice ? String(item.compareAtPrice) : '',
        stock: String(item.stock),
        lowStockThreshold: String(item.lowStockThreshold),
        category: item.category,
        status: item.status === 'archived' ? 'draft' : item.status,
        imageUrl: item.imageUrl ?? '',
        weightGrams: String(item.weightGrams),
      });
    }
  }, [item]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: ProductInput = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold),
      category: form.category,
      status: form.status as 'active' | 'draft',
      imageUrl: form.imageUrl || null,
      weightGrams: Number(form.weightGrams),
    };

    const done = () => {
      queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      setLocation('/products');
    };

    if (item) {
      update.mutate({ id: item.id, data }, { onSuccess: done });
    } else {
      create.mutate({ data }, { onSuccess: done });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 rf-appear">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400">كتالوج المنتجات</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {item ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
          </h1>
        </div>
        <Link
          href="/products"
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <ArrowLeft className="size-4" /> العودة للقائمة
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اسم المنتج <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثال: عطر الفخامة الملكي"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              رمز المنتج (SKU) <span className="text-red-500">*</span>
            </label>
            <input
              required
              disabled={!!item}
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="BAG-101"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono ltr text-right outline-none focus:border-teal-600 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              السعر بالجنيه المصري (ج.م) <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="45000"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
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
              placeholder="60000"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              كمية المخزون المتوفرة <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              التصنيف <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="عطور / أزياء / إلكترونيات"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            رابط صورة المنتج
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm ltr text-right outline-none focus:border-teal-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            الوصف
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="اكتب وصفاً شاملاً للمنتج..."
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800"
          >
            <option value="active">نشط (ظاهر بالمتجر)</option>
            <option value="draft">مسودة</option>
          </select>

          <button
            type="submit"
            disabled={create.isPending || update.isPending}
            className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="size-4" />
            {create.isPending || update.isPending ? 'جارٍ الحفظ...' : 'حفظ البيانات'}
          </button>
        </div>
      </form>
    </div>
  );
}
