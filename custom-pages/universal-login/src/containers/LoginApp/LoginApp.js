import React from 'react'
import Header from "../../components/Header";
import Nav from "../../components/Navigation";
import {Route, Switch} from "react-router";
import Login from "../../routes/Login";
import ForgotPassword from "../../routes/ForgotPassword";
import ForgotPasswordSuccess from "../../routes/ForgotPasswordSuccess";
import Register from "../../routes/Register";
import RegisterSuccess from "../../routes/RegisterSuccess";
import NotFound from "../../routes/NotFound";
import {Link} from "react-router-dom";
import './LoginApp.scss'

class LoginApp extends React.Component {
  render() {
    return (
      <div>
        <div className="wrapper">
          <Header className="col leftCol" />
          <div className="mainContainer col rightCol">
            <Switch>
              <Route exact path="/" component={Login.component} />
              <Route exact path='/forgotPassword' component={ForgotPassword.component} />
              <Route exact path='/forgotsuccess' component={ForgotPasswordSuccess.component} />
              <Route exact path='/register' component={Register.component} />
              <Route exact path='/regsuccess' component={RegisterSuccess.component} />
              <Route component={NotFound.component} />
            </Switch>
            <Link className="forgotPasswordLink" data-qa-sel="forgotPassword-link" to="/forgotPassword">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
export default LoginApp
