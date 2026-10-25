
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function createProject(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!name) {
        redirect("/dashboard?error=empty-name");
    }

    const supabase = await createClient();

    const { data, error: claimsError } =
        await supabase.auth.getClaims();

    const userId = data?.claims?.sub;

    if (claimsError || !userId) {
        redirect("/login");
    }

    if (claimsError || !userId) {
        redirect("/login");
    }

    const { data: project, error } = await supabase
        .from("projects")
        .insert({
            name,
            description,
            owner_id: userId,
        })
        .select("id")
        .single();

    if (error || !project) {
        console.error("Error al crear proyecto:", error);
        redirect("/dashboard?error=create-project");
    }

    // Añadimos al propietario como miembro del proyecto.
    const { error: memberError } = await supabase
        .from("project_members")
        .insert({
            project_id: project.id,
            user_id: userId,
            role: "owner",
        });

    if (memberError) {
        console.error("Error al añadir propietario:", memberError);

        // El proyecto ya existe. No lo borramos automáticamente.
        redirect("/dashboard?error=add-member");
    }

    redirect(`/projects/${project.id}`);
}

export async function deleteProject(formData: FormData) {
    const projectId = String(formData.get("projectId") ?? "").trim();

    if (!projectId) {
        redirect("/dashboard?error=delete-project");
    }

    const supabase = await createClient();

    const { data, error: authError } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;

    if (authError || !userId) {
        redirect("/login");
    }

    const { data: deletedProject, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("owner_id", userId)
        .select("id")
        .maybeSingle();

    if (error || !deletedProject) {
        console.error("Error al eliminar proyecto:", error);
        redirect("/dashboard?error=delete-project");
    }

    redirect("/dashboard?message=project-deleted");
}
