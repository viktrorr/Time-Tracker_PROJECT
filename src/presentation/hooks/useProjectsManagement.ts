"use client";

import { useMemo, useState } from "react";
import { ApiClientError } from "@/infrastructure/client/api-types";
import { useProjects } from "@/presentation/hooks/useProjects";
import { PROJECT_COLOR_PALETTE } from "@/presentation/components/projects/project-colors";

export type ProjectFormValues = {
  name: string;
  client: string;
  colorHex: string;
};

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export function useProjectsManagement() {
  const projectsQuery = useProjects();
  const [createValues, setCreateValues] = useState<ProjectFormValues>({
    name: "",
    client: "",
    colorHex: PROJECT_COLOR_PALETTE[0]
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreatingLocally, setCreatingLocally] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<ProjectFormValues | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdatingLocally, setUpdatingLocally] = useState(false);

  const projects = useMemo(
    () => [...(projectsQuery.data ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [projectsQuery.data]
  );

  function hasDuplicateName(name: string, excludedProjectId?: string): boolean {
    const normalized = normalizeName(name);
    return projects.some(
      (project) => project.id !== excludedProjectId && normalizeName(project.name) === normalized
    );
  }

  async function submitCreate(): Promise<void> {
    setCreateError(null);

    if (!createValues.name.trim()) {
      setCreateError("Project name is required.");
      return;
    }

    if (hasDuplicateName(createValues.name)) {
      setCreateError("A project with this name already exists.");
      return;
    }

    try {
      setCreatingLocally(true);
      await projectsQuery.createProject({
        name: createValues.name.trim(),
        client: createValues.client.trim() || null,
        colorHex: createValues.colorHex
      });

      setCreateValues({
        name: "",
        client: "",
        colorHex: createValues.colorHex
      });
    } catch (error) {
      setCreateError(toErrorMessage(error));
    } finally {
      setCreatingLocally(false);
    }
  }

  function startEdit(projectId: string): void {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      return;
    }

    setEditingId(projectId);
    setEditError(null);
    setEditValues({
      name: project.name,
      client: project.client ?? "",
      colorHex: project.colorHex
    });
  }

  function cancelEdit(): void {
    setEditingId(null);
    setEditValues(null);
    setEditError(null);
  }

  async function submitEdit(): Promise<void> {
    if (!editingId || !editValues) {
      return;
    }

    setEditError(null);

    if (!editValues.name.trim()) {
      setEditError("Project name is required.");
      return;
    }

    if (hasDuplicateName(editValues.name, editingId)) {
      setEditError("A project with this name already exists.");
      return;
    }

    try {
      setUpdatingLocally(true);
      await projectsQuery.updateProject({
        id: editingId,
        input: {
          name: editValues.name.trim(),
          client: editValues.client.trim() || null,
          colorHex: editValues.colorHex
        }
      });
      cancelEdit();
    } catch (error) {
      setEditError(toErrorMessage(error));
    } finally {
      setUpdatingLocally(false);
    }
  }

  return {
    projects,
    isLoading: projectsQuery.isLoading,
    loadError: projectsQuery.error ? toErrorMessage(projectsQuery.error) : null,
    createValues,
    setCreateValues,
    createError,
    submitCreate,
    isCreating: projectsQuery.isCreatingProject || isCreatingLocally,
    editingId,
    editValues,
    setEditValues,
    editError,
    isUpdating: projectsQuery.isUpdatingProject || isUpdatingLocally,
    startEdit,
    cancelEdit,
    submitEdit
  };
}
