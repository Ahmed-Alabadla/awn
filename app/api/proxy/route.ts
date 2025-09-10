import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Validate URL
    const targetUrl = new URL(url);

    // Fetch the content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    // Handle different content types
    if (contentType.includes("text/html")) {
      let html = await response.text();

      // Get the current host from the request
      const currentHost = request.headers.get("host") || "localhost:3000";
      const protocol = request.url.startsWith("https") ? "https" : "http";

      // Rewrite external resource URLs to go through our proxy
      // Handle script src attributes
      html = html.replace(
        /(<script[^>]+src=["'])(https?:\/\/[^"']+)(["'][^>]*>)/gi,
        `$1${protocol}://${currentHost}/api/proxy?url=$2$3`
      );

      // Handle link href attributes (CSS files)
      html = html.replace(
        /(<link[^>]+href=["'])(https?:\/\/[^"']+)(["'][^>]*>)/gi,
        `$1${protocol}://${currentHost}/api/proxy?url=$2$3`
      );

      // Handle img src attributes
      html = html.replace(
        /(<img[^>]+src=["'])(https?:\/\/[^"']+)(["'][^>]*>)/gi,
        `$1${protocol}://${currentHost}/api/proxy?url=$2$3`
      );

      // Inject base tag to handle relative URLs
      const baseTag = `<base href="${targetUrl.origin}${targetUrl.pathname}" />`;
      html = html.replace(/<head>/i, `<head>${baseTag}`);

      // Optional: Inject custom CSS to make content responsive
      const customCSS = `
        <style>
          body { 
            margin: 0 !important; 
            padding: 10px !important; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          * { 
            max-width: 100% !important; 
            box-sizing: border-box !important; 
          }
          img { 
            height: auto !important; 
          }
          table { 
            width: 100% !important; 
            table-layout: fixed !important; 
          }
        </style>
      `;
      html = html.replace(/<\/head>/i, `${customCSS}</head>`);

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Frame-Options": "SAMEORIGIN",
          "Content-Security-Policy": "frame-ancestors 'self'",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    } else if (contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    } else {
      // For other content types (images, PDFs, etc.)
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
