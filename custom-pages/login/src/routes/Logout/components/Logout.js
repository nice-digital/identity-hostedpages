import React from 'react'
import AuthApi from '../../../services/AuthApi'

const Logout = () => {
  const instance = new AuthApi()
  instance.logout()
  return <div> Logging out </div>
}

export default Logout
