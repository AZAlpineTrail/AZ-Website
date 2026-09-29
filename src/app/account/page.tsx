import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail, MapPin, UserRound } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createSupabaseServerClient } from "@/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Arizona Alpine Trail account and protected download access.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <>
        <Header />
        <main id="main" className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">Account</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f6c63]">
            Supabase is not configured yet. Add your project URL and anon key to enable member accounts.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const metadata = user.user_metadata;
  const profileFacts = [
    {
      label: "Name",
      value: [metadata.first_name, metadata.last_name].filter(Boolean).join(" ") || "Not provided",
      icon: UserRound,
    },
    {
      label: "ZIP Code",
      value: metadata.zip_code ?? "Not provided",
      icon: MapPin,
    },
    {
      label: "Email",
      value: user.email ?? "Not provided",
      icon: Mail,
    },
  ];

  return (
    <>
      <Header />
      <main id="main" className="bg-[#f4f1e8] text-[#13221a]">
        <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-28 sm:px-8 lg:pt-32">
          <div className="mb-6">
            <h1 className="font-serif text-4xl font-semibold leading-[0.98] tracking-normal sm:text-5xl">
              Account
            </h1>
          </div>
          <dl className="grid gap-4 md:grid-cols-3">
            {profileFacts.map((fact) => {
              const Icon = fact.icon;

              return (
                <div
                  key={fact.label}
                  className="rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] p-5 shadow-[0_18px_44px_rgba(19,34,26,0.08)]"
                >
                  <Icon size={21} className="text-[#b74f32]" aria-hidden="true" />
                  <dt className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#b87939]">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 break-words text-lg font-semibold">
                    {fact.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
