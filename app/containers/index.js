// non protected view containers
import App from './app/App'
import ConnectedHome from './home/Home'
import ConnectedLogin from './login/Login'
import ConnectedRegister from './register/Register'

// protected view containers
import ConnectedProtected from './protected/Protected'
import ConnectedPasswordChange from './password/Password'
import ConnectedLandscapes from './landscapes/Landscapes'
import ConnectedDeployments from './deployments/Deployments'
import ConnectedCreateLandscape from './landscapes/CreateLandscape'
import ConnectedEditLandscape from './landscapes/EditLandscape'
import ConnectedLandscapeDetails from './landscapes/LandscapeDetails'

export {
    // non protected view containers
    App,
    ConnectedHome,
    ConnectedLogin,
    ConnectedRegister,
    ConnectedPasswordChange,
    // protected view containers
    ConnectedProtected,
    ConnectedDeployments,
    ConnectedLandscapes,
    ConnectedCreateLandscape,
    ConnectedEditLandscape,
    ConnectedLandscapeDetails
}
