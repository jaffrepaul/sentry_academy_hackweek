import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    console.log('Middleware running for:', req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public pages
        const publicPaths = [
          '/',
          '/auth/signin',
          '/auth/error',
          '/api/auth',
          '/courses', // Still allow individual course pages
          '/concepts',
          '/learning-paths',
        ]

        // Check if the current path is public
        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true
        }

        // Protect admin routes - require admin role
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }

        // Protect API routes that require authentication
        if (pathname.startsWith('/api/user') || pathname.startsWith('/api/admin')) {
          return !!token
        }

        // For all other routes, require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, logos, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|logos|.*\\..*).*))',
  ],
}
