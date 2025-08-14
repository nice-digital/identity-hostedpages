import { render } from "@testing-library/react";
import { NotFound } from "../NotFound";

describe("NotFound components", () => {
  it("should render NotFound correctly", () => {
		const { container } = render(<NotFound />);
    expect(container).toMatchSnapshot();
  })
})
