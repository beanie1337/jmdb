import React, {Component} from 'react';

import AuthUserContext from './AuthUserContext';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from './withAuthorization';

class AccountPage extends Component {
  render() {
    var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
    return(
      <AuthUserContext.Consumer>
        {authUser =>
          <div>
            <h1>Konto: {userInfo.email} DisplayName: {userInfo.username}</h1>
            <h1>TODO: Lägg till vilka filmer man lagt till </h1>
            <PasswordForgetForm />
            <PasswordChangeForm />
          </div>
        }
      </AuthUserContext.Consumer>
    )
  }
}
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);