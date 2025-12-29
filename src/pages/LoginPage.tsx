import React from "react";
import { login, register } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isRegister, setIsRegister] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError("");
    const { error } = isRegister
      ? await register(email, password)
      : await login(email, password);

    if (error) {
      setError(error.message);
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
        className="w-full p-2 rounded bg-slate-700"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        className="w-full p-2 rounded bg-slate-700"
      />

      {error && <div className="text-rose-400 text-sm">{error}</div>}

      <button
        onClick={submit}
        className="w-full py-2 bg-emerald-600 rounded"
      >
        {isRegister ? "Создать аккаунт" : "Войти"}
      </button>

      <button
        onClick={() => setIsRegister((v) => !v)}
        className="text-sm text-slate-400 underline"
      >
        {isRegister ? "Уже есть аккаунт?" : "Регистрация"}
      </button>
    </div>
  );
}
