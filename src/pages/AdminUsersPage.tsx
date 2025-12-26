import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, getUsers, isAdmin, setRole } from "../utils/auth";
import type { User } from "../utils/auth";

export default function AdminUsersPage() {
  const me = getCurrentUser();
  if (!me) return <Navigate to="/login" replace />;
  if (!isAdmin(me)) return <Navigate to="/" replace />;

  const [users, setUsers] = React.useState<User[]>(() => getUsers());

  function refresh() {
    setUsers(getUsers());
  }

  function makeAdmin(email: string) {
    setRole(email, "admin");
    refresh();
  }

  function makeUser(email: string) {
    setRole(email, "user");
    refresh();
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Admin: Users</h2>

      <div className="rounded-xl overflow-hidden border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/40">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-700">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{new Date(u.createdAt).toLocaleString("ru-RU")}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => makeAdmin(u.email)}
                    className="px-3 py-1 rounded bg-emerald-600 text-white"
                  >
                    admin
                  </button>
                  <button
                    onClick={() => makeUser(u.email)}
                    className="px-3 py-1 rounded bg-slate-700 text-white"
                  >
                    user
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
