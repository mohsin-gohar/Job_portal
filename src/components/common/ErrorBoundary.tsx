import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-soft space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
              <span className="text-2xl font-bold">!</span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950">Something went wrong</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                An unexpected error occurred while rendering this page. You can try reloading the application.
              </p>
              {this.state.error && (
                <p className="mt-3 text-[11px] font-mono text-slate-400 break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
