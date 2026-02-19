export type ApplyToJobPayload = {
  uuid: string;
  jobId: string;
  candidateId: string;
  repoUrl: string;
  applicationId?: string;
};

export type ApplyToJobResponse = {
  ok: boolean;
};

