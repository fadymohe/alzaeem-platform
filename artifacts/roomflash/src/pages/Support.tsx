import { useState, type FormEvent } from 'react';
import { HelpCircle, PhoneCall, Mail, MessageSquare, Send, Check, Building } from 'lucide-react';

export function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 rf-appear">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
          <HelpCircle className="size-4" /> مركز خدمة التجار
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          المساعدة والدعم الفني
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          فريق خدمة العملاء واللوجستيات لشركة الزعيم للشحن جاهز لمساعدتك على مدار الساعة.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-sm">
          <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center mx-auto mb-3">
            <PhoneCall className="size-6" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">الهاتف والواتساب</h3>
          <p className="text-xs text-slate-500 mt-1">متاح طوال أيام الأسبوع</p>
          <p className="font-mono font-bold text-teal-700 dark:text-teal-400 text-sm mt-3 ltr">+964 770 000 0000</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-sm">
          <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center mx-auto mb-3">
            <Building className="size-6" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">المقر الرئيسي</h3>
          <p className="text-xs text-slate-500 mt-1">بغداد - العرصات</p>
          <p className="font-bold text-slate-700 dark:text-slate-300 text-xs mt-3">شركة الزعيم للشحن والتوصيل</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-sm">
          <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center mx-auto mb-3">
            <Mail className="size-6" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">البريد الإلكتروني</h3>
          <p className="text-xs text-slate-500 mt-1">للاستفسارات والشكاوى</p>
          <p className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs mt-3">support@zaeem.iq</p>
        </div>
      </div>

      {/* Ticket Form */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white border-b pb-3">
          إرسال تذكرة استفسار أو بلاغ عن شحنة
        </h2>

        {submitted ? (
          <div className="p-4 rounded-xl bg-teal-50 text-teal-900 text-xs font-bold flex items-center gap-2">
            <Check className="size-5 text-teal-600" /> تم استلام تذكرتك بنجاح، سيتواصل معك أحد ممثلي شركة الزعيم قريباً.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                تفاصيل الاستفسار أو المشكلة
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب استفسارك بالتفصيل (مثل رقم الشحنة أو طلب مساعدة بنمط التوصيل)..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <button
              type="submit"
              className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="size-4" /> إرسال الرسالة للدعم
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
