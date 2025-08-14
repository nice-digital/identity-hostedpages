import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { ForgotPassword } from "../ForgotPassword";

jest.mock("../../../helpers/isLoginPage", () => true);
jest.mock("../../../services/AuthApi")

describe("ForgotPassword components", () => {
  // let el
  // let instance
  const auth = {
    forgotPassword: jest.fn()
  }
  //const functionSignature = "a function signature"

  // beforeEach(() => {
  //   el = shallow(<ForgotPassword />)
  //   instance = el.instance()
  //   instance.auth = auth
  //   instance.requestErrorCallback = functionSignature
  // })

  it("should render <ForgotPassword /> correctly", () => {
		const { container } = render(
			<MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
				<ForgotPassword />
			</MemoryRouter>
		);
    expect(container).toMatchSnapshot();
  });

  it("should render correctly when there is an error", async () => {
		render(
			<MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
				<ForgotPassword />
			</MemoryRouter>
		);
		const resetPasswordButton = await screen.findByRole("button", { name: "Reset password"});
		userEvent.click(resetPasswordButton);
		const errorAlert = await screen.findByText("This field is required");
  	expect(errorAlert).toBeInTheDocument();
  });
})
