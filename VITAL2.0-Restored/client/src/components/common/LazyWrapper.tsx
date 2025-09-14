import { Suspense, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Heart, AlertCircle } from 'lucide-react';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  error?: ReactNode;
  type?: 'page' | 'component' | 'medical';
}

// Medical-themed skeleton loader
const MedicalSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Header skeleton */}
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-[#238636]/20 rounded-full flex items-center justify-center">
        <Heart className="w-5 h-5 text-[#238636] animate-pulse" />
      </div>
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-48 bg-[#374151]" />
        <Skeleton className="h-4 w-32 bg-[#374151]" />
      </div>
    </div>

    {/* Content skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-[#1C2128] border-[#374151]">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 bg-[#374151]" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-[#374151]" />
              <Skeleton className="h-4 w-3/4 bg-[#374151]" />
              <Skeleton className="h-4 w-1/2 bg-[#374151]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1C2128] border-[#374151]">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-32 bg-[#374151]" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded bg-[#374151]" />
                  <Skeleton className="h-4 flex-1 bg-[#374151]" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Form skeleton */}
    <Card className="bg-[#1C2128] border-[#374151]">
      <CardContent className="p-6">
        <div className="space-y-6">
          <Skeleton className="h-6 w-40 bg-[#374151]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20 bg-[#374151]" />
                <Skeleton className="h-10 w-full bg-[#374151] rounded-md" />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3">
            <Skeleton className="h-10 w-24 bg-[#374151] rounded-md" />
            <Skeleton className="h-10 w-32 bg-[#238636]/20 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Component skeleton loader
const ComponentSkeleton = () => (
  <Card className="bg-[#1C2128] border-[#374151]">
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-6 rounded bg-[#374151]" />
          <Skeleton className="h-5 w-32 bg-[#374151]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-[#374151]" />
          <Skeleton className="h-4 w-2/3 bg-[#374151]" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Page loading with Replit indicator
const PageSkeleton = () => (
  <div className="min-h-screen bg-[#0D1117] p-6">
    <div className="max-w-7xl mx-auto">
      {/* Loading header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#238636]/20 rounded-lg flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#238636] animate-spin" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-[#374151]" />
            <Skeleton className="h-4 w-32 bg-[#374151]" />
          </div>
        </div>
        
        {/* Replit environment indicator */}
        <div className="flex items-center space-x-2 px-3 py-1 bg-[#238636]/10 border border-[#238636]/20 rounded-full">
          <div className="w-2 h-2 bg-[#238636] rounded-full animate-pulse" />
          <span className="text-xs text-[#238636] font-medium">
            Cargando en Replit...
          </span>
        </div>
      </div>

      {/* Content skeleton */}
      <MedicalSkeleton />
    </div>
  </div>
);

// Error boundary fallback with retry
interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
  type: string;
}

const ErrorFallback = ({ error, retry, type }: ErrorFallbackProps) => (
  <div className="min-h-[400px] flex items-center justify-center p-6">
    <Card className="bg-[#1C2128] border-[#F87171]/20 max-w-md w-full">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-[#F87171]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-[#F87171]" />
        </div>
        
        <h3 className="text-lg font-semibold text-[#E6EDF3] mb-2">
          Error al cargar {type}
        </h3>
        
        <p className="text-[#7D8590] text-sm mb-6">
          Ocurrió un error inesperado. Por favor, intenta nuevamente.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={retry}
            className="w-full bg-[#238636] text-white py-2 px-4 rounded-md hover:bg-[#2ea043] transition-colors"
          >
            <Loader2 className="w-4 h-4 mr-2 inline" />
            Reintentar
          </button>
          
          <details className="text-left">
            <summary className="text-xs text-[#7D8590] cursor-pointer hover:text-[#E6EDF3]">
              Detalles técnicos
            </summary>
            <pre className="text-xs text-[#F87171] bg-[#0F1419] p-3 rounded mt-2 overflow-auto">
              {error.message}
            </pre>
          </details>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function LazyWrapper({ 
  children, 
  fallback, 
  error, 
  type = 'component' 
}: LazyWrapperProps) {
  const getDefaultFallback = () => {
    switch (type) {
      case 'page':
        return <PageSkeleton />;
      case 'medical':
        return <MedicalSkeleton />;
      default:
        return <ComponentSkeleton />;
    }
  };

  return (
    <Suspense fallback={fallback || getDefaultFallback()}>
      {children}
    </Suspense>
  );
}

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallback?: ReactNode;
    type?: 'page' | 'component' | 'medical';
    retryAttempts?: number;
  } = {}
) {
  return function LazyComponent(props: P) {
    return (
      <LazyWrapper
        fallback={options.fallback}
        type={options.type}
      >
        <Component {...props} />
      </LazyWrapper>
    );
  };
}

// Medical error boundary component
export class MedicalErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null; retryCount: number }
> {
  private maxRetries = 3;

  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to performance manager
    console.error('Medical component error:', error, errorInfo);
    
    // Send error to backend for analysis
    fetch('/api/analytics/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        },
        context: {
          url: window.location.href,
          timestamp: Date.now(),
          retryCount: this.state.retryCount
        }
      })
    }).catch(console.error);
  }

  retry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState({ 
        hasError: false, 
        error: null, 
        retryCount: this.state.retryCount + 1 
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error!}
          retry={this.retry}
          type="componente médico"
        />
      );
    }

    return this.props.children;
  }
}