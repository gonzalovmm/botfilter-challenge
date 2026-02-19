import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobItem from "./JobItem";
import type { Candidate } from "../types/candidate";
import type { Job } from "../types/job";

// Mock del service (no pega a internet)
import { applyToJob } from "../services/applications.service";
vi.mock("../services/applications.service", () => ({
  applyToJob: vi.fn(),
}));

const mockApply = applyToJob as unknown as ReturnType<typeof vi.fn>;

const job: Job = { id: "4416372005", title: "Fullstack developer" };

const candidate: Candidate = {
  uuid: "uuid-123",
  candidateId: "cand-123",
  email: "gonzavm00@gmail.com",
  firstName: "Gonzalo",
  lastName: "Villa",
  applicationId: "app-123",
};

test("si repoUrl es inválida, muestra error y no llama al POST", async () => {
  const user = userEvent.setup();
  mockApply.mockReset();

  render(<JobItem job={job} candidate={candidate} />);

  const input = screen.getByPlaceholderText("https://github.com/tu-usuario/tu-repo");
  await user.type(input, "hola");

  const submit = screen.getByRole("button", { name: /submit/i });
  await user.click(submit);

  expect(mockApply).not.toHaveBeenCalled();
  expect(screen.getByText(/Formato inválido/i)).toBeInTheDocument();
  expect(submit).toBeDisabled();
});

test("con repoUrl válida, llama applyToJob con payload correcto y muestra éxito", async () => {
  const user = userEvent.setup();
  mockApply.mockReset();
  mockApply.mockResolvedValue({ ok: true });

  render(<JobItem job={job} candidate={candidate} />);

  const input = screen.getByPlaceholderText("https://github.com/tu-usuario/tu-repo");
  await user.type(input, "https://github.com/gonzalovmm/botfilter-challenge");

  const submit = screen.getByRole("button", { name: /submit/i });
  await user.click(submit);

  expect(mockApply).toHaveBeenCalledTimes(1);
  expect(mockApply).toHaveBeenCalledWith({
  uuid: "uuid-123",
  candidateId: "cand-123",
  applicationId: "app-123",
  jobId: "4416372005",
  repoUrl: "https://github.com/gonzalovmm/botfilter-challenge",
});
  expect(await screen.findByText(/Postulación enviada/i)).toBeInTheDocument();
});
