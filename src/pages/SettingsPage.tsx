import React from "react";
import { getCurrentUser } from "../utils/auth";
import { getSettings, updateSettings } from "../utils/settings";

export default function SettingsPage() {
  const [settings, setSettings] = React.useState({
    lang: "ru",
    currency: "AZN",
    theme: "dark",
  });

  React.useEffect(() => {
    getCurrentUser().then((u) => {
      if (!u) return;
      getSettings(u.id).then(({ data }) => data && setSettings(data));
    });
  }, []);

  async function save() {
    const u = await getCurrentUser();
    if (!u) return;
    await updateSettings(u.id, settings);
    alert("Сохранено");
  }

  return (
    <div className="max-w-md bg-slate-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Настройки</h2>

      <select
        value={settings.lang}
        onChange={(e) => setSettings({ ...settings, lang: e.target.value })}
        className="w-full p-2 rounded bg-slate-700"
      >
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="az">Azərbaycanca</option>
      </select>

      <select
        value={settings.currency}
        onChange={(e) =>
          setSettings({ ...settings, currency: e.target.value })
        }
        className="w-full p-2 rounded bg-slate-700"
      >
        <option value="AZN">AZN</option>
        <option value="USD">USD</option>
        <option value="RUB">RUB</option>
      </select>

      <select
        value={settings.theme}
        onChange={(e) =>
          setSettings({ ...settings, theme: e.target.value })
        }
        className="w-full p-2 rounded bg-slate-700"
      >
        <option value="dark">Тёмная</option>
        <option value="light">Светлая</option>
      </select>

      <button onClick={save} className="w-full bg-emerald-600 py-2 rounded">
        Сохранить
      </button>
    </div>
  );
}
