import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AdminUsersPage from "./pages/AdminUsersPage";

import { getCurrentUser, isAdmin } from "./utils/auth";
import { loadTransactions, saveTransactions } from "./utils/storage";
import { applyTheme, loadSettings, t } from "./utils/settings";
import type { Transaction } from "./data";

function Protected({ children }: { children: React.ReactNode }) {
  return getCurrentUser() ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const user = getCurrentUser();

  const [settings, setSettings] = React.useState(() => loadSettings(user?.id || ""));

  React.useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    if (!user) return [];
    return loadTransactions(user.id);
  });

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) return;
    saveTransactions(u.id, transactions);
  }, [transactions]);

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) return;
    setTransactions(loadTransactions(u.id));
  }, [user?.id]);

  React.useEffect(() => {
    setSettings(loadSettings(user?.id || ""));
  }, [user?.id]);

  return (
    <BrowserRouter>
      <Layout>
        <nav className="flex gap-4 mb-6 text-slate-200">
          <Link to="/">{t(settings.lang, "nav_home")}</Link>
          <Link to="/analytics">{t(settings.lang, "nav_analytics")}</Link>
          <Link to="/profile">{t(settings.lang, "nav_profile")}</Link>
          <Link to="/settings">{t(settings.lang, "nav_settings")}</Link>
          {user && isAdmin(user) && <Link to="/admin">Admin</Link>}
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <Protected>
                <HomePage transactions={transactions} setTransactions={setTransactions} />
              </Protected>
            }
          />

          <Route
            path="/analytics"
            element={
              <Protected>
                <AnalyticsPage transactions={transactions} />
              </Protected>
            }
          />

          <Route
            path="/profile"
            element={
              <Protected>
                <ProfilePage />
              </Protected>
            }
          />

          <Route
            path="/settings"
            element={
              <Protected>
                <SettingsPage />
              </Protected>
            }
          />

          <Route
            path="/admin"
            element={
              <Protected>
                {user && isAdmin(user) ? <AdminUsersPage /> : <Navigate to="/" replace />}
              </Protected>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
