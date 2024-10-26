export const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1">
      <h1>User</h1>
      {children}
    </main>
  );
};
