// Vercel Edge Middleware - gates /system with HTTP Basic Auth.
//
// This is a stopgap for a static site with no application server: the
// admin panel (system/system.html) previously had zero server-side access
// control, only a client-side email check in js/auth.js that a determined
// visitor could bypass entirely (e.g. by calling the Supabase REST API
// directly). This adds a real network-level gate in front of it.
//
// Setup (required): in the Vercel project dashboard, add two Environment
// Variables - ADMIN_BASIC_AUTH_USER and ADMIN_BASIC_AUTH_PASS - then
// redeploy. Until both are set, this fails closed (blocks everyone) rather
// than failing open.
//
// This is defense-in-depth on top of, not a replacement for, the RLS-level
// admin checks in supabase-schema.sql / security-fixes-migration.sql.

export const config = {
  matcher: ['/system/:path*'],
};

export default function middleware(request) {
  const expectedUser = process.env.ADMIN_BASIC_AUTH_USER;
  const expectedPass = process.env.ADMIN_BASIC_AUTH_PASS;

  const unauthorized = () =>
    new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="BALLYLIKE Admin"' },
    });

  if (!expectedUser || !expectedPass) {
    return new Response(
      'Admin panel is not configured. Set ADMIN_BASIC_AUTH_USER and ADMIN_BASIC_AUTH_PASS in the Vercel project\'s Environment Variables, then redeploy.',
      { status: 503 }
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorized();
  }

  const decoded = atob(authHeader.slice('Basic '.length));
  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return unauthorized();
  }

  const suppliedUser = decoded.slice(0, separatorIndex);
  const suppliedPass = decoded.slice(separatorIndex + 1);

  if (suppliedUser !== expectedUser || suppliedPass !== expectedPass) {
    return unauthorized();
  }

  // Credentials valid - let the request through (returning undefined
  // continues to the requested static file).
}
