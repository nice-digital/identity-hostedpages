import React from 'react'
import Header from "../Header/Header";
import {Route, Switch} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import Login from "../Login/Login";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import ForgotPasswordSuccess from "../ForgotPasswordSuccess/ForgotPasswordSuccess";
import Register from "../Register/Register";
import RegisterSuccess from "../RegisterSuccess/RegisterSuccess";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import ResetPasswordSuccess from "../../components/ResetPasswordSuccess/ResetPasswordSuccess";
import NotFound from "../NotFound/NotFound";
import './App.scss';
import { Header as GlobalHeader, Footer as GlobalFooter } from "@nice-digital/global-nav";
import { Alert } from "@nice-digital/nds-alert";
import { Container } from "@nice-digital/nds-container";

class App extends React.Component {
  render() {

    const isLoginPage = process.env.REACT_APP_RENDER === "login"; //there's 2 buckets. login page and reset password.

    return (
      <>
      <GlobalHeader search={false} auth={false} cookie={false} />
      <div className="alertMFAContainer">
        <Alert type="caution" >
          <Container>
            <p>Read about <a href="https://rise.articulate.com/share/y1zH1XP0J2ptLTUv_4foMq5YeOlQR2Yk" target="_blank" rel="noreferrer"> our approach to multi-factor authentication (MFA)</a>
            </p>
          </Container>
        </Alert>
      </div>
      <div>
        <div className="wrapper">
          <Header className="col leftCol" />
          <main className="mainContainer col rightCol" aria-live="polite">

            <Router basename={ isLoginPage ? "" : "/lo/reset"}>
              <Switch>
                {isLoginPage ?
                  <Route exact path="/" component={Login} /> :
                  <Route exact path="/" component={ResetPassword} />
                }
                <Route path='*/login' component={Login} />
                <Route path='*/register' component={Register} />
                <Route path='*/regsuccess' component={RegisterSuccess} />
                <Route path='*/forgotPassword' component={ForgotPassword} />
                <Route path='*/forgotsuccess' component={ForgotPasswordSuccess} />
                <Route path='*/resetpassword' component={ResetPassword} />
                <Route path='*/change-password' component={ResetPassword} />
                <Route path='*/resetsuccess' component={ResetPasswordSuccess} />
                <Route component={NotFound} />
              </Switch>
            </Router>

          </main>
        </div>
      </div>
      <GlobalFooter />
      </>
    )
  }
}
export default App
