import React from 'react'
import AuthApi from '../../services/AuthApi'

const Logout = () => {
  AuthApi.logout()
  return <div> Logging out </div>
}

export default Logout
