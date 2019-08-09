import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { IWatchListProps, IWatchListState } from "../types/types";
import Icon from "@material-ui/core/Icon";
import { IconButton, Subheader } from "material-ui";
import { Box, Snackbar } from "@material-ui/core";

export class WatchList extends React.Component<IWatchListProps, {}> {
    public render() {
        return <>
                <Box bgcolor="primary.main">
                    <Subheader><Icon>remove_red_eye</Icon>Min watchlist</Subheader>
                </Box>
                {
                    this.props.watchList ? 
                    <List>
                        {
                            Object.entries(this.props.watchList).map((x, index) => {
                                return <ListItem key={x[1].id}>
                                            <IconButton className="addToWatchList" touch={true} onClick={() => this.props.removeMovieFromWatchList(x, index)}>
                                                <Icon>clear</Icon> 
                                            </IconButton>
                                            {x[1].title}
                                    </ListItem>
                            })
                        }
                    </List>
                    : null
                }
             </>
    }
}