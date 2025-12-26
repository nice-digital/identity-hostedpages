import { Link } from "react-router-dom";
import { Alert } from "@nice-digital/nds-alert";

export const RegisterSuccess = () => {
	return (
		<div>
			<h2 className="mt--0">Thank you</h2>
			<p className="lead">
				We've sent you an email with an activation link. Click on the link to
				verify your details and start using your account.
			</p>
			<Alert type="caution">
				Check your spam folder if you do not receive the activation email.
			</Alert>
			<p>
				<Link data-qa-sel="registerSuccess-link-to-login" to="/">
					Return to sign in
				</Link>
			</p>
		</div>
	);
};
