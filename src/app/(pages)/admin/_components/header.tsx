"use client";

import { UserButton, useUser } from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();
  return (
    <header className="flex h-14 justify-end items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <UserButton
        appearance={{
          elements: {
            avatarBox: {
              height: 36,
              width: 36,
            },
            userButtonTrigger: {
              outline: "none",
            },
          },
        }}
      ></UserButton>
    </header>
  );
};
export default Header;
