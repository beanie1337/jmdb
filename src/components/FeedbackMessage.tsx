import React from "react";
import { IFeedbackMessageProps, IFeedbackMessageState } from "../types/types";
import { SnackbarContent, IconButton, Icon, Snackbar } from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
  };
export class FeedbackMessage extends React.Component<IFeedbackMessageProps, {}> {
    
    render() {
        //const Icon = variantIcon[variant];
        return <Snackbar 
                    open={this.props.open}
                    onClose={this.props.handleCloseFeedback}
                    autoHideDuration={4000}
                    message={
                        this.props.message
                    }
                    action={[
                        <IconButton key="close" aria-label="close" color="inherit" onClick={this.props.handleCloseFeedback}>
                            <Icon>clear</Icon>
                        </IconButton>
                    ]}
                />
    }
}