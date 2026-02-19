import { fetchJson } from "../api/http";
import type { Candidate } from "../types/candidate";

export function getCandidateByEmail(email: string) {
  const safeEmail = encodeURIComponent(email.trim());
  return fetchJson<Candidate>(`/api/candidate/get-by-email?email=${safeEmail}`);
}
