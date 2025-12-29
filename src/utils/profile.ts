import { supabase } from './supabase';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, patch: Partial<any>) {
  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId);

  if (error) throw error;
}
