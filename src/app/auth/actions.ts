
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || password.length < 8) {
        redirect("/register?error=invalid");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/confirm`,
        },
    });

    if (error) {
        redirect("/register?error=signup");
    }

    redirect("/login?message=check-email");
}

export async function signIn(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        redirect("/login?error=invalid");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect("/login?error=credentials");
    }

    redirect("/dashboard");
}

export async function signOut() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    redirect("/login");
}
