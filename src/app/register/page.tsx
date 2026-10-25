
import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export const instant = false;

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <p className="mb-2 text-sm font-semibold text-indigo-600">
                    FLOWBOARD
                </p>

                <h1 className="text-2xl font-bold text-gray-900">
                    Crea tu cuenta
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Organiza tus proyectos en un solo lugar.
                </p>

                {error && (
                    <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error === "invalid"
                            ? "Introduce un correo válido y una contraseña de al menos 8 caracteres."
                            : "No se pudo crear la cuenta. Comprueba los datos e inténtalo de nuevo."}
                    </p>
                )}

                <form action={signUp} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
                    >
                        Crear cuenta
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="font-medium text-indigo-600 hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </section>
        </main>
    );
}
