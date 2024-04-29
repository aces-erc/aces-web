"use client";

import { UserButton } from "@clerk/nextjs";

const AdminPage = () => {
  return (
    <div>
      <UserButton />
      <p>This is the admin page.</p>
    </div>
  );
};
export default AdminPage;
