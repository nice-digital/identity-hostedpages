// We only need to import the modules necessary for initial render
import Layout from '../components/Layout'
import NotFound from './NotFound'
import ResetPassword from './ResetPassword'
import ResetPasswordSuccess from './ResetPasswordSuccess'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = () => ({
  path: '/',
  component: Layout,
  indexRoute: ResetPassword,
  childRoutes: [ResetPasswordSuccess, NotFound]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default()
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
