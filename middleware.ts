import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest, _: NextResponse) {
    const token = request.cookies.get("token")?.value;

    if (!token && request.nextUrl.pathname.includes("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    if (token && request.nextUrl.pathname.includes("/auth")) {
        return NextResponse.redirect(new URL("/dashboard/stores", request.url))
    }

}

export const config = {
    matcher: [
        '/',
        '/auth/:path*',
        '/dashboard/:path*',
    ]
};

