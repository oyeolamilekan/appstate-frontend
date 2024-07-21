import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const hostname = req.headers.get("host") || "";

    console.log("Current hostname:", hostname);
    console.log("Current pathname:", pathname);
    console.log("NODE_ENV:", process.env.NODE_ENV);

    // Define the base domain
    let baseDomain: string;
    if (process.env.NODE_ENV === "production") {
        baseDomain = process.env.BASE_DOMAIN || "";
        console.log("Production BASE_DOMAIN:", baseDomain);
    } else {
        baseDomain = "localhost:3000";
        console.log("Development baseDomain:", baseDomain);
    }

    if (!baseDomain) {
        console.error("Base domain is not defined. Please set the BASE_DOMAIN environment variable in production.");
        return NextResponse.next();
    }

    // Extract the subdomain
    const currentHost = hostname.replace(`.${baseDomain}`, "");
    console.log("Current host (potential subdomain):", currentHost);

    // Check if the request is for a static file or API route
    if (pathname.match(/^\/(_next|api|static)/)) {
        return NextResponse.next();
    }

    // Check for [domain]/[slug]/.page route
    const pageRouteMatch = pathname.match(/^\/([^/]+)\/([^/]+)\/\.page/);
    if (pageRouteMatch) {
        const [, domain, slug] = pageRouteMatch;
        console.log("Page route match:", domain, slug);
        return NextResponse.rewrite(new URL(`/${domain}/${slug}`, req.url));
    }

    // If there's no subdomain or it's the base domain, continue
    if (currentHost === hostname || hostname === baseDomain) {
        console.log("No subdomain detected or base domain accessed");
        return handleAuthAndDashboard(req);
    }

    // Derive tenant-specific data based on subdomain
    const siteId = currentHost;
    const mainDomain = `${currentHost}.customdomain.com`;
    console.log("Detected siteId:", siteId);
    console.log("Main domain:", mainDomain);

    let newUrl: URL;
    if (hostname === mainDomain) {
        newUrl = new URL(req.url);
        console.log("Accessing through main domain, keeping current URL:", newUrl.toString());
    } else {
        newUrl = new URL(`${url.protocol}//${baseDomain}`);
        newUrl.pathname = `/${siteId}${pathname}`;
        console.log("Rewriting URL for subdomain:", newUrl.toString());
    }

    const rewrite = NextResponse.rewrite(newUrl);
    return handleAuthAndDashboard(req, rewrite);
}

function handleAuthAndDashboard(req: NextRequest, response?: NextResponse) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    console.log("Handling auth and dashboard");
    console.log("Token present:", !!token);
    console.log("Current pathname:", pathname);

    if (!token && pathname.includes("/dashboard")) {
        console.log("Redirecting to sign-in");
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    if (token && pathname.includes("/auth")) {
        console.log("Redirecting to dashboard");
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