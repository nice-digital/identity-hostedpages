import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ForgotPasswordSuccess } from "../ForgotPasswordSuccess";

describe("ForgotPasswordSuccess components", () => {
  it("should render ForgotPasswordSuccess correctly", () => {
		const { container } = render(
			<MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
				<ForgotPasswordSuccess />
			</MemoryRouter>
		);
    expect(container).toMatchSnapshot();
  });
});
