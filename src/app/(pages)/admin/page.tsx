"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const AdminPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div>
      <UserButton />
      <p>
        This is the admin page.
        <p className="text-red-500">
          {user?.publicMetadata.role === "admin"
            ? "You are an admin."
            : "You are not an admin."}
        </p>
      </p>
    </div>
  );
};
export default AdminPage;
