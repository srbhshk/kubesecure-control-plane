'use client';

import React, { ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-6">
          <div className="p-4 bg-rose-100 rounded-full">
            <AlertTriangle className="h-12 w-10 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We encountered an unexpected error. Our team has been notified.
            </p>
            {this.state.error && (
              <pre className="mt-4 p-4 bg-muted rounded text-xs text-left overflow-auto max-w-lg mx-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <Button onClick={() => this.setState({ hasError: false })} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
