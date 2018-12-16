import React, {Component} from 'react';
import {PacmanLoader} from 'react-spinners';
import { ClipLoader } from 'react-spinners';
class Loader extends Component {
    render() {
        return( 
            <PacmanLoader />
        ) 
    }   
}
    
export {
    Loader,
} 