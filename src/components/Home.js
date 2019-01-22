import React, { Component } from 'react';
import { db } from '../firebase';
import withAuthorization from './withAuthorization';
import {Alert, Container, Col, Row, Media, Button, Collapse, Card, CardBody, ListGroupItem, Tooltip, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Form, FormGroup, Label, Input} from 'reactstrap';
import {TiDelete, TiEye, TiThumbsUp, TiWeatherSnow, TiStar} from 'react-icons/ti';
import {GoCommentDiscussion} from 'react-icons/go';
import AddNewMovieDialog from './Movies';
import StarRatingComponent from 'react-star-rating-component';
import {Loader} from './Loading';
import NewPostIcon from '../img/NewPostIcon.png';

class HomePage extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        movies: null,
        watchList: null,
        loader:true,
        loaderWatchlist:true
      };
    }
    componentDidMount() {
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        // db.getMovies().then(snapshot =>
        //     this.setState({ movies: snapshot.val() })
        // );
        var mov = [];
        db.getMovies().then(snapshot => {
           
            var movies = Object.entries(snapshot.val());
            var sorted = movies.sort((a, b) => b[1].addedByUserDate - a[1].addedByUserDate);

            this.setState({movies:sorted, loader:false});
        });
        db.getWatchList(userInfo.uid).then(snapshot => {
            this.setState({
                watchList:snapshot.val(),
                loaderWatchlist:false
            });
        });

        // db.movieRef().on('child_added', snapshot => {
        //     this.state.movies.push(snapshot.val())
        //     this.setState({movies:this.movies})
        // })
        
    }
    render() {
      const {movies, watchList} = this.state;
      
      return (
        <Container>
            <Row>
                <Col xs="9" style={{padding:"0"}}>
                    <Container className="movieListContainer" style={{padding:"0"}}>
                        {this.state.loader ? <Loader /> : null }
                        {!!movies && 
                            Object.keys(movies).map((key, index) =>
                                <MoviesList key={index} movie={movies[key]} />
                            )
                        }
                    </Container>
                </Col>
                <Col xs="3" style={{paddingRight:"0"}}>
                    <AddNewMovieDialog  />
                    <ul className="list-group">
                        <li className="list-group-item active" style={{textAlign:"center"}}><TiEye /> Min watchlist</li>
                        {/* {this.state.loaderWatchlist ? <Loader /> : null } */}
                        {watchList ? <WatchList watchList={watchList} /> : <li className="list-group-item">Inga filmer tillagda i din watchlist. Klicka på <TiEye size={24}/> för att spara ner ett filmtips till din watchlist.</li>}
                    </ul>
                </Col>
            </Row>
        </Container>
      );
    }
  }

class WatchList extends Component {
    removeMovieFromWatchList(key, e) {
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        db.removeMovieFromWatchList(userInfo.uid, key, e.currentTarget.id);
        alert('Filmen borttagen från watchlist')
        window.location.reload();
    }
    render() {
        var watchList = this.props.watchList;
        return(
            <div>
                {Object.keys(watchList).map(key =>
                    <li key={key} className="list-group-item">
                        <a href="#" id={watchList[key].id} onClick={this.removeMovieFromWatchList.bind(this, key)}>
                            <TiDelete className="deleteWatchListMovie"/>
                        </a> 
                        {
                            watchList[key].title.length > 26 ? watchList[key].title.substring(0,26)+"..." : watchList[key].title
                        }
                    </li>
                )}
            </div>
        )
    }
}

class MoviesList extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState({ 
            collapse: !this.state.collapse,
         });
    }
    
    render() {
        var movie = this.props.movie[1];
        return(
            <ListGroupItem onClick={this.toggle} href="#">
                <Media>
                    {this.state.collapse ? 
                        <Media object src={"http://image.tmdb.org/t/p/w154"+movie.poster_path} style={{borderTopLeftRadius:"5px", borderBottomLeftRadius:"5px", width:"50px", display:"none"}} />
                        :
                        <Media object src={"http://image.tmdb.org/t/p/w154"+movie.poster_path} style={{borderTopLeftRadius:"5px", borderBottomLeftRadius:"5px", width:"50px"}} />
                    }

                    <MovieCardMinimized movie={movie} />

                </Media>
                <Collapse isOpen={this.state.collapse}>
                    <Card className="movieCard">
                        <CardBody>
                            <Media>
                                <Media left href={movie.imdbUrl}>
                                    <Media object src={"http://image.tmdb.org/t/p/w154"+movie.poster_path} className="moviePoster" />
                                </Media>
                                <Media body>
                                    {/* <Media heading style={{marginLeft:"10px", marginTop:"5px"}}>
                                        <a target="_blank" className="linkMovieHeading" href={"https://www.imdb.com/title/"+movie.imdb_id}>{movie.title}</a>
                                    </Media > */}
                                    <Media>
                                        <Col>
                                            <Row>
                                                {movie.genres.length > 1 ? 
                                                        Object.keys(movie.genres).map(key =>
                                                            <span className="movieGenres badge badge-secondary" key={key}>{movie.genres[key].name}</span>
                                                        )
                                                     : 
                                                     <span className="movieGenres badge badge-secondary">{movie.genres[0].name}</span>
                                                }
                                            </Row>
                                            <Row>
                                                <p style={{marginLeft:"10px", marginRight:"10px"}}>{movie.overview}</p>
                                            </Row>
                                            <Row>
                                                <div style={{marginLeft:"10px"}}>
                                                    <span className="badge badge-light">Språk:</span> {movie.original_language}<br />
                                                    <span className="badge badge-light">TMDb-rating:</span> {movie.vote_average}<br />
                                                    <span className="badge badge-light">Runtime:</span> {movie.runtime}<br />
                                                </div>
                                            </Row>
                                        </Col>
                                    </Media>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                    {/* {this.state.collapse ? 
                        <a id={"showLess"+movie.id} href="#" className="showLess" ><TiArrowSortedUp size={24}/></a>
                        : ''
                        } */}
                </Collapse>
                {/* {this.state.collapse ? '':
                    <a id={"showMore"+movie.id} href="#" className="showMore" ><TiArrowSortedDown size={24}/></a>
                } */}
                
            </ListGroupItem>
        )
    }
}

class MovieCardMinimized extends Component {
    constructor(props) {
        super(props);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.state = { 
            tooltipOpen: false,  
            movieCommentsCount: 0, 
            movieRatingByOthersCount: 0,
            userAlreadyRated:false,
            userLatestLogin: ''
        };
    }
    componentDidMount() {
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        db.getMovieComments(this.props.movie.id).then(snapshot => {
            this.setState({
                movieCommentsCount: Object.keys(snapshot.val()).length,
                userLatestLogin:userInfo.LatestLogin
            })
        })
        db.getMovieRatingByOthers(this.props.movie.id).then(snapshot => {
            this.setState({
                movieRatingByOthersCount: Object.keys(snapshot.val()).length
            })
            var userRatings = Object.keys(snapshot.val());
            if (userRatings.find(uid => uid == userInfo.uid)) {
                this.setState({
                    userAlreadyRated:true
                })
            }
        })
    }
    addToWatchList(selectedMovie) {
        //console.log(selectedMovie)
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        
        db.getWatchList(userInfo.uid).then(snapshot => {
            if (snapshot.val() != null) {
                var matchingKey = Object.keys(snapshot.val()).find(key => snapshot.val()[key].id == selectedMovie.id);
                
                if (matchingKey == null) {
                    db.saveMovieToWatchList(userInfo.uid, selectedMovie)
                    alert("Filmen har lagts till i din watchlist!");
                    window.location.reload();
                }
                else if (matchingKey.length > 0) {
                    alert("Filmen finns redan i din watchlist!");
                }
            }
            else {
                db.saveMovieToWatchList(userInfo.uid, selectedMovie)
                alert("Filmen har lagts till i din watchlist!");
                window.location.reload();
            }
        });
        
    }
    toggleTooltip() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }
    render() {
        const movie = this.props.movie;
        //this.movieCommentsCount(movie.id)
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        var diff = userInfo.LatestLogin - movie.addedByUserDate;
        var hourDiff = Math.floor(diff/1000/60/60);

        return(
            <div>
                <div className="moviePreInfo">
                    <h4 className="movieTitleSpan">{movie.title} <span style={{color:"gray", fontSize:"16px"}}> ({movie.release_date})</span></h4> 
                    <span className="movieAddedBy badge badge-light">Tillagd av: {movie.addedByUser}</span> 
                    <span className="movieAddedBy badge badge-light">Tillagd datum: {new Date(movie.addedByUserDate).toLocaleDateString()}</span>
                    <span className="movieAddedBy badge badge-light">{movie.addedByUser}'s rating: <UserRating movieRating={movie.addedByUserRating}/></span>
                    {hourDiff <= 24  ? <img id={movie.id} className="newPostIcon" src={NewPostIcon} /> : null}
                </div>

                <ThumbsUp movie={movie}/>

                <a id={"addToWatch"+movie.id} href="#" className="addToWatchList" onClick={(e) => {e.stopPropagation();this.addToWatchList(movie)}}><TiEye size={24}/></a>
                
                <MovieRatingByOthers movie={movie} movieRatingByOthersCount={this.state.movieRatingByOthersCount} userAlreadyRated={this.state.userAlreadyRated}/>

                <MovieCommentsDialog movie={movie} movieCommentsCount={this.state.movieCommentsCount}/>
                
                <Tooltip placement="right" delay={0} isOpen={this.state.tooltipOpen} target={"addToWatch"+movie.id} toggle={this.toggleTooltip}>
                    Lägg till '{movie.title}' i din watchlist
                </Tooltip>
            </div>
        )
    }
}

class MovieRatingByOthers extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            tooltipOpen: false, 
            modal:false,
            rating: 1,
            successMessage: false,
            movieRatingByOthers: '',
            loader: true
        }

        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    openMovieRatingByOthers(movie) {
        db.getMovieRatingByOthers(movie.id).then((snapshot) => {
            this.setState({
                movieRatingByOthers:snapshot.val(),
                loader:false
            })
        })
    }
    save(movie) {
        //TODO: Loading spinner!!!!
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        db.saveMovieRatingByOthers(movie.id, userInfo, this.state.rating).then(() => {
            this.setState({
                successMessage: true
            });
        })
    }
    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }
    onChange = (event, { newValue, method }) => {
        this.setState({ value: newValue });
    }
    cancel() {
        this.setState({
            modal: !this.state.modal
        });
    }
    toggleTooltip() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    };
    render() {
        const movie = this.props.movie;
        const { rating, movieRatingByOthers } = this.state;
        return(
            <div>
                <Tooltip placement="left" delay={0} isOpen={this.state.tooltipOpen} target={"movieRateIcon"+movie.id} toggle={this.toggleTooltip}>
                    Betygsätt '{movie.title}'
                </Tooltip>
                <a id={"movieRateIcon"+movie.id} href="#" className="movieRateIcon" onClick={(e) => {e.stopPropagation();this.toggle();this.openMovieRatingByOthers(movie)}}>
                    <TiStar size={24}/>
                    {this.props.movieRatingByOthersCount > 0 ? 
                        <span className="movieRatingByOthersCount">{this.props.movieRatingByOthersCount}</span> 
                        : 
                        <span className="movieRatingByOthersCountNone">{this.props.movieRatingByOthersCount}</span>
                    }
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Betygsätt filmen '{movie.title}'</ModalHeader>
                    <ModalBody>
                    {!!this.state.successMessage &&
                        <Alert color="success">
                            Betyg inlagt!
                        </Alert>
                    }
                    
                    <h5>Andra användares betyg:</h5>
                    {this.state.loader ? <Loader /> : null }
                    {movieRatingByOthers ?
                            Object.keys(movieRatingByOthers).map((key, index) =>
                                <div className="message" key={key}>
                                    <span className="message__author">
                                        <Badge color="secondary">{movieRatingByOthers[key].username}:</Badge> {movieRatingByOthers[key].rating}/10
                                    </span>
                                    <span>
                                        
                                    </span>
                                </div>
                            )
                        : <span>Ingen har satt ett betyg än</span>
                    }
                    <hr />
                    <h5>Ge ditt betyg:</h5>
                    
                    {
                        this.props.userAlreadyRated ? 
                        <span>Du har redan gett betyg!</span> 
                        : 
                        <div>
                            <Label>Min rating: {rating}</Label>
                            <div style={{border:"1px dotted lightgrey", textAlign:"center", paddingTop:"10px"}}>
                                
                                <StarRatingComponent 
                                    name="rate2" 
                                    starCount={10}
                                    value={rating}
                                    renderStarIcon={() => <span><TiStar size={34} /></span>}
                                    onStarClick={this.onStarClick.bind(this)}
                                />
                            </div>
                        </div>
                    }
                    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" className="saveCommentsButton" onClick={() => {this.save(movie)}}>Spara</Button>
                        <Button color="danger" onClick={this.cancel}>Stäng</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

class UserRating extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        var userRating = this.props.movieRating;
        
        return(
            <span>{userRating}/10</span>
        )
    }
}

class ThumbsUp extends Component {
    constructor(props) {
        super(props);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.state = { tooltipOpen: false };
    }
    toggleTooltip() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }
    render(){
        const movie = this.props.movie;
        return(
            <div>
                {/* <a id={"thumbsUp"+movie.id} href="#" className="thumbsUp" ><TiThumbsUp size={24}/></a>
                <Tooltip placement="left" delay={0} isOpen={this.state.tooltipOpen} target={"thumbsUp"+movie.id} toggle={this.toggleTooltip}>
                    Ge '{movie.title}' en tumme upp
                </Tooltip> */}
            </div>
        )
    }
}

class MovieCommentsDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:false,
            value: '', 
            suggestions: [], 
            selection: null,
            rating: 1,
            movieComments: '',
            tooltipOpen: false,
            userComment: '',
            loader: true
        }

        this.toggleTooltip = this.toggleTooltip.bind(this);    
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentDidMount() {
        
    }
    toggleTooltip() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }
    openComments(movie) {
        const commentsRef = db.getMovieCommentsRef(movie.id);
        commentsRef.once('value').then((snapshot) => {
            this.setState({
                movieComments:snapshot.val(),
                loader:false
            })
        })
    }
    save(movie, comment) {
        //TODO: Loading spinner!!!!
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        db.saveMovieComment(movie.id, comment, userInfo).then(() => {
            this.setState({
                // modal: false,
                successMessage: 'JARRÅ',
                userComment: ''
            });
        });
    }

    cancel() {
        this.setState({
            modal: !this.state.modal,
            successMessage: ''
        });
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            successMessage: ''
        });
    };

    updateInputValue(evt) {
        this.setState({
            userComment: evt.target.value
        });
    };

    render() {
        const {movieComments} = this.state;
        const movie = this.props.movie;
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        return(
            <div>
                <Tooltip placement="top" delay={0} isOpen={this.state.tooltipOpen} target={"commentMovie"+movie.id} toggle={this.toggleTooltip}>
                    Kommentarer: {this.props.movieCommentsCount}
                </Tooltip>
                <a id={"commentMovie"+movie.id} href="#" className="movieCommentIcon" onClick={(e) => {e.stopPropagation();this.toggle();this.openComments(movie)}}><GoCommentDiscussion size={24}/>
                    {this.props.movieCommentsCount > 0 ? 
                        <span className="movieCommentsCount">{this.props.movieCommentsCount}</span> 
                        : 
                        <span className="movieCommentsCountNone">{this.props.movieCommentsCount}</span>
                    }
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Kommentarer om filmen '{movie.title}'</ModalHeader>
                    <ModalBody>
                        {!!this.state.successMessage &&
                            <Alert color="success">
                                Kommentaren skickad!
                            </Alert>
                        }
                        {this.state.loader ? <Loader /> : null }
                        {movieComments ?
                            Object.keys(movieComments).map((key, index) =>
                                <div className="message" key={key}>
                                    <span className="message__author">
                                        <div className="userCommentDate">{new Date(movieComments[key].addedByUserDate).toLocaleDateString() + " " + new Date(movieComments[key].addedByUserDate).toLocaleTimeString()}</div>
                                        <h6><Badge color="secondary">{movieComments[key].addedByUser}:</Badge></h6>
                                    </span>
                                    <span>
                                        {movieComments[key].comment}
                                    </span>
                                </div>
                            )
                        : <span>Inga kommentarer</span>}
                        <hr />
                        <FormGroup>
                            <Label>Skriv kommentar</Label><br></br>
                            <Badge color="secondary">{userInfo.username}</Badge>
                            <Input type="textarea" name="userComment" id="userComment" value={this.state.userComment} onChange={evt => this.updateInputValue(evt)} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" className="saveCommentsButton" disabled={!this.state.userComment} onClick={() => {this.save(movie, this.state.userComment)}}>Spara</Button>
                        <Button color="danger" onClick={this.cancel}>Stäng</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);