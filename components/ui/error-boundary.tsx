import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { PageLoader } from './loading-skeleton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                We apologize, but an unexpected error occurred while rendering this component.
              </p>
              
              {this.state.error && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Error details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={this.handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={this.handleRefresh}>
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error;
  onRetry?: () => void;
  showRefresh?: boolean;
  className?: string;
}

export function ErrorDisplay({ 
  title = 'Error',
  message = 'An error occurred while loading this content.',
  error,
  onRetry,
  showRefresh = true,
  className = ''
}: ErrorDisplayProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`flex items-center justify-center min-h-[200px] p-4 ${className}`}>
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-red-600">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
          
          {error && (
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                Error details
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs">
                {error.toString()}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            )}
            {showRefresh && (
              <Button onClick={handleRefresh}>
                Refresh Page
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  loading?: ReactNode;
  error?: ReactNode;
  retry?: () => void;
}

export function AsyncErrorBoundary({ 
  children, 
  loading, 
  error, 
  retry 
}: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={loading || <PageLoader />}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}