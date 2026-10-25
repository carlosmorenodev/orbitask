
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Board from "@/components/Board";

type ProjectPageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProjectPage({
    params,
}: ProjectPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: authData, error: authError } =
        await supabase.auth.getClaims();

    const userId = authData?.claims?.sub;

    if (authError || !userId) {
        redirect("/login");
    }

    const { data: project, error } = await supabase
        .from("projects")
        .select("id, name, description")
        .eq("id", id)
        .eq("owner_id", userId)
        .maybeSingle();

    if (error) {
        throw new Error("No se pudo cargar el proyecto.");
    }

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/dashboard"
                    className="text-sm font-medium text-indigo-600 hover:underline"
                >
                    ← Volver a mis proyectos
                </Link>

                <header className="mb-8 mt-5">
                    <p className="text-sm font-semibold text-indigo-600">
                        FLOWBOARD
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        {project.name}
                    </h1>
                    {project.description && (
                        <p className="mt-2 text-gray-600">
                            {project.description}
                        </p>
                    )}
                </header>

                <Board projectId={project.id} />
            </div>
        </main>
    );
}
