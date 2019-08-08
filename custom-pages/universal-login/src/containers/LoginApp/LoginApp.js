import React from 'react'
import Header from "../../components/Header/Header";
import {Route, Switch} from "react-router";
import Login from "../../components/Login/Login";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import ForgotPasswordSuccess from "../../components/ForgotPasswordSuccess/ForgotPasswordSuccess";
import Register from "../../components/Register/Register";
import RegisterSuccess from "../../components/RegisterSuccess/RegisterSuccess";
import NotFound from "../../components/NotFound/NotFound";
import './LoginApp.scss'

class LoginApp extends React.Component {
  render() {
    return (
      <div>
        <div className="wrapper">
          <Header className="col leftCol" />
          <div className="mainContainer col rightCol">
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path='/forgotPassword' component={ForgotPassword} />
              <Route exact path='/forgotsuccess' component={ForgotPasswordSuccess} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/regsuccess' component={RegisterSuccess} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
export default LoginApp
