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
import './App.scss'

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="wrapper">
          <Header className="col leftCol" />
          <div className="mainContainer col rightCol">
            <Router>
                <Switch>
                  {process.env.REACT_APP_RENDER === 'login' ?
                    <Route exact path="/" component={Login} /> :
                    <Route exact path="/" component={ResetPassword} />
                  }
                  <Route path='/login' component={Login} />
                  <Route path='/register' component={Register} />
                  <Route path='/regsuccess' component={RegisterSuccess} />
                  <Route path='/forgotPassword' component={ForgotPassword} />
                  <Route path='/forgotsuccess' component={ForgotPasswordSuccess} />
                  <Route path='/resetpassword' component={ResetPassword} />
                  <Route path='/change-password' component={ResetPassword} />
                  <Route path='/resetsuccess' component={ResetPasswordSuccess} />
                  <Route component={NotFound} />
                </Switch>
            </Router>
          </div>
        </div>
      </div>
    )
  }
}
export default App
