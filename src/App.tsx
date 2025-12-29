import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import HomePage from "./pages/HomePage";

import { getCurrentUser } from "./utils/auth";

function Protected({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    getCurrentUser().then((u) => setOk(!!u));
  }, []);

  if (ok === null) return null;
  return ok ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <nav className="flex gap-4 mb-6">
          <Link to="/">Главная</Link>
          <Link to="/profile">Профиль</Link>
          <Link to="/settings">Настройки</Link>
          <Link to="/admin/users">Админ</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <Protected>
                <HomePage />
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
            path="/admin/users"
            element={
              <Protected>
                <AdminUsersPage />
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
