import React from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../utils/auth";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isRegister, setIsRegister] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError("");

    const res = await (isRegister ? register(email, password) : login(email, password));

    if (!res.ok) {
      setError(res.error || "Ошибка");
      return;
    }

    nav("/", { replace: true });
  }

  return (
    <div className="max-w-sm mx-auto bg-slate-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">
        {isRegister ? "Регистрация" : "Вход"}
      </h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 rounded bg-slate-700 text-white"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        className="w-full p-2 rounded bg-slate-700 text-white"
      />

      {error && (
        <div className="rounded-lg bg-rose-500/15 border border-rose-500/40 px-3 py-2 text-rose-200 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={submit}
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 transition text-white rounded-lg"
      >
        {isRegister ? "Зарегистрироваться" : "Войти"}
      </button>

      <button
        onClick={() => setIsRegister((v) => !v)}
        className="text-sm text-slate-300 underline"
      >
        {isRegister ? "Уже есть аккаунт?" : "Создать аккаунт"}
      </button>

      {isRegister && (
        <div className="text-xs text-slate-400">
          Пароль: минимум 8 символов, 1 заглавная, 1 строчная, 1 цифра
        </div>
      )}
    </div>
  );
}
