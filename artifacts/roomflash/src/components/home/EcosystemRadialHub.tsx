import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Layers, Users, Truck, CreditCard, Megaphone, BarChart3, TrendingUp } from 'lucide-react';

interface EcosystemRadialHubProps {
  isAr?: boolean;
}

export function EcosystemRadialHub({ isAr = true }: EcosystemRadialHubProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    {
      id: 'store',
      title: isAr ? 'المتجر' : 'Storefront',
      subtitle: isAr ? 'واجهتك التي تبيع على مدار الساعة' : 'Your 24/7 high-converting storefront',
      icon: ShoppingBag,
      // Position on a circle (top 12 o'clock)
      gridClass: 'col-start-2 row-start-1 -translate-y-2',
      badgeColor: 'bg-teal-500',
    },
    {
      id: 'orders',
      title: isAr ? 'الطلبات' : 'Orders',
      subtitle: isAr ? 'كل طلب بحالة ومسار واضح' : 'Real-time order tracking and statuses',
      icon: Layers,
      gridClass: 'col-start-3 row-start-1 translate-x-2 -translate-y-1',
      badgeColor: 'bg-blue-500',
    },
    {
      id: 'customers',
      title: isAr ? 'العملاء' : 'Customers',
      subtitle: isAr ? 'ملف كامل لكل عميل وسجلّه' : 'Full CRM profiles & order histories',
      icon: Users,
      gridClass: 'col-start-3 row-start-2 translate-x-4',
      badgeColor: 'bg-indigo-500',
    },
    {
      id: 'shipping',
      title: isAr ? 'الشحن' : 'Shipping Fleet',
      subtitle: isAr ? 'أسطول الزعيم، تغطية 18 محافظة، وبوليصة فورية' : 'Al-Zaeem Fleet, 18 cities & 1-click waybills',
      icon: Truck,
      gridClass: 'col-start-3 row-start-3 translate-x-2 translate-y-1',
      badgeColor: 'bg-emerald-500',
    },
    {
      id: 'payment',
      title: isAr ? 'الدفع' : 'Payments',
      subtitle: isAr ? 'نقدًا، زين كاش، وماستر كارد والدفع عند الاستلام' : 'COD, Zain Cash, Qi Card & cards',
      icon: CreditCard,
      gridClass: 'col-start-2 row-start-3 translate-y-2',
      badgeColor: 'bg-teal-500',
    },
    {
      id: 'marketing',
      title: isAr ? 'التسويق' : 'Marketing',
      subtitle: isAr ? 'كوبونات، ولاء، وإحالات، وبكسل' : 'Discounts, loyalty, referrals & Pixel',
      icon: Megaphone,
      gridClass: 'col-start-1 row-start-3 -translate-x-2 translate-y-1',
      badgeColor: 'bg-purple-500',
    },
    {
      id: 'analytics',
      title: isAr ? 'التحليلات' : 'Analytics',
      subtitle: isAr ? 'أرقامك لحظة بلحظة' : 'Live performance and sales metrics',
      icon: BarChart3,
      gridClass: 'col-start-1 row-start-2 -translate-x-4',
      badgeColor: 'bg-sky-500',
    },
    {
      id: 'growth',
      title: isAr ? 'النمو' : 'Growth',
      subtitle: isAr ? 'قرارات أذكى، ومبيعات أكبر' : 'Smarter decisions, higher revenue',
      icon: TrendingUp,
      gridClass: 'col-start-1 row-start-1 -translate-x-2 -translate-y-1',
      badgeColor: 'bg-amber-500',
    },
  ];

  return (
    <section className="relative py-24 px-4 bg-[#fbfcfd] overflow-hidden border-t border-slate-200/60">
      {/* Background Grid Pattern (matching Image 1) */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/90 bg-teal-50/80 px-4 py-1.5 text-xs font-black text-teal-800 shadow-xs mb-3">
            <Sparkles className="size-3.5 text-teal-600 animate-pulse" />
            <span>{isAr ? '● المنظومة المتكاملة' : '● Unified Ecosystem'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? (
              <>
                منظومة الزعيم في قلب أعمالك —{' '}
                <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  كل ما تحتاجه في منصة واحدة
                </span>
              </>
            ) : (
              'Al-Zaeem at the Core of Your Commerce — Everything in One Place'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 font-medium max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'تربط المنصة جميع أركان تجارتك بسلاسة تامة، من واجهة العرض وحتى وصول الشحنة وتحصيل الكاش.'
              : 'Seamlessly interconnecting every aspect of your store, from storefront to delivery and COD payout.'}
          </p>
        </div>

        {/* Desktop / Tablet Radial Hub Stage (exact match to Image 1) */}
        <div className="relative hidden md:block max-w-4xl mx-auto py-12 px-6">
          {/* Radial SVG Network Connections Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 680" fill="none">
            {/* Dashed outer circular orbit connecting the nodes */}
            <ellipse
              cx="400"
              cy="340"
              rx="310"
              ry="260"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              className="opacity-70"
            />

            {/* Concentric Rounded Frames around center card (matching Image 1) */}
            <rect
              x="300"
              y="225"
              width="200"
              height="230"
              rx="40"
              stroke="#bfdbfe"
              strokeWidth="1.5"
              className="opacity-80"
            />
            <rect
              x="275"
              y="200"
              width="250"
              height="280"
              rx="55"
              stroke="#dbeafe"
              strokeWidth="1.5"
              className="opacity-60"
            />

            {/* Radiating spoke connection lines from center to 8 nodes */}
            {/* Top (المتجر) */}
            <line x1="400" y1="200" x2="400" y2="100" stroke="#bfdbfe" strokeWidth="2" />
            {/* Top-Right (الطلبات) */}
            <line x1="490" y1="240" x2="590" y2="160" stroke="#bfdbfe" strokeWidth="2" />
            {/* Right (العملاء) */}
            <line x1="525" y1="340" x2="630" y2="340" stroke="#bfdbfe" strokeWidth="2" />
            {/* Bottom-Right (الشحن) */}
            <line x1="490" y1="440" x2="590" y2="520" stroke="#bfdbfe" strokeWidth="2" />
            {/* Bottom (الدفع) */}
            <line x1="400" y1="480" x2="400" y2="580" stroke="#bfdbfe" strokeWidth="2" />
            {/* Bottom-Left (التسويق) */}
            <line x1="310" y1="440" x2="210" y2="520" stroke="#bfdbfe" strokeWidth="2" />
            {/* Left (التحليلات) */}
            <line x1="275" y1="340" x2="170" y2="340" stroke="#bfdbfe" strokeWidth="2" />
            {/* Top-Left (النمو) */}
            <line x1="310" y1="240" x2="210" y2="160" stroke="#bfdbfe" strokeWidth="2" />
          </svg>

          {/* 3x3 Coordinate Grid for Node Placement */}
          <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-y-12 gap-x-8 items-center justify-items-center">
            {/* Node 1: المتجر (Top Center) */}
            <div className="col-start-2 row-start-1">
              <NodeCard node={nodes[0]} isCurrent={hoveredNode === 'store'} onHover={setHoveredNode} />
            </div>

            {/* Node 2: الطلبات (Top Right) */}
            <div className="col-start-3 row-start-1">
              <NodeCard node={nodes[1]} isCurrent={hoveredNode === 'orders'} onHover={setHoveredNode} />
            </div>

            {/* Node 3: العملاء (Right Center) */}
            <div className="col-start-3 row-start-2">
              <NodeCard node={nodes[2]} isCurrent={hoveredNode === 'customers'} onHover={setHoveredNode} />
            </div>

            {/* Node 4: الشحن (Bottom Right) */}
            <div className="col-start-3 row-start-3">
              <NodeCard node={nodes[3]} isCurrent={hoveredNode === 'shipping'} onHover={setHoveredNode} />
            </div>

            {/* Center Node: Official Al-Zaeem Logo Hub (replacing 'b' and 'بسيط') */}
            <div className="col-start-2 row-start-2 z-20">
              <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
                {/* Glowing ambient ring */}
                <div className="absolute -inset-3 bg-gradient-to-r from-teal-500/20 via-emerald-400/20 to-teal-600/20 rounded-[2.5rem] blur-xl -z-10 animate-pulse" />

                {/* Main White Center Card */}
                <div className="w-36 h-40 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-300/70 p-4 flex flex-col items-center justify-center gap-2">
                  <div className="size-16 rounded-2xl overflow-hidden bg-white p-1 flex items-center justify-center">
                    <img
                      src="logo.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'logo.svg';
                      }}
                      alt="الزعيم"
                      className="size-full object-contain filter drop-shadow-xs"
                    />
                  </div>
                  <span className="text-xl font-black text-slate-900 tracking-tight">الزعيم</span>
                </div>
              </div>
            </div>

            {/* Node 5: الدفع (Bottom Center) */}
            <div className="col-start-2 row-start-3">
              <NodeCard node={nodes[4]} isCurrent={hoveredNode === 'payment'} onHover={setHoveredNode} />
            </div>

            {/* Node 6: التسويق (Bottom Left) */}
            <div className="col-start-1 row-start-3">
              <NodeCard node={nodes[5]} isCurrent={hoveredNode === 'marketing'} onHover={setHoveredNode} />
            </div>

            {/* Node 7: التحليلات (Left Center) */}
            <div className="col-start-1 row-start-2">
              <NodeCard node={nodes[6]} isCurrent={hoveredNode === 'analytics'} onHover={setHoveredNode} />
            </div>

            {/* Node 8: النمو (Top Left) */}
            <div className="col-start-1 row-start-1">
              <NodeCard node={nodes[7]} isCurrent={hoveredNode === 'growth'} onHover={setHoveredNode} />
            </div>
          </div>
        </div>

        {/* Mobile View: Responsive Flow Grid */}
        <div className="block md:hidden space-y-4">
          {/* Mobile Center Logo Hub */}
          <div className="flex justify-center mb-6">
            <div className="w-36 h-36 rounded-3xl bg-white border border-slate-200 shadow-xl p-4 flex flex-col items-center justify-center gap-2">
              <div className="size-14 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-1">
                <img
                  src="logo.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'logo.svg';
                  }}
                  alt="الزعيم"
                  className="size-full object-contain"
                />
              </div>
              <span className="text-lg font-black text-slate-900">الزعيم</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs text-center space-y-1"
              >
                <div className="size-1.5 rounded-full bg-teal-500 mx-auto mb-1" />
                <h4 className="font-extrabold text-xs text-slate-900">{node.title}</h4>
                <p className="text-[10px] text-slate-500 leading-tight">{node.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface NodeCardProps {
  node: {
    id: string;
    title: string;
    subtitle: string;
  };
  isCurrent: boolean;
  onHover: (id: string | null) => void;
}

function NodeCard({ node, isCurrent, onHover }: NodeCardProps) {
  return (
    <div
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className={`w-48 sm:w-52 rounded-2xl border bg-white p-3.5 sm:p-4 text-center shadow-md shadow-slate-100 transition-all duration-300 cursor-pointer ${
        isCurrent
          ? 'border-teal-400 -translate-y-1 shadow-lg shadow-teal-500/10 ring-2 ring-teal-200'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top Blue Dot (matching Image 1) */}
      <div className="size-1.5 rounded-full bg-blue-500 mx-auto mb-1.5 transition-transform duration-300" />
      <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">{node.title}</h3>
      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{node.subtitle}</p>
    </div>
  );
}
