"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(
      `/auth/login?error=${encodeURIComponent("La autenticación aún no está disponible.")}`,
    );
  }
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/cuenta");
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(
      `/auth/registro?error=${encodeURIComponent("El registro aún no está disponible.")}`,
    );
  }
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "");
  const phone = String(formData.get("phone") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });
  if (error) {
    redirect(`/auth/registro?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/auth/login?registered=1");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
