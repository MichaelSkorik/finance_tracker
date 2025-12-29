import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import {
  type AppSettings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  applyTheme,
} from "../utils/settings";
import { supabase } from "../utils/supabase";

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCurrentUser().then(async (u) => {
      if (!u) return;

      setUserId(u.id);

      try {
        const s = await loadSettings(u.id);
        setSettings(s);
        applyTheme(s.theme);
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    });
  }, []);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);

    if (key === "theme") {
      applyTheme(value as any);
    }
  }

  async function save() {
    if (!userId) return;
    await saveSettings(userId, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  async function clearTransactions() {
    if (!userId) return;

    await supabase
      .from("transactions")
      .delete()
      .eq("user_id", userId);

    window.location.reload();
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Настройки</h1>

      <div>
        <label className="block text-sm mb-1">Тема</label>
        <select
          className="input"
          value={settings.theme}
          onChange={(e) => update("theme", e.target.value as any)}
        >
          <option value="dark">Тёмная</option>
          <option value="light">Светлая</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Язык</label>
        <select
          className="input"
          value={settings.lang}
          onChange={(e) => update("lang", e.target.value as any)}
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="az">Azərbaycan</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Валюта</label>
        <select
          className="input"
          value={settings.currency}
          onChange={(e) => update("currency", e.target.value as any)}
        >
          <option value="AZN">Манаты</option>
          <option value="USD">Доллары</option>
          <option value="RUB">Рубли</option>
        </select>
      </div>

      <button className="btn-primary" onClick={save}>
        Сохранить
      </button>

      {saved && <div className="text-green-400 text-sm">Сохранено</div>}

      <hr className="opacity-20" />

      <button className="btn-danger" onClick={clearTransactions}>
        Очистить все транзакции
      </button>
    </div>
  );
}
