import { fetchJson } from "../api/http";
import type { ApplyToJobPayload, ApplyToJobResponse } from "../types/application";

export function applyToJob(payload: ApplyToJobPayload) {
  return fetchJson<ApplyToJobResponse>(`/api/candidate/apply-to-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
