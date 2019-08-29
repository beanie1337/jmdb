import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { IWatchListProps, IWatchListState } from "../types/types";
import Icon from "@material-ui/core/Icon";
import { IconButton, Subheader } from "material-ui";
import { Box, Snackbar, Avatar, CircularProgress, ListItemIcon, Tooltip } from "@material-ui/core";

export class WatchList extends React.Component<IWatchListProps, {}> {
    public render() {
        return <>
                <Box bgcolor="#ef6c00" className="watchListBox">
                    <Subheader>
                        <ListItem style={{color:'white'}}>
                            <ListItemIcon>
                                <Icon>remove_red_eye</Icon>
                            </ListItemIcon>
                            Min watchlist
                        </ListItem>
                    </Subheader>
                </Box>
                
                {!this.props.completedLoadingWatchList ? <CircularProgress /> : 
                    this.props.watchList != null ? 
                        <List className="watchList">
                            {
                                Object.entries(this.props.watchList).map((x, index) => {
                                    return <ListItem key={x[1].id}>
                                                <IconButton className="removeFromWatchList" touch={true} onClick={() => this.props.removeMovieFromWatchList(x, index)}>
                                                    <Icon>clear</Icon> 
                                                </IconButton>
                                                <Tooltip title={x[1].title} placement="top">
                                                    <span>
                                                        {x[1].title.length > 20 ? `${x[1].title.substring(0, 20)}...` : x[1].title}
                                                    </span>
                                                </Tooltip>
                                        </ListItem>
                                })
                        }
                        </List>
                    : <ListItem> - Inga filmer hittade</ListItem>
                }
                
             </>
    }
}