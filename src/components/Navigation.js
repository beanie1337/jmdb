import React from 'react';
import AuthUserContext from './AuthUserContext';
import SignOutButton from './SignOut';
import img from '../img/logo.png'
import * as routes from '../constants/routes';
import {
    Collapse,
    Navbar,
    Button,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

const Navigation = () =>
    <div>
        <div style={{position:"absolute", zIndex:0, marginTop:"5px", marginLeft:"20px"}}>
            <a href={routes.HOME}><img style={{position:"absolute", height:"90px"}} src={img} alt="JMBD" /></a>
        </div>
        <div style={{zIndex:1}}>
            <Navbar color="light" light expand="md" className="rounded" style={{position:"static", height:"100px"}}>
                {/* <NavbarBrand href="/home" style={{position:"relative"}}></NavbarBrand> */}
                <Collapse isOpen={true} navbar>
                    <AuthUserContext.Consumer>
                        {authUser => authUser
                            ? <NavigationAuth />
                            : <NavigationNonAuth />
                        }
                    </AuthUserContext.Consumer>
                </Collapse>
            </Navbar>
        </div>
    </div>

const NavigationAuth = () =>
    <Nav className="ml-auto" navbar>
        <NavItem>
            <NavLink href={routes.HOME}>Startsida</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href={routes.ACCOUNT}>Mitt konto</NavLink>
        </NavItem>
        <NavItem>
            <SignOutButton />
        </NavItem>
    </Nav>

const NavigationNonAuth = () =>
    <Nav className="ml-auto" navbar>
        <NavItem>
            <Button href={routes.SIGN_IN}>Logga in</Button>
        </NavItem>
    </Nav>

export default Navigation;
