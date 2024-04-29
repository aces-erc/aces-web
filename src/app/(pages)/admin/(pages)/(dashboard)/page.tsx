import { UserButton, useUser } from "@clerk/nextjs";

const AdminPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <div>
      {!isLoaded && <div>Loading...</div>}
      <UserButton />
      <div>
        This is the admin page.
        <p className="text-red-500">
          {user?.publicMetadata.role === "admin"
            ? "You are an admin."
            : "You are not an admin."}
        </p>
      </div>
    </div>
  );
};
export default AdminPage;
