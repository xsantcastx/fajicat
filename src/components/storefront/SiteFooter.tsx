import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 px-6 py-10 text-center text-sm text-ink/50">
      <Logo showTagline={false} className="justify-center" />
      <p className="mt-3">
        © {new Date().getFullYear()} Fajicat · Medellín, Colombia
      </p>
      <p className="mt-1">Cel 314 560 2688 · Fajicat@gmail.com</p>
    </footer>
  );
}
