"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ExternalLink, RefreshCw, AlertTriangle } from "lucide-react";
import { useProxyUrl } from "@/hooks/useProxyUrl";
import Link from "next/link";

interface ProxyIframeProps {
  url: string;
  title?: string;
  announcementId: number;
  className?: string;
  height?: string;
  allowFullscreen?: boolean;
  sandbox?: string;
  onError?: (error: string) => void;
  onLoad?: () => void;
  showExternalLink?: boolean;
  showRefresh?: boolean;
}

export default function ProxyIframe({
  url,
  title = "External Content",
  className = "",
  height = "60vh",
  allowFullscreen = false,
  sandbox = "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads",
  onError,
  onLoad,
  showExternalLink = true,
  showRefresh = true,
  announcementId,
}: ProxyIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0); // Force iframe reload

  const { validateUrl, error, handleError, clearError } = useProxyUrl({
    onError: (errorMsg) => {
      setHasError(true);
      onError?.(errorMsg);
    },
  });

  useEffect(() => {
    if (!validateUrl(url)) {
      handleError("Invalid URL provided");
      setHasError(true);
      setIsLoading(false);
    } else {
      clearError();
      setHasError(false);
    }
  }, [url, validateUrl, handleError, clearError]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    handleError("Failed to load content");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    clearError();
    setKey((prev) => prev + 1); // Force iframe reload
  };

  if (!url || !validateUrl(url)) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Invalid or missing URL. Please provide a valid URL.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-end mb-2 gap-2">
        <div className="flex items-center gap-1 shrink-0">
          {showRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
              title="Refresh content"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
          {showExternalLink && (
            <Button
              variant="outline"
              size="sm"
              title="Open in new tab"
              className="h-8 w-8 p-0"
              asChild
            >
              <Link
                href={`/announcements/${announcementId}/apply`}
                target="_blank"
                title="Open in new tab"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Content container */}
      <div className="relative " style={{ height }}>
        {/* Loading state - overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center border rounded-md bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">
                Loading content...
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center border rounded-md bg-muted/30">
            <div className="flex flex-col items-center gap-4 p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="font-medium">Unable to load content</h3>
                <p className="text-sm text-muted-foreground">
                  {error ||
                    "The content could not be loaded. This might be due to security restrictions or the site being unavailable."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Try Again
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/announcements/${announcementId}/apply`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Original
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Iframe - always rendered when no error */}
        {!hasError && (
          <iframe
            key={key}
            src={url}
            title={title}
            className="w-full h-full border-0 rounded-md transition-opacity duration-200"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox={sandbox}
            allowFullScreen={allowFullscreen}
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
