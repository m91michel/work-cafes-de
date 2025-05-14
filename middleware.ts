import { NextRequest } from 'next/server'
import { updateSession } from '@/libs/supabase/utils'

// export async function middleware(request: NextRequest) {
//   return await updateSession(request)
// }
export default function middleware() { }

export const config = {
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico (favicon file)
  //    * - public (public files)
  //    * - api (API routes)
  //    */
  //   '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  // ],
  matcher: []
} 