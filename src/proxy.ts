import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // If request arrives with port 3000 from public domain (e.g. www.eclypetech.biz:3000 or eclypetech.biz:3000),
  // redirect permanently (301) to standard HTTP http://www.eclypetech.biz
  if (
    host.includes(':3000') &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1')
  ) {
    const url = new URL(request.url);
    url.port = '';
    url.host = 'www.eclypetech.biz';
    url.protocol = 'http:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
