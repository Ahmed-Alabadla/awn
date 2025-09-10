"use client";

import React, { useState, useEffect, useRef } from "react";
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
  className = "",
  height = "60vh",
  onError,
  onLoad,
  showExternalLink = true,
  announcementId,
}: ProxyIframeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);
  const popupRef = useRef<Window | null>(null);

  const { getProxyUrl, validateUrl, error, handleError, clearError } =
    useProxyUrl({
      onError: (errorMsg) => {
        setHasError(true);
        onError?.(errorMsg);
      },
    });

  const proxyUrl = getProxyUrl(url);

  useEffect(() => {
    if (!validateUrl(url)) {
      handleError("Invalid URL provided");
      setHasError(true);
    } else {
      clearError();
      setHasError(false);
    }
  }, [url, validateUrl, handleError, clearError]);

  // Cleanup popup window on component unmount
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  const openPopupWindow = () => {
    try {
      setIsLoading(true);
      setHasError(false);
      clearError();

      // Close existing popup if open
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }

      // Calculate popup dimensions and position
      const width = Math.min(1200, window.screen.width * 0.8);
      const height = Math.min(800, window.screen.height * 0.8);
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const popup = window.open(
        url,
        `application_${announcementId}`,
        `width=${width},height=${height},left=${left},top=${top},` +
          `scrollbars=yes,resizable=yes,status=yes,toolbar=no,menubar=no,location=no`
      );

      if (!popup) {
        handleError("Popup blocked. Please allow popups for this site.");
        setHasError(true);
        setIsLoading(false);
        return;
      }

      popupRef.current = popup;
      setPopupWindow(popup);

      // Monitor popup status
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setPopupWindow(null);
          setIsLoading(false);
          onLoad?.();
        }
      }, 1000);

      // Handle popup load event
      popup.addEventListener("load", () => {
        setIsLoading(false);
        onLoad?.();
      });

      popup.addEventListener("error", () => {
        setIsLoading(false);
        setHasError(true);
        handleError("Failed to load content in popup window");
      });
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      handleError(
        `Error opening popup: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const closePopupWindow = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
      setPopupWindow(null);
    }
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
      {/* Content container */}
      <div
        className="relative flex flex-col items-center justify-center border rounded-md bg-muted/30 p-8"
        style={{ height }}
      >
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <div className="text-center">
              <h3 className="font-medium mb-2">Opening Application Form</h3>
              <p className="text-sm text-muted-foreground">
                A new window is opening with the application form...
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={closePopupWindow}>
              Cancel
            </Button>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="font-medium">Unable to open application form</h3>
              <p className="text-sm text-muted-foreground">
                {error ||
                  "The application form could not be opened. Please make sure popups are enabled."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openPopupWindow}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open Original
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Default state - show open button */}
        {!isLoading && !hasError && !popupWindow && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ExternalLink className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Ready to apply</h3>
              <p className="text-sm text-muted-foreground">
                Click below to open the application form in a new window
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={openPopupWindow}
                className="px-6"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Application Form
              </Button>
              {showExternalLink && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/announcements/${announcementId}/apply`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Direct Link
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Popup is open state */}
        {popupWindow && !popupWindow.closed && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <ExternalLink className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Application form is open</h3>
              <p className="text-sm text-muted-foreground">
                The application form is now open in a separate window. Complete
                your application there.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => popupWindow.focus()}
              >
                Focus Window
              </Button>
              <Button variant="outline" size="sm" onClick={closePopupWindow}>
                Close Window
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
