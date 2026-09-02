import { Link } from 'wouter';

interface LogoProps {
  inverse?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export function Logo({ inverse = false, showSubtitle = true, className = '' }: LogoProps) {
  return (
    <Link href="/" data-testid="link-logo" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative size-10 rounded-xl overflow-hidden shadow-sm transition-all group-hover:scale-105 border border-teal-600/30 shrink-0">
        <img
          src="logo.png"
          alt="لوجو شركة الزعيم للشحن"
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xl font-extrabold tracking-tight ${
              inverse ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            الزعيم
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] font-semibold ${
              inverse ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            شركة الزعيم للشحن
          </span>
        )}
      </div>
    </Link>
  );
}
