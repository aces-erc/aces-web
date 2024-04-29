"use client";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { AlertTriangleIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
const page = () => {
  return (
    <div>
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Welcome to the ACES CMS
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your content with ease.
            </p>
          </div>
          <ClerkLoading>
            <Loader className="h-5 w-5  text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="inline-flex w-full justify-center rounded-md bg-gray-900 px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900">
                  Login
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="inline-flex w-full justify-center rounded-md bg-gray-900 px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>

          <div className="rounded-md bg-red-100 p-4 text-center text-sm text-red-700 dark:bg-red-900 dark:text-red-50 flex items-center justify-center gap-2">
            <AlertTriangleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
            <p>
              If you are not an authorized person to visit this page then leave
              immediately. Each and every action are being recorded.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
