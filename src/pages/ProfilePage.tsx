import React from "react";
import { logout, updatePassword } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const nav = useNavigate();
  const [password, setPassword] = React.useState("");
  const [msg, setMsg] = React.useState("");

  async function change() {
    const { error } = await updatePassword(password);
    setMsg(error ? error.message : "Пароль обновлён");
  }

  return (
    <div className="max-w-md bg-slate-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Профиль</h2>

      <input
        type="password"
        placeholder="Новый пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 rounded bg-slate-700"
      />

      <button onClick={change} className="w-full bg-emerald-600 py-2 rounded">
        Сменить пароль
      </button>

      <button
        onClick={async () => {
          await logout();
          nav("/login");
        }}
        className="w-full bg-rose-600 py-2 rounded"
      >
        Выйти
      </button>

      {msg && <div className="text-sm text-slate-300">{msg}</div>}
    </div>
  );
}
