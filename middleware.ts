import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

const isUnprotectedRoute = createRouteMatcher([
  '/login(.*)',
  '/signup(.*)',
  '/',
]);

export default clerkMiddleware((auth, req) => {
  if (!isUnprotectedRoute(req)) auth().protect();
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};