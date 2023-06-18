import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

export async function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get('authorization')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const verifiedToken =
      token &&
      (await verifyAuth(token).catch((error) => {
        console.log(error);
      }));

    if (req.nextUrl.pathname.startsWith('/login') && !verifiedToken) {
      return;
    }

    if (req.nextUrl.pathname.includes('/login') && verifiedToken) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (!verifiedToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/cart/:path*', '/stock/:path*'],
};
