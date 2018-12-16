import React from 'react';

import { auth } from '../firebase';
import {Button} from 'reactstrap';

const SignOutButton = () =>
  <Button
    type="button"
    onClick={auth.doSignOut}
  >
    Logga ut
  </Button>

export default SignOutButton;