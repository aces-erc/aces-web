import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "ACES - Association of Computer Engineering Students",
  description:
    "ACES is a Community of Computer Engineering Students established in 2070 B.S with an aim of all round development of students and build a better foundation for their carrier.",
  icons: [
    {
      url: "/logo.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider
          appearance={{
            elements: {
              footer: "hidden",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
