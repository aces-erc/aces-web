import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) {
//     auth().protect();
//   }
// });
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const user = await auth();

    // console.log("🚀 ~ clerkMiddleware ~ user:", user);
    if (!user.userId) {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
  }
  // If the route is not protected or the user is authenticated, allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
