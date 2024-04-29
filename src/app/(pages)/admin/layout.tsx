import { ClerkProvider } from "@clerk/nextjs";
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClerkProvider>{children}</ClerkProvider>
    </>
  );
}
