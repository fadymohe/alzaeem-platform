import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Layers, Users, Truck, CreditCard, Megaphone, BarChart3, TrendingUp } from 'lucide-react';

interface EcosystemRadialHubProps {
  isAr?: boolean;
}

export function EcosystemRadialHub({ isAr = true }: EcosystemRadialHubProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeCycleIndex, setActiveCycleIndex] = useState<number>(0);

  // Exact node layout matching Image 2:
  // Left Column: الطلبات (Top), العملاء (Center), الشحن (Bottom)
  // Center Column: المتجر (Top), الزعيم (Center), الدفع (Bottom)
  // Right Column: النمو (Top), التحليلات (Center), التسويق (Bottom)
  const nodes = [
    {
      id: 'store',
      title: isAr ? 'المتجر' : 'Storefront',
      subtitle: isAr ? 'واجهتك التي تبيع على مدار الساعة' : 'Your 24/7 high-converting storefront',
      icon: ShoppingBag,
      gridPos: 'col-start-2 row-start-1',
      spokeId: 'spoke-store',
      // Coordinates for SVG spoke line (relative to 800x680 viewBox)
      spoke: { x1: 400, y1: 210, x2: 400, y2: 105 },
    },
    {
      id: 'growth',
      title: isAr ? 'النمو' : 'Growth',
      subtitle: isAr ? 'قرارات أذكى، ومبيعات أكبر' : 'Smarter decisions, higher revenue',
      icon: TrendingUp,
      gridPos: 'col-start-3 row-start-1',
      spokeId: 'spoke-growth',
      spoke: { x1: 490, y1: 250, x2: 610, y2: 155 },
    },
    {
      id: 'analytics',
      title: isAr ? 'التحليلات' : 'Analytics',
      subtitle: isAr ? 'أرقامك لحظة بلحظة' : 'Live performance and sales metrics',
      icon: BarChart3,
      gridPos: 'col-start-3 row-start-2',
      spokeId: 'spoke-analytics',
      spoke: { x1: 530, y1: 340, x2: 645, y2: 340 },
    },
    {
      id: 'marketing',
      title: isAr ? 'التسويق' : 'Marketing',
      subtitle: isAr ? 'كوبونات، ولاء، وإحالات، وبكسل' : 'Discounts, loyalty, referrals & Pixel',
      icon: Megaphone,
      gridPos: 'col-start-3 row-start-3',
      spokeId: 'spoke-marketing',
      spoke: { x1: 490, y1: 430, x2: 610, y2: 525 },
    },
    {
      id: 'payment',
      title: isAr ? 'الدفع' : 'Payments',
      subtitle: isAr ? 'نقدًا، زين كاش، وماستر كارد والدفع عند الاستلام' : 'COD, Zain Cash, Qi Card & cards',
      icon: CreditCard,
      gridPos: 'col-start-2 row-start-3',
      spokeId: 'spoke-payment',
      spoke: { x1: 400, y1: 470, x2: 400, y2: 575 },
    },
    {
      id: 'shipping',
      title: isAr ? 'الشحن' : 'Shipping Fleet',
      subtitle: isAr ? 'أسطول الزعيم، تغطية 18 محافظة، وبوليصة فورية' : 'Al-Zaeem Fleet, 18 cities & 1-click waybills',
      icon: Truck,
      gridPos: 'col-start-1 row-start-3',
      spokeId: 'spoke-shipping',
      spoke: { x1: 310, y1: 430, x2: 190, y2: 525 },
    },
    {
      id: 'customers',
      title: isAr ? 'العملاء' : 'Customers',
      subtitle: isAr ? 'ملف كامل لكل عميل وسجلّه' : 'Full CRM profiles & order histories',
      icon: Users,
      gridPos: 'col-start-1 row-start-2',
      spokeId: 'spoke-customers',
      spoke: { x1: 270, y1: 340, x2: 155, y2: 340 },
    },
    {
      id: 'orders',
      title: isAr ? 'الطلبات' : 'Orders',
      subtitle: isAr ? 'كل طلب بحالة ومسار واضح' : 'Real-time order tracking and statuses',
      icon: Layers,
      gridPos: 'col-start-1 row-start-1',
      spokeId: 'spoke-orders',
      spoke: { x1: 310, y1: 250, x2: 190, y2: 155 },
    },
  ];

  // Auto-cycle through the 8 nodes to create an alive, rotating energy beam
  useEffect(() => {
    if (hoveredNode) return; // Pause auto cycle while user hovers
    const interval = setInterval(() => {
      setActiveCycleIndex((prev) => (prev + 1) % nodes.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [hoveredNode, nodes.length]);

  const activeNodeId = hoveredNode || nodes[activeCycleIndex].id;

  return (
    <section className="relative py-24 px-4 bg-[#fbfcfd] overflow-hidden border-t border-slate-200/60">
      {/* Background Grid Pattern (Blueprint grid matching Image 2) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-blue-50/80 px-4 py-1.5 text-xs font-black text-blue-800 shadow-xs mb-3">
            <Sparkles className="size-3.5 text-blue-600 animate-pulse" />
            <span>{isAr ? '● المنظومة المتكاملة' : '● Unified Ecosystem'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? (
              <>
                منظومة الزعيم في قلب أعمالك —{' '}
                <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                  كل ما تحتاجه في منصة واحدة
                </span>
              </>
            ) : (
              'Al-Zaeem at the Core of Your Commerce — Everything in One Place'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 font-medium max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'تربط المنصة جميع أركان تجارتك بسلاسة تامة، من واجهة العرض والطلبات وحتى الشحن وتحصيل الأرباح.'
              : 'Seamlessly interconnecting every aspect of your store, from storefront to delivery and COD payout.'}
          </p>
        </div>

        {/* Desktop / Tablet Radial Hub Stage (exact match to Image 2 with Animation) */}
        <div className="relative hidden md:block max-w-5xl mx-auto py-10 px-4">
          {/* SVG Connection Network Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 680" fill="none">
            <defs>
              {/* Radial glow gradient */}
              <radialGradient id="hubCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>

              {/* Energy pulse linear gradient */}
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Ambient center glow circle */}
            <circle cx="400" cy="340" r="160" fill="url(#hubCenterGlow)" className="animate-hub-aura" />

            {/* Dashed outer circular orbit connecting the nodes */}
            <ellipse
              cx="400"
              cy="340"
              rx="330"
              ry="260"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              className="opacity-65"
            />

            {/* Concentric Rounded Frames around center card (exact match to Image 2) */}
            {/* Outer Rounded Frame */}
            <rect
              x="275"
              y="200"
              width="250"
              height="280"
              rx="55"
              stroke="#dbeafe"
              strokeWidth="1.5"
              className="opacity-70 transition-all duration-500"
            />
            {/* Inner Rounded Frame */}
            <rect
              x="300"
              y="225"
              width="200"
              height="230"
              rx="40"
              stroke="#93c5fd"
              strokeWidth="1.5"
              className="opacity-80 transition-all duration-500"
            />

            {/* 8 Spoke Connection Lines with Animated Energy Pulses */}
            {nodes.map((n) => {
              const isActive = activeNodeId === n.id;
              return (
                <g key={n.id} className="transition-all duration-300">
                  {/* Base static spoke line */}
                  <line
                    x1={n.spoke.x1}
                    y1={n.spoke.y1}
                    x2={n.spoke.x2}
                    y2={n.spoke.y2}
                    stroke={isActive ? '#3b82f6' : '#bfdbfe'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className="transition-colors duration-300"
                  />

                  {/* Flowing animated light pulse along the spoke */}
                  <line
                    x1={n.spoke.x1}
                    y1={n.spoke.y1}
                    x2={n.spoke.x2}
                    y2={n.spoke.y2}
                    stroke={isActive ? '#2563eb' : '#60a5fa'}
                    strokeWidth={isActive ? 3 : 2}
                    className={`animate-spoke-flow ${isActive ? 'opacity-100' : 'opacity-40'}`}
                  />

                  {/* Travelling pulse particle when active */}
                  {isActive && (
                    <circle r="4" fill="#2563eb" className="filter drop-shadow-[0_0_6px_#3b82f6]">
                      <animate
                        attributeName="cx"
                        from={n.spoke.x1}
                        to={n.spoke.x2}
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="cy"
                        from={n.spoke.y1}
                        to={n.spoke.y2}
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 3x3 Coordinate Grid for Node Placement (matching Image 2) */}
          <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-y-12 gap-x-6 items-center justify-items-center">
            {/* Top Left: الطلبات */}
            <div className="col-start-1 row-start-1">
              <NodeCard
                node={nodes[7]}
                isActive={activeNodeId === nodes[7].id}
                onHover={setHoveredNode}
              />
            </div>

            {/* Top Center: المتجر */}
            <div className="col-start-2 row-start-1">
              <NodeCard
                node={nodes[0]}
                isActive={activeNodeId === nodes[0].id}
                onHover={setHoveredNode}
              />
            </div>

            {/* Top Right: النمو */}
            <div className="col-start-3 row-start-1">
              <NodeCard
                node={nodes[1]}
                isActive={activeNodeId === nodes[1].id}
                onHover={setHoveredNode}
              />
            </div>

            {/* Center Left: العملاء */}
            <div className="col-start-1 row-start-2">
              <NodeCard
                node={nodes[6]}
                isActive={activeNodeId === nodes[6].id}
                onHover={setHoveredNode}
              />
            </div>

            {/* Center Node: Official Al-Zaeem Brand Card (exact match to Image 2) */}
            <div className="col-start-2 row-start-2 z-20">
              <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
                {/* Glowing ambient pulse ring */}
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/25 via-indigo-500/20 to-teal-400/25 rounded-[2.8rem] blur-xl -z-10 animate-hub-aura" />

                {/* Main White Center Card */}
                <div className="w-40 h-44 rounded-[2.2rem] bg-white border border-slate-200/90 shadow-2xl shadow-slate-300/80 p-4 flex flex-col items-center justify-center gap-2.5 transition-all duration-300 group-hover:shadow-blue-500/20">
                  {/* Dark indigo emblem box with Al-Zaeem Logo (matching Image 2) */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#21135c] via-[#1b104c] to-[#120a37] p-2 flex flex-col items-center justify-center shadow-md shadow-indigo-950/30">
                    <img
                      src="logo.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'logo.svg';
                      }}
                      alt="الزعيم"
                      className="size-full object-contain filter brightness-110 drop-shadow-sm"
                    />
                  </div>
                  {/* Text: الزعيم */}
                  <span className="text-2xl font-black text-slate-900 tracking-tight">الزعيم</span>
                </div>
              </div>
            </div>

            {/* Center Right: التحليلات */}
            <div className="col-start-3 row-start-2">
              <NodeCard
                node={nodes[2]}
                isActive={activeNodeId === nodes[2].id}
                onHover={setHoveredNode}
              />
            </div>

            {/* Bottom Left: الشحن */}
            <div className="col-start-1 row-start-3">
              <NodeCard
                node={nodes[5]}
                isActive={activeNodeId === nodes[5].id}
                onHover={setHoveredNode}
              />
            </div>

            {/* Bottom Center: الدفع */}
            <div className="col-start-2 row-start-3">
              <NodeCard
                node={nodes[4]}
                isActive={activeNodeId === nodes[4].id}
                onHover={setHoveredNode}
              />
            </div>

            {/* Bottom Right: التسويق */}
            <div className="col-start-3 row-start-3">
              <NodeCard
                node={nodes[3]}
                isActive={activeNodeId === nodes[3].id}
                onHover={setHoveredNode}
              />
            </div>
          </div>
        </div>

        {/* Mobile View: Responsive Flow Grid */}
        <div className="block md:hidden space-y-4">
          {/* Mobile Center Logo Hub */}
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-3xl bg-white border border-slate-200 shadow-xl p-4 flex flex-col items-center justify-center gap-2">
              <div className="w-18 h-18 rounded-2xl bg-[#1b104c] p-2 flex items-center justify-center">
                <img
                  src="logo.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'logo.svg';
                  }}
                  alt="الزعيم"
                  className="size-full object-contain"
                />
              </div>
              <span className="text-xl font-black text-slate-900">الزعيم</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {nodes.map((node) => {
              const isActive = activeNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setHoveredNode(node.id)}
                  className={`rounded-2xl border bg-white p-3.5 shadow-xs text-center space-y-1 transition-all duration-300 ${
                    isActive ? 'border-blue-400 ring-2 ring-blue-100 shadow-md scale-[1.02]' : 'border-slate-200'
                  }`}
                >
                  <div className="size-2 rounded-full bg-blue-500 mx-auto mb-1 animate-dot-pulse" />
                  <h4 className="font-extrabold text-xs text-slate-900">{node.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{node.subtitle}</p>
                </div>
              );
            })}
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
  isActive: boolean;
  onHover: (id: string | null) => void;
}

function NodeCard({ node, isActive, onHover }: NodeCardProps) {
  return (
    <div
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className={`w-48 sm:w-52 rounded-2xl border bg-white p-4 text-center transition-all duration-300 cursor-pointer ${
        isActive
          ? 'border-blue-400 -translate-y-1.5 shadow-xl shadow-blue-500/15 ring-2 ring-blue-200/80 scale-105'
          : 'border-slate-200/85 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Blue Indicator Dot (matching Image 2 with Pulse) */}
      <div className="relative size-2 mx-auto mb-2 flex items-center justify-center">
        <span
          className={`absolute inset-0 rounded-full bg-blue-400 ${
            isActive ? 'animate-ping opacity-75' : 'opacity-0'
          }`}
        />
        <span
          className={`size-2 rounded-full transition-colors duration-300 ${
            isActive ? 'bg-blue-600 shadow-[0_0_8px_#2563eb]' : 'bg-blue-500'
          }`}
        />
      </div>

      <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">{node.title}</h3>
      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{node.subtitle}</p>
    </div>
  );
}
