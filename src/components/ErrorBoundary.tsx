import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      try {
        // Check if it's our structured Firestore error
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = `Legal Database Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path}`;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#E4E3E0] p-6">
          <div className="max-w-md w-full bg-white border-2 border-[#141414] rounded-2xl p-8 shadow-2xl space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-4 bg-red-50 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tighter">System Interruption</h2>
              <p className="text-sm text-[#141414]/60 font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-[#141414] text-[#E4E3E0] py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform"
            >
              <RefreshCcw className="w-4 h-4" />
              Restart Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
