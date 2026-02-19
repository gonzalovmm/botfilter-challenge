import { useMemo, useState } from "react";
import type { Job } from "../types/job";
import type { Candidate } from "../types/candidate";
import { applyToJob } from "../services/applications.service";
import "../pages/challenge.css";

function isValidGithubRepoUrl(url: string) {
    const u = url.trim();
    return /^https:\/\/github\.com\/[^\/\s]+\/[^\/\s]+\/?$/.test(u);
}

export default function JobItem({ job, candidate }: { job: Job; candidate: Candidate | null }) {
    const [repoUrl, setRepoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const repoOk = useMemo(() => isValidGithubRepoUrl(repoUrl), [repoUrl]);

    async function onSubmit() {
        if (!candidate) {
            setStatus("error");
            setMessage("Primero cargá el candidato (email).");
            return;
        }
        if (!repoOk) {
            setStatus("error");
            setMessage("Repo URL inválida. Ej: https://github.com/tu-usuario/tu-repo");
            return;
        }

        setSubmitting(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await applyToJob({
                uuid: candidate.uuid,
                candidateId: candidate.candidateId,
                applicationId: (candidate as any).applicationId, // o candidate.applicationId si tu type ya lo tiene
                jobId: job.id,
                repoUrl: repoUrl.trim(),
            });


            if (res.ok) {
                setStatus("success");
                setMessage("Postulación enviada.");
            } else {
                setStatus("error");
                setMessage("La API respondió ok=false.");
            }
        } catch (e: any) {
            setStatus("error");
            setMessage(e?.message || "Error inesperado al postular.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="card" style={{ boxShadow: "none" }}>
            <div className="jobTop">
                <div style={{ minWidth: 0 }}>
                    <p className="jobTitle">{job.title}</p>
                    <div className="jobMeta">
                        id: <span className="chip">{job.id}</span>
                    </div>

                </div>

                <button
                    className={`btn btnSuccess`}
                    onClick={onSubmit}
                    disabled={submitting || !candidate || !repoOk}
                    title={
                        !candidate ? "Primero cargá el candidato" :
                            !repoOk ? "Ingresá una repo URL válida" :
                                "Enviar postulación"
                    }
                    style={{ height: 42, whiteSpace: "nowrap" }}
                >
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </div>

            <label className="fieldLabel">Repo URL</label>
            <input
                className="input"
                value={repoUrl}
                onChange={(e) => {
                    setRepoUrl(e.target.value);
                    if (status !== "idle") setStatus("idle");
                }}
                placeholder="https://github.com/tu-usuario/tu-repo"
            />

            {repoUrl.length > 0 && !repoOk && (
                <div className="helper errorText">
                    Formato inválido. Debe ser https://github.com/user/repo
                </div>
            )}

            {status !== "idle" && (
                <div className={`notice ${status === "success" ? "noticeSuccess" : "noticeDanger"}`} style={{ marginTop: 12 }}>
                    {message}
                </div>
            )}
        </div>
    );
}
