import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Plus, Search, Box, Pencil, Trash2, RefreshCw, CheckCircle2, Tag, AlertTriangle, Eye } from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import { getStoredProducts, deleteStoredProduct, type StoreProduct } from '../data/storeState';

export function ProductsPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const reloadProducts = () => {
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    reloadProducts();
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('هل تريد حذف/أرشفة هذا المنتج؟')) {
      deleteStoredProduct(id);
      reloadProducts();
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
            أضف ورتب بضاعتك وحدد الأسعار بالجنيه المصري.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reloadProducts}
            className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <RefreshCw className="size-3.5" /> تحديث
          </button>
          <Link
            href="/products/new"
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="size-4" /> إضافة منتج جديد
          </Link>
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
                <div className="h-44 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="size-full object-cover" />
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

                <div className="flex items-center gap-1">
                  <Link
                    href={`/products/${p.id}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Pencil className="size-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                  >
                    <Trash2 className="size-4" />
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
    </div>
  );
}
