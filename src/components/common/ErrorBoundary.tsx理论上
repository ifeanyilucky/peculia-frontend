"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught an error in [${this.props.name || "Unknown Component"}]:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 rounded-[2rem] bg-rose-50 border border-rose-100 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-rose-900">Something went wrong here</h3>
            <p className="text-xs text-rose-600/70 mt-1 uppercase tracking-widest font-medium">
              Failed to load {this.props.name || "this section"}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-rose-600 transition-colors"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
