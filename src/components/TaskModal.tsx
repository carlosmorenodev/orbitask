
"use client";

import { useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "@/types";

type TaskFormData = Omit<Task, "id">;

interface TaskModalProps {
    task: Task | null;
    onSave: (task: TaskFormData) => void;
    onClose: () => void;
}

export default function TaskModal({
    task,
    onSave,
    onClose,
}: TaskModalProps) {
    const [title, setTitle] = useState(task?.title ?? "");
    const [description, setDescription] = useState(
        task?.description ?? ""
    );
    const [status, setStatus] = useState<TaskStatus>(
        task?.status ?? "todo"
    );
    const [priority, setPriority] = useState<TaskPriority>(
        task?.priority ?? "medium"
    );
    const [dueDate, setDueDate] = useState(task?.dueDate ?? "");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onSave({
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            dueDate: dueDate || null,
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2
                        id="task-modal-title"
                        className="text-xl font-bold text-gray-900"
                    >
                        {task ? "Editar tarea" : "Nueva tarea"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar formulario"
                        className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium">
                            Título *
                        </label>
                        <input
                            id="title"
                            required
                            maxLength={100}
                            autoFocus
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ej. Diseñar la página de inicio"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-1 block text-sm font-medium"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            maxLength={1000}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Describe la tarea..."
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="status" className="mb-1 block text-sm font-medium">
                                Estado
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value as TaskStatus)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                            >
                                <option value="todo">Pendiente</option>
                                <option value="in-progress">En progreso</option>
                                <option value="done">Completado</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="priority"
                                className="mb-1 block text-sm font-medium"
                            >
                                Prioridad
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(event) =>
                                    setPriority(event.target.value as TaskPriority)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                            >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="dueDate"
                            className="mb-1 block text-sm font-medium"
                        >
                            Fecha límite
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                        >
                            {task ? "Guardar cambios" : "Crear tarea"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

