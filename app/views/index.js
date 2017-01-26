// non protected views:
<<<<<<< Updated upstream
import Landscapes        from './landscapes/Landscapes';
import Home         from './home/Home';
import PageNotFound from './pageNotFound/PageNotFound';
import Login        from './login/Login';
import Register     from './register/Register';
import Password     from './password/Password';
=======
import CreateLandscape        from './landscapes/CreateLandscape'
import EditLandscape        from './landscapes/EditLandscape'
import LandscapeDetails        from './landscapes/LandscapeDetails'
import Landscapes        from './landscapes/Landscapes'
import Deployments        from './deployments/Deployments'
import Home         from './home/Home'
import PageNotFound from './pageNotFound/PageNotFound'
import Login        from './login/Login'
import Register     from './register/Register'
>>>>>>> Stashed changes
// protected views:
import Protected    from './protected/Protected'


export {
  // non protected views:
  Home,
  PageNotFound,
  Login,
  Register,
  Password,
  // protected views:
  Protected,
  CreateLandscape,
  EditLandscape,
  LandscapeDetails,
  Landscapes,
  Deployments
}
