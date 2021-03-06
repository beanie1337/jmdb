import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from './Navigation';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import HomePage from './Home';
import AccountPage from './Account';
import withAuthentication from './withAuthentication';
import * as routes from '../constants/routes';
import {
  Container,
} from 'reactstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () =>
  <MuiThemeProvider>
    <Container className="mainContainer">
      <Router>
        <div>
          <Navigation />
          <hr/>
          <Route exact path={routes.SIGN_UP} component={SignUpPage} />
          <Route exact path={routes.SIGN_IN} component={SignInPage} />
          <Route exact path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route exact path={routes.HOME} component={HomePage} />
          <Route exact path={routes.ACCOUNT} component={AccountPage} />
        </div>
      </Router>
      </Container>
  </MuiThemeProvider>

export default withAuthentication(App);
