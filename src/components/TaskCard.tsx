
"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({
    task,
    onEdit,
    onDelete,
}: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: task.id,
    });

    const priorityLabels = {
        low: "Baja",
        medium: "Media",
        high: "Alta",
    };

    const priorityStyles = {
        low: "bg-green-100 text-green-700",
        medium: "bg-amber-100 text-amber-700",
        high: "bg-red-100 text-red-700",
    };

    return (
        <article
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                opacity: isDragging ? 0.4 : 1,
            }}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-800">
                    {task.title}
                </h3>

                <button
                    type="button"
                    {...listeners}
                    {...attributes}
                    aria-label={`Arrastrar tarea: ${task.title}`}
                    className="cursor-grab touch-none rounded px-2 text-lg leading-none text-gray-400 hover:bg-gray-100 active:cursor-grabbing"
                >
                    ⠿
                </button>
            </div>

            <div className="mb-3">
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
                >
                    {priorityLabels[task.priority]}
                </span>
            </div>

            <p className="text-sm leading-6 text-gray-500">
                {task.description || "Sin descripción"}
            </p>

            {task.dueDate && (
                <p className="mt-4 text-xs text-gray-400">
                    Fecha límite: {task.dueDate}
                </p>
            )}

            <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                    Editar
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(task.id)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    Eliminar
                </button>
            </div>
        </article>
    );
}
