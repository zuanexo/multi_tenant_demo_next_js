import { NextRequest, NextResponse } from 'next/server'

export const config = {
    matcher: ['/', '/about', '/sites/:path'],
}

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl
    const hostname = req.headers.get('host')

    const currentHost =
        process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
            ? hostname && hostname
                .replace(`.myDomain.com`, "")
            : hostname?.includes(".localhost:3000") ? hostname.replace(`.localhost:3000`, "") : "";
    if (url.pathname.startsWith(`/sites`)) {
        url.pathname = `/404`
    } else {
        url.pathname = currentHost ? `/sites/${currentHost}${url.pathname}` : '/sites/dark'
    }

    return NextResponse.rewrite(url)
}