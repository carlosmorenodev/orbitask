
"use client";

import { deleteProject } from "@/app/dashboard/actions";

type DeleteProjectButtonProps = {
    projectId: string;
    projectName: string;
};

export default function DeleteProjectButton({
    projectId,
    projectName,
}: DeleteProjectButtonProps) {
    return (
        <form
            action={deleteProject}
            onSubmit={(event) => {
                const confirmed = window.confirm(
                    `¿Seguro que quieres eliminar "${projectName}"? Se borrarán también todas sus tareas. Esta acción no se puede deshacer.`
                );

                if (!confirmed) {
                    event.preventDefault();
                }
            }}
        >
            <input
                type="hidden"
                name="projectId"
                value={projectId}
            />

            <button
                type="submit"
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
            >
                Eliminar proyecto
            </button>
        </form>
    );
}
