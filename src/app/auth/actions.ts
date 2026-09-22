"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/supabase/server";

export type AuthFormState = {
  status: "idle" | "error" | "success";
  message: string;
};

const idleState: AuthFormState = { status: "idle", message: "" };

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function safeNextPath(formData: FormData) {
  const next = stringValue(formData, "next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/account";
  }

  return next;
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    return "Password must include uppercase and lowercase letters.";
  }

  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }

  return null;
}

export async function signUpAction(
  _previousState: AuthFormState = idleState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;

  const firstName = stringValue(formData, "firstName");
  const lastName = stringValue(formData, "lastName");
  const zipCode = stringValue(formData, "zipCode");
  const email = stringValue(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData);
  const passwordError = validatePassword(password);

  if (!firstName || !lastName || !zipCode || !email || !password) {
    return { status: "error", message: "Complete all fields to register." };
  }

  if (!/^\d{5}(?:-\d{4})?$/.test(zipCode)) {
    return { status: "error", message: "Enter a valid ZIP code." };
  }

  if (passwordError) {
    return { status: "error", message: passwordError };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the project URL and anon key.",
    };
  }

  const profileData = {
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
    zip_code: zipCode,
  };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const callbackUrl = siteUrl
    ? `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`
    : undefined;
  const { error: createUserError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: profileData,
      emailRedirectTo: callbackUrl,
    },
  });

  if (createUserError) {
    if (/already|registered|exists/i.test(createUserError.message)) {
      return {
        status: "success",
        message: "Check your email for a confirmation link to finish registering.",
      };
    }

    return { status: "error", message: createUserError.message };
  }

  return {
    status: "success",
    message: "Check your email for a confirmation link to finish registering.",
  };
}

export async function signInAction(
  _previousState: AuthFormState = idleState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;

  const email = stringValue(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData);

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the project URL and anon key.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect(next);
}

export async function requestEmailCodeAction(
  _previousState: AuthFormState = idleState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  const email = stringValue(formData, "email").toLowerCase();

  if (!email) {
    return { status: "error", message: "Enter your email address." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Email sign-in is not configured yet." };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  if (error && !/user not found|signups not allowed/i.test(error.message)) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message: "If an account exists for that email, we sent a sign-in code.",
  };
}

export async function verifyEmailCodeAction(
  _previousState: AuthFormState = idleState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  const email = stringValue(formData, "email").toLowerCase();
  const token = stringValue(formData, "token");
  const next = safeNextPath(formData);

  if (!email || !/^\d{6,8}$/.test(token)) {
    return { status: "error", message: "Enter the code from your email." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Email sign-in is not configured yet." };
  }

  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) {
    return { status: "error", message: "That code is invalid or expired. Request a new one." };
  }

  redirect(next);
}

export async function requestPasswordResetAction(
  _previousState: AuthFormState = idleState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;

  const email = stringValue(formData, "email").toLowerCase();

  if (!email) {
    return { status: "error", message: "Enter your email address." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the project URL and anon key.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const redirectTo = siteUrl
    ? `${siteUrl}/auth/callback?next=${encodeURIComponent("/update-password")}`
    : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message:
      "If an account exists for that email, we sent password reset instructions.",
  };
}

export async function updatePasswordAction(
  _previousState: AuthFormState = idleState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const passwordError = validatePassword(password);

  if (!password || !confirmPassword) {
    return { status: "error", message: "Enter and confirm your new password." };
  }

  if (passwordError) {
    return { status: "error", message: passwordError };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the project URL and anon key.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Your password reset link expired. Request a new reset email.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message: "Your password has been updated. You can continue to your account.",
  };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
