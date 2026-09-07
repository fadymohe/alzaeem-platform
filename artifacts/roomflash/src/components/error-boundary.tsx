import {
  Component,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from 'react';

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: ComponentType<ErrorFallbackProps>;
  /** Changing this clears a caught error. Pass the route to recover on navigation. */
  resetKey?: unknown;
}

interface ErrorBoundaryState {
  error: Error | null;
}

function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === 'string') {
    return new Error(value);
  }
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error(String(value));
  }
}

function DefaultFallback({ error, resetError }: ErrorFallbackProps) {
  const errorMessage = error?.message || String(error || '');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6 text-white font-sans selection:bg-teal-500 selection:text-slate-950" dir="rtl">
      <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="size-16 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center mx-auto text-2xl font-black">
          ⚠️
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-black text-white">
            جاري استعادة الاتصال بالمتجر
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            حدث تنبيه أثناء تهيئة بيانات الصفحة. تم حفظ كافة الطلبات والبيانات بأمان.
          </p>
        </div>
        {errorMessage && (
          <div className="rounded-xl bg-slate-950 p-3 text-left font-mono text-[11px] text-teal-400 border border-slate-800/80 max-h-24 overflow-y-auto" dir="ltr">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              resetError();
              window.location.reload();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95"
          >
            إعادة المحاولة والتحديث 🔄
          </button>
          <a
            href="/"
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
          >
            الرئيسية 🏠
          </a>
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: toError(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error(
      'ErrorBoundary caught an error:',
      toError(error),
      info.componentStack,
    );
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.state.error !== null &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error === null) {
      return this.props.children;
    }
    const Fallback = this.props.FallbackComponent ?? DefaultFallback;
    return <Fallback error={error} resetError={this.resetError} />;
  }
}
