import Link from "next/link";
import { login } from "../actions";
import { Logo } from "@/components/brand/Logo";

const input =
  "w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm outline-none transition focus:border-brand-orange";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registered?: string }>;
}) {
  const sp = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <Link href="/">
        <Logo />
      </Link>
      <form
        action={login}
        className="mt-8 w-full max-w-sm space-y-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-bold text-ink">Ingresar</h1>
        {sp.registered && (
          <p className="rounded-lg bg-brand-green/15 px-3 py-2 text-sm text-brand-green-dark">
            Cuenta creada. Si tu correo necesita confirmación, revísalo y luego
            ingresa.
          </p>
        )}
        {sp.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {sp.error}
          </p>
        )}
        <input
          name="email"
          type="email"
          required
          placeholder="Correo"
          className={input}
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Contraseña"
          className={input}
        />
        <button
          type="submit"
          className="w-full rounded-full bg-brand-orange py-3 font-semibold text-white transition hover:bg-brand-orange-dark"
        >
          Ingresar
        </button>
        <p className="text-center text-sm text-ink/60">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/registro" className="font-semibold text-brand-orange">
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  );
}
