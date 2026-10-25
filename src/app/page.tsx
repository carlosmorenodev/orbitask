
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}


/* 
import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-indigo-600">
            FLOWBOARD / PROYECTOS
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Rediseño web
          </h1>

          <p className="mt-2 text-gray-500">
            Organiza tus tareas y sigue el progreso del proyecto.
          </p>
        </header>

        <Board />
      </div>
    </main>
  );
} */
