import { render } from "@testing-library/react";
import { ResetPasswordSuccess } from "../ResetPasswordSuccess";

describe("ResetPasswordSuccess components", () => {
	it("should render ResetPasswordSuccess correctly", () => {
		const { container } = render(<ResetPasswordSuccess />);
		expect(container).toMatchSnapshot();
	});
});
