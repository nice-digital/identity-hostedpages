import { Routes, Route } from "react-router-dom";
import { Header, Main, Footer } from "@nice-digital/global-nav";
import { Alert } from "@nice-digital/nds-alert";
import { Container } from "@nice-digital/nds-container";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Login } from "../Login/Login";
import { ForgotPassword } from "../ForgotPassword/ForgotPassword";
import { ForgotPasswordSuccess } from "../ForgotPasswordSuccess/ForgotPasswordSuccess";
import { Register } from "../Register/Register";
import { RegisterSuccess } from "../RegisterSuccess/RegisterSuccess";
import { ResetPassword } from "../ResetPassword/ResetPassword";
import { ResetPasswordSuccess } from "../../components/ResetPasswordSuccess/ResetPasswordSuccess";
import { NotFound } from "../NotFound/NotFound";
import { isLoginPage } from "../../helpers";

import "./App.scss";

export const App = () => {
	const defaultRouteElement = isLoginPage ? <Login /> : <ResetPassword />;

	return (
		<>
			<Header search={false} auth={false} cookie={false} />
			<div className="alertMFAContainer">
				<Alert type="caution" >
					<Container>
						<p>Read about <a href="https://rise.articulate.com/share/y1zH1XP0J2ptLTUv_4foMq5YeOlQR2Yk" target="_blank" rel="noreferrer"> our approach to multi-factor authentication (MFA)</a>
						</p>
					</Container>
				</Alert>
			</div>
			<Main aria-live="polite">
				<Container>
					<Grid gutter="loose">
						<GridItem cols={12}	md={6} className="pv--f">
							<PageHeader heading="NICE accounts" />
						</GridItem>
						<GridItem cols={12}	md={6} className="pv--f">
							<Routes>
								<Route index element={defaultRouteElement} />
								<Route path="/login" element={<Login />} />
								<Route path="/register" element={<Register />} />
								<Route path="/regsuccess" element={<RegisterSuccess />} />
								<Route path="/forgotPassword" element={<ForgotPassword />} />
								<Route path="/forgotsuccess" element={<ForgotPasswordSuccess />} />
								<Route path="/resetpassword" element={<ResetPassword />} />
								<Route path="/change-password" element={<ResetPassword />} />
								<Route path="/resetsuccess" element={<ResetPasswordSuccess />} />
								<Route element={<NotFound />} />
							</Routes>
						</GridItem>
					</Grid>
				</Container>
			</Main>
			<Footer />
		</>
	);
};
