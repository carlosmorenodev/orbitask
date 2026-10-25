
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/auth/actions";
import { createProject } from "./actions";
import DeleteProjectButton from "@/components/DeleteProjectButton";

type DashboardProps = {
    searchParams: Promise<{
        error?: string;
        message?: string;
    }>;
};

export default async function DashboardPage({
    searchParams,
}: DashboardProps) {
    const params = await searchParams;
    const supabase = await createClient();

    const { data, error: authError } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;

    if (authError || !userId) {
        redirect("/login");
    }

    const email = data.claims.email;

    const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, name, description, created_at")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

    const errorMessages: Record<string, string> = {
        "empty-name": "Escribe un nombre para el proyecto.",
        "create-project":
            "No se pudo crear el proyecto. Comprueba las políticas RLS de Supabase.",
        "add-member":
            "El proyecto se creó, pero no se pudo registrar al propietario como miembro.",
        "delete-project":
            "No se pudo eliminar el proyecto. Comprueba los permisos de Supabase.",
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <div className="mx-auto max-w-5xl">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    {/* <div>
                        <p className="text-sm font-semibold text-indigo-600">
                            FLOWBOARD
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Mis proyectos
                        </h1>
                    </div> */}

                    <div>
                        <p className="text-sm font-semibold text-indigo-600">
                            ORBITASK
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Bienvenido, {email ?? "usuario"}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Aquí tienes todos tus proyectos.
                        </p>
                    </div>

                    <form action={signOut}>
                        <button
                            type="submit"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                        >
                            Cerrar sesión
                        </button>
                    </form>
                </header>

                {params.message === "project-deleted" && (
                    <p
                        role="status"
                        className="mt-6 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                    >
                        Proyecto eliminado correctamente.
                    </p>
                )}

                {params.error && (
                    <p
                        role="alert"
                        className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {errorMessages[params.error] ??
                            "Ha ocurrido un error inesperado."}
                    </p>
                )}

                {projectsError && (
                    <p
                        role="alert"
                        className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        No se pudieron cargar los proyectos. Revisa las políticas RLS.
                    </p>
                )}

                <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Crear un proyecto
                    </h2>

                    <form action={createProject} className="mt-4 space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Nombre del proyecto
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                maxLength={100}
                                placeholder="Ej. Rediseño de mi portfolio"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Descripción (opcional)
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                maxLength={500}
                                placeholder="¿En qué consiste este proyecto?"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700"
                        >
                            Crear proyecto
                        </button>
                    </form>
                </section>

                <section className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Tus proyectos
                    </h2>

                    {!projectsError &&
                        (!projects || projects.length === 0) ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                            <p className="font-medium text-gray-700">
                                Todavía no tienes proyectos.
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Crea el primero con el formulario de arriba.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {(projects ?? []).map((project) => (
                                <article
                                    key={project.id}
                                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-sm"
                                >
                                    <Link
                                        href={`/projects/${project.id}`}
                                        className="block"
                                    >
                                        <h3 className="font-semibold text-gray-900">
                                            {project.name}
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-500">
                                            {project.description ||
                                                "Sin descripción"}
                                        </p>

                                        <p className="mt-4 text-sm font-medium text-indigo-600">
                                            Abrir tablero →
                                        </p>
                                    </Link>

                                    <div className="border-t border-gray-100 pt-3">
                                        <DeleteProjectButton
                                            projectId={project.id}
                                            projectName={project.name}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
