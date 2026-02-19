import { useMemo, useState } from "react";
import type { Candidate } from "../types/candidate";
import type { Job } from "../types/job";
import { getCandidateByEmail } from "../services/candidate.service";
import { getJobs } from "../services/jobs.service";
import JobItem from "../components/JobItem";
import "./challenge.css";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ChallengePage() {
  const [email, setEmail] = useState("gonzavm00@gmail.com");
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const hasData = candidate !== null || jobs.length > 0 || error.length > 0;

  async function loadAll() {
    setError("");
    setLoading(true);

    try {
      const cand = await getCandidateByEmail(email);
      setCandidate(cand);

      const list = await getJobs();
      setJobs(list);
    } catch (e: any) {
      setError(e?.message || "Error inesperado");
      setCandidate(null);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div>
            <h1 className="title">Botfilter Challenge</h1>
            <p className="subtitle">
              Cargá tu candidato por email, revisá las posiciones y postulate pegando el link del repo.
            </p>
          </div>

          <div className="badge">
            <span>UI v2</span>
            <span style={{ opacity: 0.7 }}>•</span>
            <span>{loading ? "Loading" : "Ready"}</span>
          </div>
        </div>

        <div className="grid">
          {/* Panel izquierda: búsqueda */}
          <div className="card card--sidebar">
            <h3 className="cardTitle">1) Identificación</h3>

            <label className="fieldLabel">Email (el que usaste al postular)</label>

            <div className="row">
              <div style={{ flex: 1 }}>
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuemail@gmail.com"
                />
                {!emailOk && email.length > 0 && (
                  <div className="helper errorText">Email inválido.</div>
                )}
              </div>

              <button
                className={`btn btnPrimary`}
                onClick={loadAll}
                disabled={!emailOk || loading}
                style={{ minWidth: 130 }}
              >
                {loading ? "Cargando..." : "Buscar"}
              </button>
            </div>

            {!hasData && (
              <div className="notice" style={{ marginTop: 12 }}>
                Tip: escribí el email y tocá <b>Buscar</b>.
              </div>
            )}

            {error && (
              <div className="notice noticeDanger">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div>{error}</div>
                  <button className="btn" onClick={loadAll} disabled={!emailOk || loading}>
                    Reintentar
                  </button>
                </div>
              </div>
            )}

            {candidate && (
              <div className="notice noticeSuccess">
                <div style={{ fontSize: 12, opacity: 0.85 }}>Candidate cargado</div>
                <div style={{ marginTop: 6 }}>
                  <b>{candidate.email}</b>
                  <div className="helper" style={{ marginTop: 6 }}>
                    uuid: <code style={{ padding: "2px 6px", borderRadius: 10, background: "rgba(0,0,0,0.28)" }}>
                      {candidate.uuid}
                    </code>
                  </div>
                </div>
              </div>
            )}

            <hr className="hr" />

            <div className="helper">
              Si algo falla: revisá consola + Network (por si el backend devuelve 404/500).
            </div>
          </div>

          {/* Panel derecha: posiciones */}
          <div className="card">
            <div className="jobsHeader">
              <h3 className="cardTitle" style={{ margin: 0 }}>2) Posiciones</h3>
              <div className="jobMeta">
                {jobs.length} disponibles
              </div>
            </div>

            {!loading && candidate && jobs.length === 0 && !error && (
              <div className="notice">No hay posiciones disponibles.</div>
            )}

            {(!candidate && !loading) && (
              <div className="notice">
                Primero cargá el candidato con tu email para habilitar postulaciones.
              </div>
            )}

            <div className="jobsGrid" style={{ marginTop: 12 }}>
              {jobs.map((job) => (
                <JobItem key={job.id} job={job} candidate={candidate} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
