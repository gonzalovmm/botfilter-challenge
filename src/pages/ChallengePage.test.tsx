import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChallengePage from "./ChallengePage";

test("deshabilita el botón Buscar si el email es inválido", async () => {
  const user = userEvent.setup();
  render(<ChallengePage />);

  const input = screen.getByPlaceholderText("tuemail@gmail.com");
  await user.clear(input);
  await user.type(input, "no-es-email");

  const button = screen.getByRole("button", { name: /buscar/i });
  expect(button).toBeDisabled();
});
