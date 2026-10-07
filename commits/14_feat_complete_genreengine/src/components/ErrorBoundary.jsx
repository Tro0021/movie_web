import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Kinova ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#121210] border border-[#262522] rounded-[4px] p-8 text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-[2px] bg-[#181816] border border-[#262522] flex items-center justify-center text-[#E03C31]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-serif text-[#F4F0EA]">
                Ledger Display Interrupted
              </h3>
              <p className="text-xs font-mono text-[#8C877E] leading-relaxed">
                An anomaly in media telemetry occurred. The archive terminal has contained it safely.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-[4px] bg-[#181816] hover:bg-[#22221f] text-[#F4F0EA] border border-[#262522] text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  if (typeof window !== 'undefined') {
                    window.location.href = '/';
                  }
                }}
                className="px-4 py-2 rounded-[4px] bg-[#E03C31] hover:bg-[#c83228] text-white text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Film Vault</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
