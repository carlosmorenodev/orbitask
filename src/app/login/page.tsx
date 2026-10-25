
import Link from "next/link";
import { signIn } from "@/app/auth/actions";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{
        error?: string;
        message?: string;
    }>;
}) {
    const { error, message } = await searchParams;

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <p className="mb-2 text-sm font-semibold text-indigo-600">
                    FLOWBOARD
                </p>

                <h1 className="text-2xl font-bold text-gray-900">
                    Bienvenido de nuevo
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Inicia sesión para acceder a tus proyectos.
                </p>

                {message === "check-email" && (
                    <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        Si el registro se ha completado, revisa tu correo para confirmar la cuenta.
                    </p>
                )}

                {error && (
                    <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error === "invalid"
                            ? "Introduce tu correo y contraseña."
                            : "No se pudo iniciar sesión. Comprueba tus credenciales y confirma tu cuenta si es necesario."}
                    </p>
                )}

                <form action={signIn} className="mt-6 space-y-4">
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
                            autoComplete="current-password"
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                            placeholder="Tu contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
                    >
                        Iniciar sesión
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    ¿Todavía no tienes cuenta?{" "}
                    <Link href="/register" className="font-medium text-indigo-600 hover:underline">
                        Regístrate
                    </Link>
                </p>
            </section>
        </main>
    );
}
