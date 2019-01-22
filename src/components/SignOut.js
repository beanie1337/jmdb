import React, {Component} from 'react';

import { auth } from '../firebase';
import {Button} from 'reactstrap';

class SignOutButton extends Component {
  constructor(props) {
    super(props)
  }
  signOut() {
    localStorage.removeItem('loggedInUserInfo')
    console.log('localStorage: loggedInUserInfo - REMOVED')
    auth.doSignOut();
  }
  render() {
    return(
      <Button
        type="button"
        onClick={() =>{this.signOut()}}
      >
        Logga ut
      </Button>
    )
  }
  
}
 

export default SignOutButton;