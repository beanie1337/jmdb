import React, { ChangeEvent } from 'react';
import withAuthorization from './withAuthorization';
import { db } from '../firebase';
import { Container, Col, Row } from 'reactstrap';
import { IMoviesState, IMoviesProps, IMovie } from '../types/types';
import { Movie } from './Movie';
import List from '@material-ui/core/List';
import { Subheader } from 'material-ui';
import { WatchList } from './WatchList'
import TablePagination from '@material-ui/core/TablePagination';
import { Pagination } from './Pagination';
import { timingSafeEqual } from 'crypto';
import { Snackbar } from '@material-ui/core';
import { FeedbackMessage } from './FeedbackMessage';

const userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo') || "");

class HomePage extends React.Component<IMoviesProps, IMoviesState > {
    constructor(props: IMoviesProps) {
      super(props);
  
      this.state = {
          movies: [],
          myWatchList: [],
          page: 0,
          rowsPerPage: 10,
          feedbackOpen:false,
          feedbackMessage: '',
          feedbackVariant: 'info'
      };

      this.addMovieToWatchList = this.addMovieToWatchList.bind(this);
      this.removeMovieFromWatchList = this.removeMovieFromWatchList.bind(this);
      this.handleCloseFeedback = this.handleCloseFeedback.bind(this);
    }
    public componentDidMount() {
        
        //Get movies
        db.getMovies().then(snapshot => {
            this.setState({
                movies:snapshot.val()
            })
        });    

        //Get watchlist
        db.getWatchList(userInfo.uid).then((snapshot) => {
            this.setState({
                myWatchList: snapshot.val()
            })
        })
    }
    private removeMovieFromWatchList(key: any, index: number) {
        
        db.removeMovieFromWatchList(userInfo.uid, key[0]);
        var newWatchList = [] as IMovie[]
        Object.entries(this.state.myWatchList).find((k) => {
            if (key[0] !== k[0]) {
                newWatchList.push(k[1])
            }
        });

        this.setState({
            myWatchList: Object.assign({}, newWatchList),
            feedbackOpen:true,
            feedbackMessage: 'Filmen är nu borttagen från din watchlist!',
            feedbackVariant: 'success'
        })
    }
    private addMovieToWatchList(movie:IMovie) {

        db.getWatchList(userInfo.uid).then(snapshot => {
            if (snapshot.val() != null) {
                var matchingKey = Object.keys(snapshot.val()).find(key => snapshot.val()[key].id == movie.id);
                
                if (matchingKey == null) {
                    db.saveMovieToWatchList(userInfo.uid, movie)
                    this.setState(prevState => ({
                        myWatchList: {
                            movie,
                            ...prevState.myWatchList
                        },
                        feedbackOpen:true,
                        feedbackMessage: 'Filmen är nu tillagd i din watchlist!',
                        feedbackVariant: 'success'
                    }));
                }
                else if (matchingKey.length > 0) {
                    this.setState({
                        feedbackOpen:true,
                        feedbackMessage: 'Filmen finns redan i din watchlist!',
                        feedbackVariant: 'warning'
                    })
                }
            }
            else {
                db.saveMovieToWatchList(userInfo.uid, movie)
                this.setState(prevState => ({
                    myWatchList: {
                        movie,
                        ...prevState.myWatchList
                    },
                    feedbackOpen:true,
                    feedbackMessage: 'Filmen är nu tillagd i din watchlist!',
                    feedbackVariant: 'success'
                }));
            }
        });
    }
    private handleChangePage = (event: any, newPage: any) => {
        this.setState({
            page:newPage
        })
    }
    
    private handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(event.target.value)
        this.setState({
            rowsPerPage:Number(event.target.value),
            page:0
        })
    }
    private handleCloseFeedback() {
        this.setState({
            feedbackOpen:false
        })
    }
    public render() {
    
      return (
        <Container>
            <FeedbackMessage 
                message={this.state.feedbackMessage} 
                open={this.state.feedbackOpen} 
                handleCloseFeedback={this.handleCloseFeedback} 
            />
            <Row>
                <Col xs="9" style={{padding:"0"}}>
                    <Container className="movieListContainer" style={{padding:"0"}}>
                        <Pagination 
                            page={this.state.page} 
                            rowsPerPage={this.state.rowsPerPage} 
                            movies={this.state.movies} 
                            handleChangePage={this.handleChangePage}
                            handleChangeRowsPerPage={this.handleChangeRowsPerPage} 
                        />
                        <List>
                            {
                                Object.entries(this.state.movies).map((x) => {
                                    var movie = x[1]
                                    return <Movie key={movie.id} movie={movie} addMovieToWatchlist={this.addMovieToWatchList}></Movie>
                                })
                                .slice(
                                    this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
                                )
                            }                            
                        </List>
                        <Pagination 
                            page={this.state.page} 
                            rowsPerPage={this.state.rowsPerPage} 
                            movies={this.state.movies} 
                            handleChangePage={this.handleChangePage}
                            handleChangeRowsPerPage={this.handleChangeRowsPerPage} 
                        />
                    </Container>
                </Col>
                <Col xs="3" style={{paddingRight:"0"}}>
                    <Container>
                            <WatchList userId={userInfo.uid} watchList={this.state.myWatchList} removeMovieFromWatchList={this.removeMovieFromWatchList} />
                    </Container>
                </Col>
            </Row>
        </Container>
      );
    }
}

const authCondition = (authUser: any) => !!authUser;

export default withAuthorization(authCondition)(HomePage);