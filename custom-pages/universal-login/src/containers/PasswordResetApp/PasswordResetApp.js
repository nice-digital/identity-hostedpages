import React from 'react'
import Header from "../../components/Header";
import {Route, Switch} from "react-router";
import ResetPassword from "../../routes/ResetPassword";
import ResetPasswordSuccess from "../../routes/ResetPasswordSuccess";
import NotFound from "../../routes/NotFound";
import './PasswordResetApp.scss'

class PasswordResetApp extends React.Component {
  render() {
    return (
      <div>
        <div className="wrapper">
          <Header className="col leftCol" />
          <div className="mainContainer col rightCol">
            <Switch>
              <Route exact path="/" component={ResetPassword.component} />
              <Route exact path='/resetsuccess' component={ResetPasswordSuccess.component} />
              <Route component={NotFound.component} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
export default PasswordResetApp
