import React from 'react';
// import Autosuggest from "react-autosuggest";
// import StarRatingComponent from 'react-star-rating-component';
import { IMovieState, IMovieProps, IOverviewProps, IMovieStatsInfoProps, IMovieToolsProps } from '../types/types';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import { ListItemIcon, Icon, Chip, Tooltip, List, Badge } from '@material-ui/core';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Divider, FlatButton, IconButton } from 'material-ui';
import { formatCurrency, getGenres } from '../utilities/utilities'

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
    public render() {
        return <>
                <ListItem className="movie" key={this.props.movie.id}>
                    <Card className="card" expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>

                        <MovieTools movie={this.props.movie} addMovieToWatchList={this.props.addMovieToWatchlist} handleCommentsClick={this.props.handleCommentsClick} />

                        <Tooltip title={`${this.props.movie.addedByUser}'s betyg`} placement="left" hidden={this.state.expanded} style={{fontSize:'16px'}}>
                                <div className="userRating">
                                    <div>
                                        <Icon style={{color:'#fcdb03'}}>star_rate</Icon>
                                    </div>
                                    <div>
                                        <span>{this.props.movie.addedByUserRating + '/10'}</span>
                                    </div>
                                </div>
                        </Tooltip>
                        <CardHeader
                            className="movieHeader"
                            title={<>
                                {this.props.movie.title}
                                <Tooltip title={`Tillagd av ${this.props.movie.addedByUser}`} placement="right">
                                    <Chip
                                        icon={<Icon>face</Icon>}
                                        label={this.props.movie.addedByUser}
                                        className="addedByUserChip"
                                    />
                                </Tooltip>
                                </>
                            }
                            titleStyle={{fontSize:'22px'}}
                            subtitle={<Overview movie={this.props.movie}/>}
                            avatar={<Avatar alt={this.props.movie.title} src={'http://image.tmdb.org/t/p/w185' + this.props.movie.poster_path} />}
                        />
                        
                        {
                            this.props.movie.backdrop_path != "" ? 
                                <CardMedia
                                    style={{marginLeft:"45px", width:'400px', display:'inline-block', marginTop:'10px'}}
                                    expandable={true}
                                    overlay={<CardTitle subtitleStyle={{fontSize:'14px'}} titleStyle={{fontSize:'18px'}} title={this.props.movie.title} subtitle={this.props.movie.tagline} />}
                                >
                                    <img style={{width:'400px', maxWidth: '400px'}} src={'http://image.tmdb.org/t/p/w500' + this.props.movie.backdrop_path} alt={this.props.movie.title} />
                                </CardMedia> 
                                : 
                                null
                        }
                        <CardText expandable={true} className="movieInfo">

                            <MovieStatsInfo movie={this.props.movie} />

                        </CardText>
                        <CardText expandable={true}>
                            <div className="movieOverview">
                                <Icon>format_quote</Icon>
                                    {this.props.movie.overview}
                                <Icon>format_quote</Icon>
                            </div>
                        </CardText>
                        <CardActions className="movieCollapseButtons">
                            {
                                this.state.expanded ? 
                                <FlatButton className="showLess" icon={<Icon color="inherit">expand_less</Icon>} label={"Visa mindre"} onClick={this.handleReduce} /> 
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

class MovieTools extends React.Component<IMovieToolsProps, {}> {
    public render() {
        return <>
                    <Tooltip title={`Lägg till '${this.props.movie.title}' i din watchlist`} placement="top">
                        <IconButton className="addToWatchList" touch={true} onClick={() => this.props.addMovieToWatchList(this.props.movie)}>
                            <Icon>remove_red_eye</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`Kommentarer om '${this.props.movie.title}'`} placement="left">
                        
                            <IconButton className="comments" touch={true} onClick={() => this.props.handleCommentsClick(this.props.movie)}>
                                <Badge className="badge" badgeContent={this.props.movie.movieCommentsCount} color="secondary" showZero={false}>
                                    <Icon>comment</Icon>
                                </Badge>
                            </IconButton>
                    </Tooltip>
               </>
    }
}

class MovieStatsInfo extends React.Component<IMovieStatsInfoProps, {}> {
    public render() {
        return <div className="statisticInfo">
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
    }
}

class Overview extends React.Component<IOverviewProps, {}> {
    public render() {
        var genres = getGenres(this.props.movie.genres);
        return <>
                    <div>Genres: {
                        genres.map(function(x: any) {
                            return <Chip key={x} label={x} className="movieChip"></Chip>;
                        })}
                    </div>
                    <div><Icon style={{fontSize:'15px !important'}}>format_quote</Icon> {`${this.props.movie.overview.substring(0, 150)}...`}</div>
                    
                </>
    }
}