import { NextResponse, NextRequest } from 'next/server';

const protectedPages = ['/profile', '/profile/edit'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')  
  if (protectedPages.includes(request.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
}