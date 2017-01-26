// non protected views:
import Home         from './home/Home'
import PageNotFound from './pageNotFound/PageNotFound'
import Login        from './login/Login'
import Register     from './register/Register'
import Password     from './password/Password'
// protected views:
import Protected    from './protected/Protected'

import Landscapes        from './landscapes/Landscapes'
import CreateLandscape        from './landscapes/CreateLandscape'
import EditLandscape        from './landscapes/EditLandscape'
import LandscapeDetails        from './landscapes/LandscapeDetails'

import Accounts        from './accounts/Accounts'
import CreateAccount        from './accounts/CreateAccount'

import Deployments        from './deployments/Deployments'

export {
  // non protected views:
  Home,
  PageNotFound,
  Login,
  Register,
  Password,
  // protected views:
  Protected,
  Landscapes,
  CreateLandscape,
  EditLandscape,
  LandscapeDetails,

  Accounts,
  CreateAccount,

  Deployments
}
