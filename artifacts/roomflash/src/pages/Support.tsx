import { useState, useEffect, type FormEvent } from 'react';
import { 
  HelpCircle, PhoneCall, Mail, MessageSquare, Send, CheckCircle2, 
  Building, MessageCircle, Clock, ShieldCheck, ArrowRight, ExternalLink,
  FileText, Sparkles
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  senderEmail: string;
  recipientEmail: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export function SupportPage() {
  const [storeData, setStoreData] = useState<{ name?: string; subdomain?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [targetEmail, setTargetEmail] = useState('support@zaeem.shop');
  const [category, setCategory] = useState('technical');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastTicket, setLastTicket] = useState<SupportTicket | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('zaeem_support_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let data: { name?: string; subdomain?: string } | null = null;
    try {
      const saved = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      if (saved) data = JSON.parse(saved);
    } catch {
      // ignore
    }
    if (data) setStoreData(data);
    
    // Load merchant email & name
    try {
      const userStr = localStorage.getItem('zaeem_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setMerchantEmail(u.email || 'merchant@za3em.shop');
        setMerchantName(u.name || data?.name || 'مالك المتجر');
      } else {
        setMerchantEmail('merchant@za3em.shop');
        setMerchantName(data?.name || 'مالك المتجر');
      }
    } catch {
      setMerchantEmail('merchant@za3em.shop');
      setMerchantName(data?.name || 'مالك المتجر');
    }
  }, []);

  const handleWhatsAppSupport = () => {
    const storeName = storeData?.name || 'متجري';
    const storeSubdomain = storeData?.subdomain || 'zaeem';
    const text = encodeURIComponent(
      `مرحباً دعم منصة الزعيم،\nأنا التاجر: ${merchantName}\nاسم المتجر: ${storeName} (${storeSubdomain}.za3em.shop)\nأحتاج لمساعدة بخصوص: `
    );
    window.open(`https://wa.me/9647822999919?text=${text}`, '_blank');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim()) return;

    setSubmitting(true);

    setTimeout(() => {
      const newTicketId = `TICKET-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTicket: SupportTicket = {
        id: newTicketId,
        subject: subject.trim(),
        category,
        message: message.trim(),
        senderEmail: merchantEmail,
        recipientEmail: targetEmail,
        status: 'pending',
        createdAt: new Date().toLocaleDateString('ar-IQ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updated = [newTicket, ...tickets];
      setTickets(updated);
      try {
        localStorage.setItem('zaeem_support_tickets', JSON.stringify(updated));
      } catch {
        // ignore
      }

      setLastTicket(newTicket);
      setSubmitting(false);
      setMessage('');
      setSubject('');
    }, 800);
  };

  const getGmailComposeUrl = (ticket: SupportTicket) => {
    const su = encodeURIComponent(`[${ticket.id}] ${ticket.subject} - متجر ${storeData?.name || ''}`);
    const body = encodeURIComponent(
      `مرحباً فريق الدعم الفني،\n\nتفاصيل التذكرة:\nرقم التذكرة: ${ticket.id}\nالتاجر: ${merchantName}\nالبريد الإلكتروني للتاجر: ${ticket.senderEmail}\nالمتجر: ${storeData?.name} (${storeData?.subdomain}.za3em.shop)\n\nنص الاستفسار:\n${ticket.message}\n\n--\nتم إرسال هذا الاستفسار عبر لوحة تحكم منصة الزعيم.`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ticket.recipientEmail)}&su=${su}&body=${body}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 rf-appear pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <HelpCircle className="size-4" /> مركز خدمة ودعم التجار
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            المساعدة والدعم الفني
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            فريق خدمة العملاء والعمليات اللوجستية لمنصة الزعيم جاهز لمساعدتك وحل جميع استفساراتك على مدار الساعة.
          </p>
        </div>

        {/* Direct WhatsApp Quick Button */}
        <button
          onClick={handleWhatsAppSupport}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <MessageCircle className="size-5" />
          تواصل مباشر عبر واتساب
        </button>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* WhatsApp Card */}
        <div 
          onClick={handleWhatsAppSupport}
          className="group cursor-pointer rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 text-center shadow-sm hover:shadow-md hover:border-emerald-500 transition-all"
        >
          <div className="size-12 rounded-2xl bg-emerald-600 text-white grid place-items-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
            <MessageCircle className="size-6" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">واتساب الدعم الفوري</h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">رد سريع خلال دقائق</p>
          <div className="mt-3">
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-xs inline-flex items-center gap-1 ltr">
              +964 782 299 9919 <ExternalLink className="size-3" />
            </span>
          </div>
        </div>

        {/* Phone Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-sm">
          <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center mx-auto mb-3">
            <PhoneCall className="size-6" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">الاتصال الهاتفي</h3>
          <p className="text-xs text-slate-500 mt-1">طوال أيام الأسبوع 24/7</p>
          <div className="mt-3 space-y-0.5">
            <a href="tel:07822999919" className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs block ltr hover:underline">07822999919</a>
            <a href="tel:07722999919" className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs block ltr hover:underline">07722999919</a>
          </div>
        </div>

        {/* Headquarters */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-sm">
          <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center mx-auto mb-3">
            <Building className="size-6" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">المقر الرئيسي</h3>
          <p className="text-xs text-slate-500 mt-1">العراق - بغداد</p>
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs mt-2 leading-relaxed">
            سريع الدورة - مقابل شركة تشانجان
          </p>
        </div>

        {/* Email Support */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-sm">
          <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center mx-auto mb-3">
            <Mail className="size-6" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">البريد الإلكتروني</h3>
          <p className="text-xs text-slate-500 mt-1">خدمة التجار والشركاء</p>
          <a href="mailto:support@zaeem.shop" className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs mt-3 block hover:underline">
            support@zaeem.shop
          </a>
        </div>
      </div>

      {/* Ticket Success Modal / Banner */}
      {lastTicket && (
        <div className="rounded-3xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50 via-emerald-50/50 to-teal-100/30 dark:from-teal-950/40 dark:via-slate-900 dark:to-emerald-950/20 p-6 md:p-8 shadow-md space-y-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-teal-600 text-white grid place-items-center shrink-0 shadow-md">
              <CheckCircle2 className="size-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200 text-xs font-extrabold">
                <Sparkles className="size-3.5" /> تم تسجيل وإرسال الاستفسار بنجاح
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                رقم التذكرة: <span className="font-mono text-teal-700 dark:text-teal-400">#{lastTicket.id}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                تم إرسال رسالة الاستفسار من بريدك الإلكتروني (<strong className="font-mono">{lastTicket.senderEmail}</strong>) إلى فريق الدعم (<strong className="font-mono">{lastTicket.recipientEmail}</strong>). تم إخطارك وتوثيق الطلب رسمياً عبر Gmail.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={getGmailComposeUrl(lastTicket)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Mail className="size-4" />
              فتح ومتابعة التذكرة عبر Gmail
            </a>

            <button
              onClick={handleWhatsAppSupport}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <MessageCircle className="size-4" />
              متابعة التذكرة عبر واتساب
            </button>

            <button
              onClick={() => setLastTicket(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              إغلاق الإشعار
            </button>
          </div>
        </div>
      )}

      {/* Main Ticket Submission Form */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="size-5 text-teal-600" />
              إرسال استفسار أو تذكرة دعم فني
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              سيتم إرسال الاستفسار من بريدك الإلكتروني كتاجر وتوجيهه لمكتب الدعم مع إخطارك بالردود عبر Gmail.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
            <Clock className="size-3.5 text-teal-600" /> وقت الرد المتوقع: أقل من ساعة
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Merchant Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم التاجر / صاحب المتجر
              </label>
              <input
                type="text"
                required
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="اسمك الكامل أو اسم المتجر"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-teal-600"
              />
            </div>

            {/* Merchant Sender Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                بريدك الإلكتروني (المرسل)
              </label>
              <input
                type="email"
                required
                value={merchantEmail}
                onChange={(e) => setMerchantEmail(e.target.value)}
                placeholder="merchant@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-medium outline-none focus:border-teal-600"
              />
            </div>

            {/* Destination Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                البريد الإلكتروني الموجه إليه (فريق الدعم / العميل)
              </label>
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="support@zaeem.shop"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-medium outline-none focus:border-teal-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                قسم الاستفسار
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-teal-600"
              >
                <option value="technical">مشاكل تقنية وتطوير المتجر</option>
                <option value="shipping">استفسار بخصوص الشحن والطرود</option>
                <option value="billing">الفواتير وباقات الاشتراك</option>
                <option value="domain">النطاقات والدومين الفرعي</option>
                <option value="general">استفسار عام واقتراحات</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              عنوان الاستفسار / الموضوع
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: طلب متابعة طرد شحن / مشكلة في ربط النطاق / استفسار عن خطة الاشتراك"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-teal-600"
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              تفاصيل الرسالة والاستفسار
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب تفاصيل استفسارك بدقة، رقم الشحنة إن وجد، أو المشكلة التي تواجهها لمساعدتك بسرعة وبشكل مباشر..."
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-teal-600 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <ShieldCheck className="size-4 text-teal-600" />
              يتم تشفير وتوثيق التذاكر ومتابعتها فوراً من قبل فريق العمليات.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 h-12 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  جاري تسجيل وإرسال الاستفسار...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  إرسال الاستفسار وتوليد التذكرة
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Ticket History */}
      {tickets.length > 0 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="size-4 text-teal-600" />
              سجل استفسارات وتذاكر الدعم السابقة
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {tickets.length} تذكرة مسجلة
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tickets.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                      #{t.id}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.subject}</h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.message}</p>
                  <div className="text-[11px] text-slate-400 font-medium">
                    بتاريخ: {t.createdAt} • من: {t.senderEmail}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={getGmailComposeUrl(t)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    <Mail className="size-3.5 text-red-500" /> متابعة عبر Gmail
                  </a>
                  <button
                    onClick={handleWhatsAppSupport}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 font-bold text-xs transition-colors"
                  >
                    <MessageCircle className="size-3.5" /> واتساب
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
