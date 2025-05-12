import { AdminDashboard } from "./components/admin/AdminDashboard";

export default function PlatformPage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-4 text-4xl font-bold">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
