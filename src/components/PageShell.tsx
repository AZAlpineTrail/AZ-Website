import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function PageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-5 pb-20 pt-36 sm:px-8">
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">{title}</h1>
        {description ? <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f6c63]">{description}</p> : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </main>
      <Footer />
    </>
  );
}
