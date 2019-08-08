import React from 'react'
import {Route, Switch} from "react-router";
import Header from "../../components/Header/Header";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import ResetPasswordSuccess from "../../components/ResetPasswordSuccess/ResetPasswordSuccess";
import NotFound from "../../components/NotFound/NotFound";
import './PasswordResetApp.scss'

class PasswordResetApp extends React.Component {
  render() {
    return (
      <div>
        <div className="wrapper">
          <Header className="col leftCol" />
          <div className="mainContainer col rightCol">
            <Switch>
              <Route exact path="/" component={ResetPassword} />
              <Route exact path='/resetsuccess' component={ResetPasswordSuccess} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
export default PasswordResetApp
