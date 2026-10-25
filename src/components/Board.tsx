
"use client";

import { useEffect, useState } from "react";
import {
    DndContext,
    closestCorners,
    type DragEndEvent,
} from "@dnd-kit/core";

import { supabase } from "@/lib/supabase";
import type { Task, TaskStatus } from "@/types";
import BoardColumn from "./BoardColumn";
import TaskModal from "./TaskModal";

type TaskFormData = Omit<Task, "id">;

type BoardProps = {
    projectId: string;
};

const statuses: TaskStatus[] = [
    "todo",
    "in-progress",
    "done",
];

export default function Board({ projectId }: BoardProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadTasks() {
            setLoading(true);
            setErrorMessage("");

            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("project_id", projectId)
                .order("created_at", { ascending: true });

            if (cancelled) return;

            if (error) {
                console.error("Error al cargar tareas:", error);
                setErrorMessage("No se pudieron cargar las tareas.");
                setLoading(false);
                return;
            }

            const loadedTasks: Task[] = (data ?? []).map((row) => ({
                id: row.id,
                title: row.title,
                description: row.description,
                status: row.status as TaskStatus,
                priority: row.priority as Task["priority"],
                dueDate: row.due_date,
            }));

            setTasks(loadedTasks);
            setLoading(false);
        }

        loadTasks();

        return () => {
            cancelled = true;
        };
    }, [projectId]);

    function handleCreate() {
        setEditingTask(null);
        setIsModalOpen(true);
    }

    function handleEdit(task: Task) {
        setEditingTask(task);
        setIsModalOpen(true);
    }

    async function handleSave(taskData: TaskFormData) {
        setErrorMessage("");

        if (editingTask) {
            const { data, error } = await supabase
                .from("tasks")
                .update({
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    priority: taskData.priority,
                    due_date: taskData.dueDate,
                })
                .eq("id", editingTask.id)
                .eq("project_id", projectId)
                .select()
                .maybeSingle();

            if (error || !data) {
                console.error("Error al actualizar tarea:", error);
                setErrorMessage("No se pudieron guardar los cambios.");
                return;
            }

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === editingTask.id
                        ? { ...task, ...taskData }
                        : task
                )
            );
        } else {
            const { data, error } = await supabase
                .from("tasks")
                .insert({
                    project_id: projectId,
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    priority: taskData.priority,
                    due_date: taskData.dueDate || null,
                })
                .select()
                .single();

            if (error || !data) {
                console.error("Error al crear tarea:", error);
                setErrorMessage("No se pudo crear la tarea.");
                return;
            }

            const newTask: Task = {
                id: data.id,
                title: data.title,
                description: data.description,
                status: data.status as TaskStatus,
                priority: data.priority as Task["priority"],
                dueDate: data.due_date,
            };

            setTasks((currentTasks) => [...currentTasks, newTask]);
        }

        setIsModalOpen(false);
        setEditingTask(null);
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            "¿Seguro que quieres eliminar esta tarea?"
        );

        if (!confirmed) return;

        setErrorMessage("");

        const { error, count } = await supabase
            .from("tasks")
            .delete({ count: "exact" })
            .eq("id", id)
            .eq("project_id", projectId);

        if (error || count === 0) {
            console.error("Error al eliminar tarea:", error);
            setErrorMessage("No se pudo eliminar la tarea.");
            return;
        }

        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== id)
        );
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const taskId = String(active.id);
        const newStatus = String(over.id);

        if (!statuses.includes(newStatus as TaskStatus)) return;

        const task = tasks.find((item) => item.id === taskId);

        if (!task || task.status === newStatus) return;

        setErrorMessage("");

        const { data, error } = await supabase
            .from("tasks")
            .update({ status: newStatus })
            .eq("id", taskId)
            .eq("project_id", projectId)
            .select("id")
            .maybeSingle();

        if (error || !data) {
            console.error("Error al cambiar estado:", error);
            setErrorMessage(
                "No se pudo actualizar el estado de la tarea."
            );
            return;
        }

        setTasks((currentTasks) =>
            currentTasks.map((item) =>
                item.id === taskId
                    ? { ...item, status: newStatus as TaskStatus }
                    : item
            )
        );
    }

    if (loading) {
        return (
            <p className="py-10 text-center text-gray-500">
                Cargando tareas...
            </p>
        );
    }

    return (
        <>
            {errorMessage && (
                <p
                    role="alert"
                    className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                    {errorMessage}
                </p>
            )}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                    {tasks.length}{" "}
                    {tasks.length === 1 ? "tarea" : "tareas"} en total
                </p>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700"
                >
                    + Nueva tarea
                </button>
            </div>

            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <BoardColumn
                        title="Pendiente"
                        status="todo"
                        tasks={tasks}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <BoardColumn
                        title="En progreso"
                        status="in-progress"
                        tasks={tasks}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <BoardColumn
                        title="Completado"
                        status="done"
                        tasks={tasks}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </DndContext>

            {isModalOpen && (
                <TaskModal
                    key={editingTask?.id ?? "new-task"}
                    task={editingTask}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTask(null);
                    }}
                />
            )}
        </>
    );
}
