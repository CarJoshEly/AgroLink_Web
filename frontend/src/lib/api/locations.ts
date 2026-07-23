import { apiFetch } from "./client";
import type { Department, Municipality } from "@/lib/types";

export async function fetchDepartments(): Promise<Department[]> {
  return apiFetch<Department[]>("/locations/departments");
}

export async function fetchMunicipalities(departmentId?: string): Promise<Municipality[]> {
  const query = departmentId ? `?departmentId=${encodeURIComponent(departmentId)}` : "";
  return apiFetch<Municipality[]>(`/locations/municipalities${query}`);
}
