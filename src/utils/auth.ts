import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function register(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function logout() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
}
