import { fetchJson } from "../api/http";
import type { Job } from "../types/job";

export function getJobs() {
  return fetchJson<Job[]>(`/api/jobs/get-list`);
}
