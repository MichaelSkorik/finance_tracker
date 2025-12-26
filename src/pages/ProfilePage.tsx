import React from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout, updatePassword } from "../utils/auth";

export default function ProfilePage() {
  const user = getCurrentUser();
  const nav = useNavigate();

  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [msg, setMsg] = React.useState("");

  if (!user) return null;

  function doLogout() {
    logout();
    nav("/login", { replace: true });
  }

  async function changePassword() {
    if (!user) return;
    setMsg("");
    const res = await updatePassword(user.id, oldPass, newPass);
    if (!res.ok) setMsg(res.error || "Ошибка смены пароля");
    else setMsg("Пароль обновлён");
    setOldPass("");
    setNewPass("");
  }

  return (
    <div className="max-w-md bg-slate-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Профиль</h2>

      <div className="text-slate-200">Email: {user.email}</div>
      <div className="text-slate-300 text-sm">Роль: {user.role}</div>

      <div className="rounded-xl bg-slate-700/60 p-4 space-y-3">
        <div className="font-semibold">Сменить пароль</div>

        <input
          type="password"
          placeholder="Старый пароль"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />

        <input
          type="password"
          placeholder="Новый пароль"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />

        <button
          onClick={changePassword}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 transition text-white rounded-lg"
        >
          Сменить пароль
        </button>

        {msg && (
          <div className="rounded-lg bg-slate-800/60 border border-slate-600 px-3 py-2 text-slate-200 text-sm">
            {msg}
          </div>
        )}
      </div>

      <button
        onClick={doLogout}
        className="w-full py-2 bg-rose-600 hover:bg-rose-500 transition text-white rounded-lg"
      >
        Выйти
      </button>
    </div>
  );
}
