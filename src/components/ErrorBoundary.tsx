import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Brew & Bites app:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#241A15] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-3xl border border-[#241A15]/10 shadow-xl space-y-4">
            <div className="w-12 h-12 bg-[#C07A3A]/10 text-[#C07A3A] rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              ☕
            </div>
            <h1 className="text-xl font-serif font-bold text-[#241A15]">
              Brew &amp; Bites Café
            </h1>
            <p className="text-xs text-[#241A15]/70 leading-relaxed">
              Something went wrong while displaying the café interface. Click below to reload cleanly.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#241A15] text-[#FAF7F2] rounded-xl text-xs font-semibold hover:bg-[#382820] transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors"
              >
                Reset Cache &amp; Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
