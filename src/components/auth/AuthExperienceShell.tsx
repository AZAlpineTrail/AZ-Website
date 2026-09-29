import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type AuthExperienceShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AuthExperienceShell({
  title,
  children,
}: AuthExperienceShellProps) {
  return (
    <>
      <Header />
      <main id="main" className="bg-[#f4f1e8] text-[#13221a]">
        <section className="mx-auto flex max-w-[1320px] items-start justify-center px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
          <h1 className="sr-only">{title}</h1>
          {children}
        </section>
      </main>
      <Footer />
    </>
  );
}
