import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const pathname = url.pathname;
        const hostname = req.headers.get("host");

        console.log("Request URL:", req.url);
        console.log("Pathname:", pathname);
        console.log("Hostname:", hostname);

        // Define the base domain
        const baseDomain = process.env.BASE_DOMAIN;
        if (!baseDomain) {
            console.error("BASE_DOMAIN is not defined");
            return NextResponse.next();
        }

        // Extract the subdomain
        const currentHost = hostname?.replace(`.${baseDomain}`, "");
        console.log("Current host:", currentHost);

        // Check if the request is for a static file or API route
        if (pathname.match(/^\/(_next|api|static)/)) {
            return NextResponse.next();
        }

        // Check for [domain]/[slug]/.page route
        const pageRouteMatch = pathname.match(/^\/([^/]+)\/([^/]+)\/\.page/);
        if (pageRouteMatch) {
            const [, domain, slug] = pageRouteMatch;
            console.log("Page route match:", domain, slug);
            // Handle the [domain]/[slug]/.page route
            return NextResponse.rewrite(new URL(`/${domain}/${slug}`, req.url));
        }

        // If there's no currentHost or it's the base domain, continue
        if (!currentHost || hostname === baseDomain) {
            console.log("No subdomain or base domain detected");
            return handleAuthAndDashboard(req);
        }

        // Derive tenant-specific data based on subdomain
        const siteId = currentHost;
        const mainDomain = `${currentHost}.customdomain.com`;

        console.log("Site ID:", siteId);
        console.log("Main domain:", mainDomain);

        let newUrl: URL;
        if (hostname === mainDomain) {
            // If accessing through the main domain, keep the current URL
            newUrl = new URL(req.url);
            console.log("Using main domain URL:", newUrl.toString());
        } else {
            // If accessing through a subdomain, rewrite to the subdomain path
            newUrl = new URL(`${url.protocol}//${baseDomain}`);
            newUrl.pathname = `/${siteId}${pathname}`;
            console.log("Constructed subdomain URL:", newUrl.toString());
        }

        const rewrite = NextResponse.rewrite(newUrl);
        console.log("Rewrite URL:", newUrl.toString());
        return handleAuthAndDashboard(req, rewrite);
    } catch (error) {
        console.error("Error in middleware:", error);
        return NextResponse.next();
    }
}

function handleAuthAndDashboard(req: NextRequest, response?: NextResponse) {
    try {
        const token = req.cookies.get("token")?.value;
        const pathname = req.nextUrl.pathname;

        console.log("Handling auth and dashboard");
        console.log("Token present:", !!token);
        console.log("Pathname:", pathname);

        if (!token && pathname.includes("/dashboard")) {
            console.log("Redirecting to sign-in");
            return NextResponse.redirect(new URL("/auth/sign-in", req.url));
        }

        if (token && pathname.includes("/auth")) {
            console.log("Redirecting to dashboard");
            return NextResponse.redirect(new URL("/dashboard/stores", req.url));
        }

        return response || NextResponse.next();
    } catch (error) {
        console.error("Error in handleAuthAndDashboard:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/',
        '/:path*',
    ]
};