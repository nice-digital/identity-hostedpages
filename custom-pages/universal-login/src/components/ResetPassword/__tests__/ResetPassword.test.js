import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPassword } from "../ResetPassword";

jest.mock("../../../helpers/isLoginPage", () => true);
jest.mock("../../../services/AuthApi");

describe("ResetPassword components", () => {
    it("should render ResetPassword correctly", () => {
		const { container } = render(<ResetPassword />);
        expect(container).toMatchSnapshot();
    });

//     beforeEach(() => {
//         el = shallow( < ResetPassword / > )
//         instance = el.instance()
//         instance.auth = auth
//         instance.requestErrorCallback = functionSignature
//     })

//     it('should render ResetPassword correctly', () => {
//         expect(el).toMatchSnapshot()
//     })

//     it('should instantiate AuthApi', () => {
//         expect(instance.auth).toBe(auth)
//     })

//     it('should render correctly when there is an error', () => {
//         el.setState({ error: 'this is an error' }).update()
//         expect(el).toMatchSnapshot()
//     })

//     it('should render correctly when there is email', () => {
//         el.setState({
//             valid: true
//         }).update()
//         expect(el).toMatchSnapshot()
//     })

//     it('should call the AuthApi forgotPAssword when login is invoked', () => {
//         const password = 'P@ssw0rd1234!&A'
//         const history = undefined;
//         el.setState({
//             password,
//             confirmPassword: password,
//             errors: { password: false, confirmPassword: false },
//             history
//         }).update()

//         instance.resetPassword()
//         expect(instance.auth.resetPassword).toBeCalledWith(password, null, history)
//     })
// })

    it("should show alert when there is an error", async () => {
		window.HTMLElement.prototype.scrollIntoView = function() {};
		render(<ResetPassword />);
		const resetPasswordButton = await screen.findByRole("button", { name: "Reset password"});
		userEvent.click(resetPasswordButton);
		const errorAlert = await screen.findByRole("alert");
  		expect(errorAlert).toBeInTheDocument();
    });
});
