import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { IUser } from './interfaces';

export async function middleware(request: NextRequest) {

    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    //console.log({session})

    if (!session) {
        if (request.nextUrl.pathname.startsWith('/api/admin')) {
            return NextResponse.redirect(new URL('/api/auth/unauthorized', request.url));
        }

        const requestedPage = request.nextUrl.pathname;
        const url = request.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;
        return NextResponse.redirect(url);
    }

    const validRoles = ['admin', 'super-user', 'SEO'];

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!validRoles.includes((session.user as IUser).role)) {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    }

    if (request.nextUrl.pathname.startsWith('/api/admin')) {

        if (!validRoles.includes((session.user as IUser).role)) {
            return NextResponse.redirect(new URL('/api/auth/unauthorized', request.url));
        }

    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/checkout/:path*',
        '/admin/:path*',
        '/((?!api/admin/upload)api/admin/:path*)',
    ],
};