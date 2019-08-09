import React from 'react';
// import Autosuggest from "react-autosuggest";
// import StarRatingComponent from 'react-star-rating-component';
import {db, firebase} from '../firebase'
import { IMovieState, IMovieProps, IMovie, IOverviewProps } from '../types/types';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import { ListItemIcon, Icon, Chip, Tooltip, List } from '@material-ui/core';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Divider, Toggle, FlatButton, IconButton } from 'material-ui';
import { format } from 'date-fns';
import { formatCurrency, getGenres } from '../utilities/utilities'

var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo') || "");

export class Movie extends React.Component<IMovieProps, IMovieState> {
    constructor(props: IMovieProps) {
        super(props)
        this.state = {
            expanded: false
        }
    }
    private handleExpandChange = (expanded: boolean) => {
        this.setState({expanded: expanded});
    };
    private handleExpand = () => {
        this.setState({expanded: true});
    };
    private handleReduce = () => {
        this.setState({expanded: false});
    };
    private handleAddToWatchList = (movie:IMovie) => {
        
    };
    public render() {
        return <>
                <ListItem className="movie" key={this.props.movie.id}>
                    <Card className="card" expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                        <Tooltip title={`Lägg till '${this.props.movie.title}' i din watchlist`} placement="top">
                            <IconButton className="addToWatchList" touch={true} onClick={() => this.props.addMovieToWatchlist(this.props.movie)}>
                                <Icon>star_rate</Icon>
                            </IconButton>
                        </Tooltip>
                        <CardHeader
                            className="movieHeader"
                            title={this.props.movie.title}
                            subtitle={<Overview movie={this.props.movie}/>}
                            avatar={<Avatar alt={this.props.movie.title} src={'http://image.tmdb.org/t/p/w185' + this.props.movie.poster_path} />}
                        />
                        {
                            this.props.movie.backdrop_path != "" ? 
                                <CardMedia
                                    style={{marginLeft:"45px"}}
                                    expandable={true}
                                    overlay={<CardTitle title={this.props.movie.title} subtitle={this.props.movie.tagline} />}
                                >
                                    <img style={{width:'500px', maxWidth: '500px'}} src={'http://image.tmdb.org/t/p/w500' + this.props.movie.backdrop_path} alt={this.props.movie.title} />
                                </CardMedia> 
                                : 
                                null
                        }
                        <CardText expandable={true} className="movieInfo">
                            <div className="statisticInfo">
                                <div className="first">
                                    <List>
                                        <ListItem>
                                            <Tooltip title="Genomsnittligt betyg från TMDB.org" placement="left">
                                                <ListItemIcon><Icon>star_rate</Icon></ListItemIcon>
                                            </Tooltip>
                                            {`${this.props.movie.vote_average}/10 (${this.props.movie.vote_count} röster)`}
                                        </ListItem>
                                        <ListItem>
                                            <Tooltip title="Budget" placement="left">
                                                <ListItemIcon><Icon>attach_money</Icon></ListItemIcon> 
                                            </Tooltip>
                                            {formatCurrency(this.props.movie.budget)}
                                        </ListItem>
                                        <ListItem>
                                            <Tooltip title="Inkomst" placement="left">
                                                <ListItemIcon><Icon>show_chart</Icon></ListItemIcon>
                                            </Tooltip>
                                            {formatCurrency(this.props.movie.revenue)}
                                        </ListItem>
                                    </List>
                                </div>
                                <div className="second">
                                    <List>
                                        <ListItem>
                                            <Tooltip title="Längd" placement="left">
                                                <ListItemIcon><Icon>access_time</Icon></ListItemIcon>
                                            </Tooltip>
                                            {`${this.props.movie.runtime} mins`}
                                        </ListItem>
                                        <ListItem>
                                            <Tooltip title="Utgivningsdatum" placement="left">
                                                <ListItemIcon><Icon>date_range</Icon></ListItemIcon>
                                            </Tooltip>
                                            {this.props.movie.release_date}
                                        </ListItem>
                                        <ListItem>
                                            <Tooltip title={`${this.props.movie.addedByUser}s betyg`} placement="left">
                                                <ListItemIcon><Icon>face</Icon></ListItemIcon>
                                            </Tooltip>
                                            {`${this.props.movie.addedByUserRating} /10`}
                                        </ListItem>
                                    </List>
                                </div>
                            </div>
                            <Icon>format_quote</Icon>
                            {this.props.movie.overview}
                            <Icon>format_quote</Icon>
                        </CardText>
                        <CardActions className="movieCollapseButtons">
                            {
                                this.state.expanded ? 
                                <FlatButton icon={<Icon color="inherit">expand_less</Icon>} label={"Visa mindre"} onClick={this.handleReduce} /> 
                                : 
                                <FlatButton icon={<Icon color="inherit">expand_more</Icon>} label={"Visa mer"} onClick={this.handleExpand} />
                            }
                            
                        </CardActions>
                    </Card>
                </ListItem>
                <Divider />
             </>
    }
}

class Overview extends React.Component<IOverviewProps, {}> {
    public render() {
        var genres = getGenres(this.props.movie.genres);
        return <>
                    <div>{this.props.movie.overview.substring(0, 150) + '...'}</div>
                    <div>{
                        genres.map(function(x: any) {
                            return <Chip key={x} label={x} className="movieChip"></Chip>;
                        })}
                    </div>
                </>
    }
}