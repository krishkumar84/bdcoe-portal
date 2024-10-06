import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
 
export async function middleware(request: NextRequest) {

    const token = await getToken({req : request})

    const url = request.nextUrl;


    if(token && (
        url.pathname.startsWith("/signin")
    )
){
    return NextResponse.redirect(new URL ("/",request.url))
}
}
 
export const config = {
  matcher:[ '/' , '/signin'],
}