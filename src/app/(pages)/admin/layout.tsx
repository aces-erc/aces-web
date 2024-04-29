"use client";
import { useInnerSize } from "@/hooks/use-inner-size";
import NotSupported from "./_components/not-supported";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Sidebar from "./_components/sidebar";
import Header from "./_components/header";
import { Loader } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const size = useInnerSize();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // Admin is not supported on mobile or tablet devices.
  if (size.width < 768 || size.height < 500) {
    return <NotSupported />;
  }

  // Show a loading spinner while the user is being loaded.
  if (!isLoaded)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );

  // Redirect the user to the login page if they are not signed in or if they are not an admin.
  if (!isSignedIn || user?.publicMetadata.role !== "admin") {
    router.replace("/login");
    return null;
  }

  // you are welcome
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
