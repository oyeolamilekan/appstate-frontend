import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    console.log("ENTERED");

    const url = req.nextUrl;
    const pathname = url.pathname;
    const hostname = req.headers.get("host") || "";
  
    console.log("Request URL:", req.url);
    console.log("Pathname:", pathname);
    console.log("Hostname:", hostname);
  
    const baseDomain = process.env.BASE_DOMAIN || "appstate.co";
  
    let subdomain;
    if (hostname.endsWith(baseDomain)) {
      subdomain = hostname.replace(`.${baseDomain}`, "");
    } else {
      // For non-production environments or if the hostname doesn't match the base domain
      subdomain = hostname.split(":")[0].replace(".localhost", "");
    }
  
    console.log("Subdomain:", subdomain);
  
    // If there's no subdomain, likely accessing the root domain, handle accordingly
    if (!subdomain || subdomain === "www") {
      console.log("No subdomain detected or www, serving root content");
      return NextResponse.next();
    }
  
    // Check if the request is for a static file or API route
    if (pathname.match(/^\/(_next|api|static)/)) {
      console.log("Static or API route detected, passing through");
      return NextResponse.next();
    }
  
    // If the pathname already starts with the subdomain, don't rewrite
    if (pathname.startsWith(`/${subdomain}`)) {
      console.log("Path already contains subdomain, passing through");
      return NextResponse.next();
    }
  
    // Rewrite the URL to include the subdomain in the path
    const newUrl = new URL(`/${subdomain}${pathname}`, req.url);
    console.log("Rewriting to:", newUrl.toString());

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