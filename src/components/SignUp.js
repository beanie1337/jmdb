import React, { Component } from 'react';
import { 
    Link,
    withRouter
} from 'react-router-dom';

import {auth, db} from '../firebase'
import * as routes from '../constants/routes';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button,
  } from 'reactstrap';

const SignUpPage = ({history}) =>
  <div>
    <h3>Registrera nytt konto</h3>
    <br />
    <SignUpForm history={history} />
  </div>


const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
}

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
        username,
        email,
        passwordOne,
    } = this.state;
    
    const {
        history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
    .then(authUser => {
        db.doCreateUser(authUser.user.uid, username, email, "reader")
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                alert('Kontot är skapat. Var god logga in')
                history.push(routes.SIGN_IN);
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });
    })
    .catch(error => {
        this.setState(byPropKey('error', error));
    });
  
    event.preventDefault();
  }

  render() {
    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
    return (
        <div className="SignUpForm">
        <Container className="App">
            <Form className="form" onSubmit={this.onSubmit}>
            <Col>
                <FormGroup>
                <Label>Användarnamn</Label>
                <Input
                    type="text"
                    value={username}
                    onChange={event => this.setState(byPropKey('username', event.target.value))}
                    placeholder="Användarnamn"
                />
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                <Label>Email</Label>
                <Input
                    value={email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    type="text"
                    placeholder="Email"
                />
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                <Label>Lösenord</Label>
                <Input
                    value={passwordOne}
                    onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                    type="password"
                    placeholder="Lösenord"
                />
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                <Label>Lösenord igen</Label>
                <Input
                    value={passwordTwo}
                    onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                    type="password"
                    placeholder="Bekräfta lösenord"
                />
                </FormGroup>
            </Col>
            <Button disabled={isInvalid} style={{marginLeft:"15px"}}>Registrera</Button>
            { error && <p style={{color:"red"}}>{error.message}</p> }
            </Form>
        </Container>
        </div>
    //   <form onSubmit={this.onSubmit}>
    //     <input
    //       value={username}
    //       onChange={event => this.setState(byPropKey('username', event.target.value))}
    //       type="text"
    //       placeholder="Full Name"
    //     />
    //     <input
    //       value={email}
    //       onChange={event => this.setState(byPropKey('email', event.target.value))}
    //       type="text"
    //       placeholder="Email Address"
    //     />
    //     <input
    //       value={passwordOne}
    //       onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
    //       type="password"
    //       placeholder="Password"
    //     />
    //     <input
    //       value={passwordTwo}
    //       onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
    //       type="password"
    //       placeholder="Confirm Password"
    //     />
    //     <button disabled={isInvalid} type="submit">
    //       Registrera
    //     </button>

    //     { error && <p>{error.message}</p> }
    //   </form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Har du inget konto?
    {' '}
    <Link to={routes.SIGN_UP}>Registrera dig</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};