type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  country: string | null;
  created_at: string;
};

type Props = { users: User[]; className?: string };

export function AdminUsersList({ users, className = "" }: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-earth-200 bg-earth-50 p-6 text-center text-earth-600">
        No users yet.
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-earth-200 ${className}`}>
      <table className="min-w-full text-sm">
        <thead className="bg-earth-100 text-left">
          <tr>
            <th className="px-4 py-2 font-medium text-earth-700">Name</th>
            <th className="px-4 py-2 font-medium text-earth-700">Email</th>
            <th className="px-4 py-2 font-medium text-earth-700">Role</th>
            <th className="px-4 py-2 font-medium text-earth-700">Country</th>
            <th className="px-4 py-2 font-medium text-earth-700">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-earth-200 bg-white">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.role}</td>
              <td className="px-4 py-2">{u.country ?? "—"}</td>
              <td className="px-4 py-2">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
