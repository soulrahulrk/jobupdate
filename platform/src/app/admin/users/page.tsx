import { listUsers } from "@/features/admin/queries";
import { UserRoleToggle } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const users = await listUsers();
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Users <span className="text-base font-normal text-muted">({users.length})</span></h1>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3 text-right">Apps</th><th className="p-3">Joined</th><th className="p-3 text-right">Action</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">
                  <div className="font-medium">{u.name ?? "—"}</div>
                  <div className="text-xs text-muted">{u.email}</div>
                </td>
                <td className="p-3">{u.role === "ADMIN" ? <Badge variant="primary">Admin</Badge> : <Badge>User</Badge>}</td>
                <td className="p-3 text-right">{u._count.applications}</td>
                <td className="p-3 text-muted">{u.createdAt.toLocaleDateString()}</td>
                <td className="p-3 text-right"><UserRoleToggle id={u.id} role={u.role} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
