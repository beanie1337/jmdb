import React, { Component } from 'react';
import { db } from '../firebase';
import withAuthorization from './withAuthorization';
import {Container, Col, Row, Media, Button, Collapse, Card, CardBody, ListGroupItem, Tooltip, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup} from 'reactstrap';
import {TiDelete, TiEye, TiMessageTyping} from 'react-icons/ti';
import {GoCommentDiscussion} from 'react-icons/go';
import AddNewMovieDialog from './Movies';
import {Loader} from './Loading';

class HomePage extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        movies: null,
        watchList: null,
        loader:true,
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
            this.setState({watchList:snapshot.val()});
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
                    {!!watchList && <WatchList watchList={watchList} />}
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
    }
    render() {
        var watchList = this.props.watchList;
        return(
            <ul className="list-group">
                <li className="list-group-item active" style={{textAlign:"center"}}><TiEye /> Min watchlist</li>
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
            </ul>
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
                                                <p style={{marginLeft:"10px", marginRight:"10px"}}>{movie.overview}</p>
                                            </Row>
                                            <Row>
                                                <div style={{marginLeft:"10px"}}>
                                                    <span className="">Språk: {movie.original_language}</span><br />
                                                    <span className="">TMDb-rating: {movie.vote_average}</span><br />
                                                    <span className="">Runtime: {movie.runtime}</span><br />
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
        this.state = { tooltipOpen: false };
    }
    addToWatchList(selectedMovie) {
        //console.log(selectedMovie)
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        var movieExists = false;
        db.getWatchList(userInfo.uid).then(snapshot => {
            if (snapshot.val() != null) {
                var matchingKey = Object.keys(snapshot.val()).find(key => snapshot.val()[key].id == selectedMovie.id);
                
                if (matchingKey == null) {
                    db.saveMovieToWatchList(userInfo.uid, selectedMovie)
                    alert("Filmen har lagts till i din watchlist!");
                }
                else if (matchingKey.length > 0) {
                    alert("Filmen finns redan i din watchlist!");
                }
            }
            else {
                db.saveMovieToWatchList(userInfo.uid, selectedMovie)
                alert("Filmen har lagts till i din watchlist!");
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
        return(
            <div>
                <div className="moviePreInfo">
                    <h4 className="movieTitleSpan">{movie.title} <span style={{color:"gray", fontSize:"16px"}}>- ({movie.release_date})</span></h4> 
                    <span className="movieAddedBy badge badge-light">Tillagd av: {movie.addedByUser}</span>
                    <span className="movieAddedBy badge badge-light">Tillagd datum: {new Date(movie.addedByUserDate).toLocaleDateString()}</span>
                    <span className="movieAddedBy badge badge-light">{movie.addedByUser}'s rating: {movie.addedByUserRating}/10</span>
                </div>

                
                <a id={"addToWatch"+movie.id} href="#" className="addToWatchList" onClick={(e) => {e.stopPropagation();this.addToWatchList(movie)}}><TiEye size={24}/></a>
                
                <MovieCommentsDialog movie={movie}/>

                {/* <Tooltip placement="right" isOpen={this.state.tooltipOpen} target={"commentMovie"+movie.id} toggle={this.toggleTooltip}>
                                                        Lägg till en kommentar
                                                    </Tooltip> */}

                <Tooltip placement="right" isOpen={this.state.tooltipOpen} target={"addToWatch"+movie.id} toggle={this.toggleTooltip}>
                    Lägg till '{movie.title}' i din watchlist
                </Tooltip>
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
        }

        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentDidMount() {
        
    }

    openComments(movie) {
        const commentsRef = db.getMovieCommentsRef(movie.id);
        commentsRef.once('value').then((snapshot) => {
            this.setState({
                movieComments:snapshot.val()
            })
        })
    }
    // onChange = (event, { newValue, method }) => {
    //     this.setState({ value: newValue });
    // }
      
    save = () => {
        //TODO: Loading spinner!!!!
        var userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));
        db.saveMovieSuggestion(this.state.selection, this.state.rating, userInfo).then(() => {
            this.setState({
                modal: false
            });
        });
    }

    cancel() {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    render() {
        const {movieComments} = this.state;
        const movie = this.props.movie;
        
        return(
            <div>
                <a id={"commentMovie"+movie.id} href="#" className="movieCommentIcon" onClick={(e) => {e.stopPropagation();this.toggle();this.openComments(movie)}}><GoCommentDiscussion size={24}/></a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Kommentarer om filmen '{movie.title}'</ModalHeader>
                    <ModalBody>
                        
                            {Object.keys(movieComments).map((key, index) =>
                                <div className="message">
                                            <span className="message__author">
                                                {movieComments[key].addedByUser}:
                                            </span>
                                    {movieComments[key].comment}
                                </div>
                            )}
                      
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.save}>Spara</Button>{' '}
                        <Button color="danger" onClick={this.cancel}>Avbryt</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);