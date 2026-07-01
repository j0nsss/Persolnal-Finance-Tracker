import { supabase } from "./client";

export const authApi = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const profile = await fetchProfile(data.user.id);
    return {
      id: data.user.id,
      name: profile?.name ?? email.split("@")[0],
      email,
    };
  },

  async register(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (!data.user) throw new Error("Registration failed");

    const requiresEmailConfirmation = !data.session;
    return { id: data.user.id, name, email, requiresEmailConfirmation };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const profile = await fetchProfile(data.user.id);
    return {
      id: data.user.id,
      name: profile?.name ?? data.user.email?.split("@")[0] ?? "",
      email: data.user.email ?? "",
    };
  },
};

async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", userId)
    .maybeSingle();
  return data as { name: string } | null;
}
