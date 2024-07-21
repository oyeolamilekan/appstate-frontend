import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const hostname = req.headers.get("host");

    // Define the base domain
    const baseDomain = process.env.NODE_ENV === "production" 
        ? process.env.BASE_DOMAIN 
        : "localhost:3000";

    // Extract the subdomain
    let currentHost;
    if (process.env.NODE_ENV === "production") {
      // Production logic remains the same
      const baseDomain = process.env.BASE_DOMAIN;
      currentHost = hostname?.replace(`.${baseDomain}`, "");
    } else {
      // Updated development logic
      currentHost = hostname?.split(":")[0].replace(".localhost", "");
    }

    // Check if the request is for a static file or API route
    if (pathname.match(/^\/(_next|api|static)/)) {
        return NextResponse.next();
    }

    // Check for [domain]/[slug]/.page route
    const pageRouteMatch = pathname.match(/^\/([^/]+)\/([^/]+)\/\.page/);
    if (pageRouteMatch) {
        const [, domain, slug] = pageRouteMatch;
        // Handle the [domain]/[slug]/.page route
        return NextResponse.rewrite(new URL(`/${domain}/${slug}`, req.url));
    }

    // If there's no currentHost or it's the base domain, continue
    if (!currentHost || hostname === baseDomain) {
        return handleAuthAndDashboard(req);
    }

    // Derive tenant-specific data based on subdomain
    const siteId = currentHost;
    const mainDomain = `${currentHost}.customdomain.com`;

    let newUrl: URL;
    if (hostname === mainDomain) {
        // If accessing through the main domain, keep the current URL
        newUrl = new URL(req.url);
    } else {
        // If accessing through a subdomain, rewrite to the subdomain path
        newUrl = new URL(`${url.protocol}//${baseDomain}`);
        newUrl.pathname = `/${siteId}${pathname}`;
    }

    const rewrite = NextResponse.rewrite(newUrl);
    return handleAuthAndDashboard(req, rewrite);
}

function handleAuthAndDashboard(req: NextRequest, response?: NextResponse) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    if (!token && pathname.includes("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    if (token && pathname.includes("/auth")) {
        return NextResponse.redirect(new URL("/dashboard/stores", req.url));
    }

    return response || NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/:path*',
    ]
};