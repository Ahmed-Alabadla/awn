import { useState, useCallback } from 'react';

interface UseProxyUrlOptions {
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
}

export function useProxyUrl(options: UseProxyUrlOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProxyUrl = useCallback((originalUrl: string): string => {
    if (!originalUrl) return '';
    
    // Create the proxy URL
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(originalUrl)}`;
    return proxyUrl;
  }, []);

  const validateUrl = useCallback((url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    options.onError?.(errorMessage);
  }, [options]);

  const handleLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    options.onLoading?.(loading);
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    getProxyUrl,
    validateUrl,
    isLoading,
    error,
    handleError,
    handleLoading,
    clearError,
  };
}
