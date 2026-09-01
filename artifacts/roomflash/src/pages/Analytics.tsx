import { useState } from 'react';
import {
  BarChart3, TrendingUp, ShoppingBag, Users, CreditCard, CheckCircle2,
  XCircle, RotateCcw, Calendar, Filter, Sparkles
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';

export function AnalyticsPage() {
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | 'month' | 'year'>('month');

  return (
    <div className="space-y-6 rf-appear">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <BarChart3 className="size-4" /> تقارير الأداء والمبيعات
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            تحليلات المتجر والشحنات
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            قراءة دقيقة لمبيعاتك ومعدلات التوصيل الميداني في العراق.
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Calendar className="size-4 text-slate-400 ml-1" />
          {[
            { key: 'today', label: 'اليوم' },
            { key: '7d', label: '7 أيام' },
            { key: '30d', label: '30 يوم' },
            { key: 'month', label: 'هذا الشهر' },
            { key: 'year', label: 'هذه السنة' },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key as typeof period)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                period === p.key
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Tag Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 text-xs font-bold">
        <Sparkles className="size-3.5 text-amber-600" /> بيانات تحليلات موثوقة (بيانات تجريبية لعرض النمط)
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الإيرادات</span>
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <CreditCard className="size-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
            {formatIQD(12480000)}
          </p>
          <p className="text-[11px] font-bold text-teal-600 mt-1">ارتفاع بنسبة +18.2% مقارنة بالفترة السابقة</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">عدد الطلبات الشاملة</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <ShoppingBag className="size-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">347 طلب</p>
          <p className="text-[11px] font-bold text-slate-500 mt-1">المكتملة: 312 طلب</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">متوسط قيمة الطلب</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="size-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
            {formatIQD(35965)}
          </p>
          <p className="text-[11px] font-bold text-slate-500 mt-1">لكل فاتورة زبون</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الزبائن الفاعلين</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Users className="size-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">286 زبون</p>
          <p className="text-[11px] font-bold text-purple-600 mt-1">42% زبائن مكررون</p>
        </div>
      </div>

      {/* Logistics & Delivery Efficiency */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">معدل التسليم الناجح</h3>
              <p className="text-2xl font-extrabold text-teal-700 dark:text-teal-400 mt-1 font-mono">92.4%</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-teal-700 rounded-full" style={{ width: '92.4%' }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <XCircle className="size-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">معدل الإلغاء</h3>
              <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 font-mono">4.8%</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '4.8%' }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-red-50 text-red-700">
              <RotateCcw className="size-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">معدل المرتجعات</h3>
              <p className="text-2xl font-extrabold text-red-700 dark:text-red-400 mt-1 font-mono">2.8%</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '2.8%' }} />
          </div>
        </div>
      </div>

      {/* Sales Trend Visual Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            مخطط حركة المبيعات بالدينار العراقي (IQD)
          </h3>
          <span className="text-xs font-bold text-teal-700">تحديث تلقائي</span>
        </div>

        <div className="h-56 flex items-end gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
          {[
            { day: 'السبت', val: 65, amount: '1,250,000' },
            { day: 'الأحد', val: 80, amount: '1,800,000' },
            { day: 'الإثنين', val: 55, amount: '950,000' },
            { day: 'الثلاثاء', val: 92, amount: '2,100,000' },
            { day: 'الأربعاء', val: 75, amount: '1,500,000' },
            { day: 'الخميس', val: 100, amount: '2,650,000' },
            { day: 'الجمعة', val: 88, amount: '2,230,000' },
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold bg-slate-800 text-white px-1.5 py-0.5 rounded transition-opacity">
                {bar.amount} د.ع
              </span>
              <div
                className="w-full bg-teal-700 hover:bg-teal-600 rounded-t-lg transition-all"
                style={{ height: `${bar.val}%` }}
              />
              <span className="text-[11px] font-bold text-slate-500 mt-1">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
