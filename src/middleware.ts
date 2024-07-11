import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
export { default } from 'next-auth/middleware';

export async function middleware(request: any) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if(token){
    if(request.nextUrl.pathname !== "/chatbot" ){
      return NextResponse.redirect(new URL('/chatbot', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chatbot','/signin'], // path-to-protect
};
