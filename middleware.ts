// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//     console.log("Middleware triggered");
//     console.log("NODE_ENV:", process.env.NODE_ENV);
//     console.log("BASE_DOMAIN:", process.env.BASE_DOMAIN);

//     const url = req.nextUrl;
//     const pathname = url.pathname;
//     const hostname = req.headers.get("host") || "";

//     console.log("Request URL:", req.url);
//     console.log("Pathname:", pathname);
//     console.log("Hostname:", hostname);

//     // Define the base domain
//     const baseDomain = process.env.BASE_DOMAIN || "";
//     if (!baseDomain) {
//         console.error("BASE_DOMAIN is not set");
//         return NextResponse.next();
//     }

//     // Check if we're on a subdomain
//     const isSubdomain = hostname.endsWith(`.${baseDomain}`) && hostname !== `www.${baseDomain}`;
//     console.log("Is subdomain:", isSubdomain);

//     // Extract the subdomain if present
//     let subdomain = "";
//     if (isSubdomain) {
//         subdomain = hostname.replace(`.${baseDomain}`, "");
//     }
//     console.log("Subdomain:", subdomain);

//     // Check if the request is for a static file or API route
//     if (pathname.match(/^\/(_next|api|static)/)) {
//         console.log("Static or API route detected, passing through");
//         return NextResponse.next();
//     }

//     // Handle subdomain requests
//     if (isSubdomain) {
//         console.log("Handling subdomain request");
//         const newUrl = new URL(`/${subdomain}${pathname}`, `https://${baseDomain}`);
//         console.log("Rewriting to:", newUrl.toString());
//         return NextResponse.rewrite(newUrl);
//     }

//     // Handle main domain requests
//     console.log("Handling main domain request");
//     return handleAuthAndDashboard(req);
// }

// function handleAuthAndDashboard(req: NextRequest) {
//     console.log("Handling auth and dashboard");
//     const token = req.cookies.get("token")?.value;
//     const pathname = req.nextUrl.pathname;

//     console.log("Token present:", !!token);
//     console.log("Current pathname:", pathname);

//     if (!token && pathname.includes("/dashboard")) {
//         console.log("Redirecting to sign-in");
//         return NextResponse.redirect(new URL("/auth/sign-in", req.url));
//     }

//     if (token && pathname.includes("/auth")) {
//         console.log("Redirecting to dashboard");
//         return NextResponse.redirect(new URL("/dashboard/stores", req.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/',
//         '/:path*',
//     ]
// };

import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("ENTERED");

  const url = req.nextUrl;
  const pathname = url.pathname;
  const hostname = req.headers.get("host") || "";

  console.log("Request URL:", req.url);
  console.log("Pathname:", pathname);
  console.log("Hostname:", hostname);

  let currentHost;
  if (process.env.NODE_ENV === "production") {
    const baseDomain = process.env.BASE_DOMAIN;
    if (!baseDomain) {
      console.error("BASE_DOMAIN is not set in production");
      return NextResponse.next();
    }
    currentHost = hostname.replace(`.${baseDomain}`, "");
  } else {
    currentHost = hostname.split(":")[0].replace(".localhost", "");
  }

  console.log("Current Host:", currentHost);

  // If there's no currentHost, likely accessing the root domain, handle accordingly
  if (!currentHost) {
    console.log("No subdomain detected, serving root content");
    return NextResponse.next();
  }

  // Check if the request is for a static file or API route
  if (pathname.match(/^\/(_next|api|static)/)) {
    console.log("Static or API route detected, passing through");
    return NextResponse.next();
  }

  // Here, you would typically fetch tenant-specific data based on the hostname
  // For now, we'll just use the currentHost as the site_id
  const site_id = currentHost;

  console.log("Site ID:", site_id);

  // Rewrite the URL to the tenant-specific path, using the site_id
  const newUrl = new URL(`/${site_id}${pathname}`, req.url);
  console.log("Rewriting to:", newUrl.toString());
  return NextResponse.rewrite(newUrl);
}

export const config = {
  matcher: [
    '/',
    '/:path*',
  ]
};