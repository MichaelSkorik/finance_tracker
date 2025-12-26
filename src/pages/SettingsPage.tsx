import React from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";
import {
  applyTheme,
  loadSettings,
  saveSettings,
  type AppSettings,
} from "../utils/settings";
import { clearTransactions } from "../utils/storage";

export default function SettingsPage() {
  const user = getCurrentUser();
  const nav = useNavigate();

  if (!user) return null;

  const [s, setS] = React.useState<AppSettings>(() => loadSettings(user.id));
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    applyTheme(s.theme);
    saveSettings(s);
  }, [s]);

  function clearAllTx() {
    if (user) {
      clearTransactions(user.id);
      location.reload();
    }
  }

  return (
    <div className="max-w-md bg-slate-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Настройки</h2>

      <div className="space-y-2">
        <div className="text-sm text-slate-300">Тема</div>
        <select
          value={s.theme}
          onChange={(e) => setS((p) => ({ ...p, theme: e.target.value as any }))}
          className="w-full p-2 rounded bg-slate-700 text-white"
        >
          <option value="dark">Тёмная</option>
          <option value="light">Светлая</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-slate-300">Язык</div>
        <select
          value={s.lang}
          onChange={(e) => setS((p) => ({ ...p, lang: e.target.value as any }))}
          className="w-full p-2 rounded bg-slate-700 text-white"
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="az">Azərbaycan</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-slate-300">Валюта</div>
        <select
          value={s.currency}
          onChange={(e) =>
            setS((p) => ({ ...p, currency: e.target.value as any }))
          }
          className="w-full p-2 rounded bg-slate-700 text-white"
        >
          <option value="AZN">AZN</option>
          <option value="USD">USD</option>
          <option value="RUB">RUB</option>
        </select>
      </div>

      <button
        onClick={() => {
          setMsg("");
          clearAllTx();
        }}
        className="w-full py-2 bg-slate-700 hover:bg-slate-600 transition text-white rounded-lg"
      >
        Очистить транзакции
      </button>

      <button
        onClick={() => {
          logout();
          nav("/login", { replace: true });
        }}
        className="w-full py-2 bg-rose-600 hover:bg-rose-500 transition text-white rounded-lg"
      >
        Выйти
      </button>

      {msg && (
        <div className="rounded-lg bg-slate-800/60 border border-slate-600 px-3 py-2 text-slate-200 text-sm">
          {msg}
        </div>
      )}
    </div>
  );
}
