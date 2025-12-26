import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { Register } from "../Register";

jest.mock("../../../helpers/isLoginPage", () => true);
jest.mock("../../../services/AuthApi");

describe("Register components", () => {
  it("should render Register correctly", () => {
		const { container } = render(
			<MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
				<Register />
			</MemoryRouter>
		);
    expect(container).toMatchSnapshot();
  });

  it("should render correctly when there is an error", async () => {
		window.HTMLElement.prototype.scrollIntoView = function() {};
		render(
			<MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
				<Register />
			</MemoryRouter>
		);
		const registerButton = await screen.findByRole("button", { name: "Register"});
		userEvent.click(registerButton);
		const errorAlert = await screen.findByRole("alert");
  	expect(errorAlert).toBeInTheDocument();
  });
});
