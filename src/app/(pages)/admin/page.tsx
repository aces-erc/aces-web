"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
const AdminPage = () => {
  return (
    <div>
      <ClerkLoading>
        <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-black dark:bg-white rounded-2xl w-fit text-white dark:text-black "
            >
              Go to Dashboard
            </Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="bg-black dark:bg-white rounded-2xl w-fit text-white dark:text-black "
            >
              Login
            </Button>
          </SignInButton>
        </SignedOut>
      </ClerkLoaded>
    </div>
  );
};
export default AdminPage;
