import type { Task } from "@/types";

export const initialTasks: Task[] = [
    {
        id: "1",
        title: "Diseñar la cabecera",
        description: "Crear el header responsive",
        status: "todo",
        priority: "high",
        dueDate: "2026-11-02",
    },
    {
        id: "2",
        title: "Crear componentes",
        description: "Preparar los componentes reutilizables",
        status: "in-progress",
        priority: "medium",
        dueDate: "2026-11-05",
    },
    {
        id: "3",
        title: "Definir colores",
        description: "Establecer la paleta visual",
        status: "done",
        priority: "low",
        dueDate: null,
    },
];