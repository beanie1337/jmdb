import React, {Component} from 'react';

import AuthUserContext from './AuthUserContext';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from './withAuthorization';
import { Container, Divider } from '@material-ui/core';

class AccountPage extends Component {
  render() {
    var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo')!);
    return(
      <AuthUserContext.Consumer>
        {authUser =>
          <Container maxWidth="sm">
            <div>
              <div>Konto: {userInfo.email}</div>
              <div>Användarnamn: {userInfo.username}</div>
              <div>TODO: Lägg till vilka filmer man lagt till </div>
              <PasswordForgetForm />
              <br />
              <Divider />
              <br />
              <PasswordChangeForm />
            </div>
          <br />
          </Container>
        }
      </AuthUserContext.Consumer>
    )
  }
}
const authCondition = (authUser: any) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);