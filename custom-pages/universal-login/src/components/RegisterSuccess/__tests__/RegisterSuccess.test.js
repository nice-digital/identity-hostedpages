
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { RegisterSuccess } from "../RegisterSuccess";

jest.mock("../../../helpers/isLoginPage", () => true);

describe("RegisterSuccess components", () => {
	it("should render RegisterSuccess correctly", () => {
		const { container } = render(
			<MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
				<RegisterSuccess />
			</MemoryRouter>);
		expect(container).toMatchSnapshot();
	});
});
