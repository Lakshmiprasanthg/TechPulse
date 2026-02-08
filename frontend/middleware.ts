import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Check if accessing protected dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // For now, we'll check localStorage on client side
    // In production, use httpOnly cookies
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
