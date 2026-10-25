
"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Task, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";

interface BoardColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export default function BoardColumn({
    title,
    status,
    tasks,
    onEdit,
    onDelete,
}: BoardColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    const columnTasks = tasks.filter(
        (task) => task.status === status
    );

    return (
        <section
            ref={setNodeRef}
            className={`min-w-0 rounded-2xl p-3 transition-colors sm:p-4 ${isOver ? "bg-indigo-100 ring-2 ring-indigo-300" : "bg-gray-100"
                }`}
        >
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                    {title}
                </h2>

                <span className="rounded-lg bg-white px-2 py-1 text-sm text-gray-500">
                    {columnTasks.length}
                </span>
            </div>

            <div className="flex min-h-32 flex-col gap-3">
                {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                ) : (
                    <p className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-400">
                        Suelta una tarea aquí
                    </p>
                )}
            </div>
        </section>
    );
}
