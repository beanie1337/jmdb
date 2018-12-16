import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { db, auth } from '../firebase';
import * as routes from '../constants/routes';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button,
  } from 'reactstrap';

const SignInPage = ({ history }) =>
  <div style={{position:"absolute"}}>
    <h1>Logga in</h1>
    <SignInForm history={history} />
    <div style={{marginLeft:"30px", marginTop:"20px"}}>
        <PasswordForgetLink />
        <SignUpLink />
    </div>
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(data => {
        db.getUserInformation(data.user.uid).then(userInfo => {
          //set user info in local storage
          var userInfoVal = userInfo.val();
          userInfoVal['uid'] = data.user.uid;
          var userInfoJSON = JSON.stringify(userInfoVal);
          localStorage.setItem('loggedInUserInfo', userInfoJSON);
          this.setState({ ...INITIAL_STATE });
          history.push(routes.HOME);
        });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
        <Container className="App">
            <Form className="form" onSubmit={this.onSubmit}>
            <Col>
                <FormGroup>
                <Label>Email</Label>
                <Input
                    type="email"
                    value={email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    name="email"
                    id="exampleEmail"
                    placeholder="myemail@email.com"
                />
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                <Label for="examplePassword">Lösenord</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={event => this.setState(byPropKey('password', event.target.value))}
                    name="password"
                    id="examplePassword"
                    placeholder="********"
                />
                </FormGroup>
            </Col>
            <Button disabled={isInvalid} style={{marginLeft:"15px"}}>Logga in</Button>
            { error && <p style={{color:"red"}}>{error.message}</p> }
            </Form>
        </Container>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};