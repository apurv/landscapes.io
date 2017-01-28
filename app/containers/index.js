// non protected view containers
import App from './app/App'
import ConnectedHome from './home/Home'
import ConnectedLogin from './login/Login'
import ConnectedRegister from './register/Register'

// protected view containers
import ConnectedProtected from './protected/Protected'
import ConnectedPasswordChange from './password/Password'
import ConnectedLandscapes from './landscapes/Landscapes'
import ConnectedGroups from './groups/Groups'
import ConnectedUsers from './users/Users'
import ConnectedCreateUser from './users/CreateUser'
import ConnectedEditUser from './users/EditUser'
import ConnectedUserDetails from './users/UserDetails'
import ConnectedCreateGroup from './groups/CreateGroup'
import ConnectedEditGroup from './groups/EditGroup'
import ConnectedGroupDetails from './groups/GroupDetails'
import GroupDetails from './groups/GroupDetails'
import ConnectedDeployments from './deployments/Deployments'
import ConnectedAccounts from './accounts/Accounts'
import ConnectedCreateAccount from './accounts/CreateAccount'
import ConnectedCreateLandscape from './landscapes/CreateLandscape'
import ConnectedEditLandscape from './landscapes/EditLandscape'
import ConnectedLandscapeDetails from './landscapes/LandscapeDetails'

export {
    // non protected view containers
    App,
    ConnectedHome,
    ConnectedLogin,

    ConnectedGroups,
    ConnectedCreateGroup,
    ConnectedEditGroup,
    ConnectedGroupDetails,

    ConnectedRegister,
    ConnectedPasswordChange,
    // protected view containers
    ConnectedProtected,
    ConnectedDeployments,
    ConnectedAccounts,
    ConnectedCreateAccount,
    ConnectedLandscapes,

    ConnectedUsers,
    ConnectedCreateUser,
    ConnectedEditUser,
    ConnectedUserDetails,

    ConnectedCreateLandscape,
    ConnectedEditLandscape,
    ConnectedLandscapeDetails
}
