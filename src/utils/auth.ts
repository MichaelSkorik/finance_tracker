import { hashPassword, verifyPassword } from "./crypto";

export type Role = "user" | "admin";

export interface User {
  id: string;
  email: string;
  passHash: string;
  role: Role;
  createdAt: number;
}

export type Result = { ok: true } | { ok: false; error: string };
export type AuthWithUser = { ok: true; user: User } | { ok: false; error: string };

const USERS_KEY = "ft:users";
const CURRENT_KEY = "ft:currentUserId";

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as User[];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setCurrentUserId(id: string | null) {
  if (!id) localStorage.removeItem(CURRENT_KEY);
  else localStorage.setItem(CURRENT_KEY, id);
}

export function getUsers(): User[] {
  return readUsers();
}

export function clearAllUsers() {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(CURRENT_KEY);
}

export function getCurrentUser(): User | null {
  const id = localStorage.getItem(CURRENT_KEY);
  if (!id) return null;
  return readUsers().find((u) => u.id === id) || null;
}

export function logout() {
  setCurrentUserId(null);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

function passwordPolicy(password: string) {
  const p = password || "";
  if (p.length < 8) return "Минимум 8 символов";
  if (!/[a-z]/.test(p)) return "Нужна строчная буква";
  if (!/[A-Z]/.test(p)) return "Нужна заглавная буква";
  if (!/[0-9]/.test(p)) return "Нужна цифра";
  return null;
}

export async function register(email: string, password: string): Promise<AuthWithUser> {
  const e = email.trim().toLowerCase();

  if (!isValidEmail(e)) {
    return { ok: false, error: "Некорректный email" };
  }

  const passErr = passwordPolicy(password);
  if (passErr) {
    return { ok: false, error: passErr };
  }

  const users = readUsers();
  if (users.some((u) => u.email === e)) {
    return { ok: false, error: "Аккаунт уже существует" };
  }

  const firstUser = users.length === 0;

  const salt = crypto.randomUUID();
  const hash = await hashPassword(password, salt);
  const user: User = {
    id: crypto.randomUUID(),
    email: e,
    passHash: `${salt}:${hash}`,
    role: firstUser ? "admin" : "user",
    createdAt: Date.now(),
  };

  users.push(user);
  writeUsers(users);
  setCurrentUserId(user.id);

  return { ok: true, user };
}

export async function login(email: string, password: string): Promise<AuthWithUser> {
  const e = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((u) => u.email === e);
  if (!user) return { ok: false, error: "Неверные данные" };

  const [salt, hash] = user.passHash.split(":");
  const ok = await verifyPassword(password, salt, hash);
  if (!ok) return { ok: false, error: "Неверные данные" };

  setCurrentUserId(user.id);
  return { ok: true, user };
}

export function isAdmin(me: User): boolean {
  const u = getCurrentUser();
  console.log(me);
  return !!u && u.role === "admin";
}

export function setUserRole(userId: string, role: Role): Result {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return { ok: false, error: "Пользователь не найден" };
  users[idx] = { ...users[idx], role };
  writeUsers(users);
  return { ok: true };
}

export function deleteUser(userId: string): Result {
  const users = readUsers();
  const next = users.filter((u) => u.id !== userId);
  writeUsers(next);

  const cur = localStorage.getItem(CURRENT_KEY);
  if (cur === userId) setCurrentUserId(null);
  return { ok: true };
}

export async function updatePassword(userId: string, oldPass: string, newPass: string): Promise<Result> {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return { ok: false, error: "Пользователь не найден" };

  const user = users[idx];
  const [salt, hash] = user.passHash.split(":");
  if (!(await verifyPassword(oldPass, salt, hash))) {
    return { ok: false, error: "Старый пароль неверный" };
  }

  const passErr = passwordPolicy(newPass);
  if (passErr) return { ok: false, error: passErr };

  const newSalt = crypto.randomUUID();
  const newHash = await hashPassword(newPass, newSalt);
  users[idx] = { ...user, passHash: `${newSalt}:${newHash}` };
  writeUsers(users);

  return { ok: true };
}

export function setRole(email: string, role: "user" | "admin") {
  const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
  const u = users.find((x) => x.email === email);
  if (!u) return;
  u.role = role;
  localStorage.setItem("users", JSON.stringify(users));
}

