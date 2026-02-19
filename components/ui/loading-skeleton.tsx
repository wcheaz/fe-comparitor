import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function LoadingSkeleton({ className = '', lines = 1, height = 'h-4' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${height}`}
          style={{
            width: i === lines - 1 ? '60%' : '100%',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export function CardSkeleton({ className = '', showAvatar = true, lines = 3 }: CardSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        {showAvatar && (
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`bg-gray-300 dark:bg-gray-700 rounded ${
                i === 0 ? 'h-4 w-5/6' : 
                i === 1 ? 'h-3 w-4/6' : 
                'h-3 w-3/6'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className = '' }: TableSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}></div>
  );
}

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({ message = 'Loading...', className = '' }: PageLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] space-y-4 ${className}`}>
      <Spinner size="lg" />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}