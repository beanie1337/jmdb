import React, { ChangeEvent } from 'react';
import withAuthorization from './withAuthorization';
import { db } from '../firebase';
import { Container, Col, Row } from 'reactstrap';
import { IMoviesState, IMoviesProps, IMovie, IMovieComment } from '../types/types';
import { Movie } from './Movie';
import List from '@material-ui/core/List';
import { WatchList } from './WatchList'
import { Pagination } from './Pagination';
import { Paper, InputBase, IconButton, Icon, CircularProgress, Button, MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { FeedbackMessage } from './FeedbackMessage';
import { AddNewMovieDialog } from './AddNewMovieDialog';
import { MovieCommentsDialog } from './MovieCommentsDialog';

const theme = createMuiTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: '14px'
        }
      }
    }
  })
  
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
          feedbackVariant: 'info',
          filterValue: '',
          completedLoadingMovies: false,
          completedLoadingWatchList: false,
          addNewMovieDialogOpen: false,
          movieCommentsDialogOpen: false,
          movieComments:[],
          selectedMovieId: null
      };

      this.addMovieToWatchList = this.addMovieToWatchList.bind(this);
      this.removeMovieFromWatchList = this.removeMovieFromWatchList.bind(this);
      this.handleCloseFeedback = this.handleCloseFeedback.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.addNewMovieDialog = this.addNewMovieDialog.bind(this);
      this.addMovieSuggestion = this.addMovieSuggestion.bind(this);
      this.handleCommentsClick = this.handleCommentsClick.bind(this);
      this.saveMovieComment = this.saveMovieComment.bind(this);
      this.movieCommentsDialog = this.movieCommentsDialog.bind(this);
    }
    public componentDidMount() {
        const userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo')!);
        //Get movies
        db.getMovies().then(snapshot => {
            var test = Object.entries(snapshot.val()).sort((a: any, b:any) => { 
                return Number(a[1].addedByUserDate) - Number(b[1].addedByUserDate); 
            }).reverse();

            this.setState({
                movies:test as unknown as IMovie[],
                completedLoadingMovies:true
            })
        });    

        //Get watchlist
        db.getWatchList(userInfo.uid).then((snapshot) => {
            this.setState({
                myWatchList: snapshot.val(),
                completedLoadingWatchList:true
            })
        })
    }
    private removeMovieFromWatchList(key: any, index: number) {
        const userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo')!);
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
        const userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo')!);
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
    private handleCommentsClick(movie:IMovie) {
        db.getMovieComments(movie.id).then(snapshot => {
            this.setState({
                movieCommentsDialogOpen:true,
                movieComments:snapshot.val() as IMovieComment[],
                selectedMovieId:movie.id
            })
        })
    }
    private saveMovieComment(movieId:number, comment:IMovieComment) {
        db.saveMovieComment(movieId, comment).then(() => {
            this.setState(prevState => ({
                movieComments: {
                    ...prevState.movieComments,
                    comment
                }
            }))
            db.incrementMovieCommentsCount(movieId);
        })
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
    private handleChange(e: { target: { value: string; }; }) {
       
        this.setState({
            filterValue: e.target.value
        })
    }
    private addMovieSuggestion(movie:IMovie) {
        this.setState(prevState => ({
            movies: [movie, ...prevState.movies],
            feedbackOpen:true,
            feedbackMessage: 'Filmtipset är nu tillagd!',
            feedbackVariant: 'success'
        }));
    }
    private addNewMovieDialog(open:boolean) {
        this.setState({
            addNewMovieDialogOpen: open
        })
    }
    private movieCommentsDialog(open:boolean) {
        this.setState({
            movieCommentsDialogOpen:open,
            selectedMovieId:null
        })
    }
    public render() {
        const userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo')!);
        var variant = this.state.feedbackVariant != undefined ? this.state.feedbackVariant : "";
        const { filterValue } = this.state;
        let filteredMovies = [] as IMovie[];

        if (filterValue != '') {
            filteredMovies = Object.values(this.state.movies).filter(movie => {
                const movieTitle = movie[1].title.toLowerCase();
                const fValue = filterValue.toLowerCase();
                return movieTitle.includes(fValue);
            })
        }
        else {
            filteredMovies = this.state.movies;
        }
      
      return (
          <MuiThemeProvider theme={theme}>
            <Container className="jmdbContainer">
                <FeedbackMessage 
                    message={this.state.feedbackMessage} 
                    open={this.state.feedbackOpen} 
                    handleCloseFeedback={this.handleCloseFeedback} 
                    variant={variant}
                />
                <Row>
                    <Col xs="9" style={{padding:"0"}}>
                    {
                        !this.state.completedLoadingMovies ? <CircularProgress /> :  
                            <Container className="movieListContainer" style={{padding:"0"}}>
                                <Container>
                                    {/* TODO BREAK OUT TO OWN COMPONENT */}
                                    <Paper className="searchBar">
                                        <InputBase 
                                            placeholder="Sök filmtitel"
                                            onChange={this.handleChange}
                                        />
                                        <IconButton>
                                            <Icon>search</Icon>
                                        </IconButton>
                                    </Paper>

                                    <Pagination 
                                        page={this.state.page} 
                                        rowsPerPage={this.state.rowsPerPage} 
                                        items={filteredMovies} 
                                        handleChangePage={this.handleChangePage}
                                        handleChangeRowsPerPage={this.handleChangeRowsPerPage} 
                                    />
                                </Container>
                                <hr />
                                <List>
                                    {
                                        Object.entries(filteredMovies).map((x) => {
                                            var movie = x[1][1] //TODO: Fix this
                                            return <Movie 
                                                        key={movie.id} 
                                                        movie={movie} 
                                                        addMovieToWatchlist={this.addMovieToWatchList} 
                                                        handleCommentsClick={this.handleCommentsClick} 
                                                    />
                                        })
                                        .slice(
                                            this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
                                        )
                                    }                            
                                </List>
                                <Pagination 
                                    page={this.state.page} 
                                    rowsPerPage={this.state.rowsPerPage} 
                                    items={filteredMovies} 
                                    handleChangePage={this.handleChangePage}
                                    handleChangeRowsPerPage={this.handleChangeRowsPerPage} 
                                />
                            </Container>
                    }
                    </Col>
                    <Col xs="3" style={{paddingRight:"0"}}  className="watchListContainer">
                        <Container>
                            <Button className="addMovieSuggestionBtn" onClick={() => this.addNewMovieDialog(true)} color="primary" variant="contained">
                                <Icon>add_circle</Icon>
                                 Lägg till filmtips
                            </Button>
                                <WatchList 
                                    userId={userInfo.uid} 
                                    watchList={this.state.myWatchList} 
                                    removeMovieFromWatchList={this.removeMovieFromWatchList} 
                                    completedLoadingWatchList={this.state.completedLoadingWatchList} 
                                />
                        </Container>
                    </Col>
                </Row>
                <AddNewMovieDialog 
                    open={this.state.addNewMovieDialogOpen} 
                    addNewMovieDialog={this.addNewMovieDialog} 
                    addMovieSuggestion={this.addMovieSuggestion} 
                    userInfo={userInfo}
                />
                <MovieCommentsDialog 
                    open={this.state.movieCommentsDialogOpen} 
                    comments={this.state.movieComments}
                    saveMovieComment={this.saveMovieComment}
                    movieCommentsDialog={this.movieCommentsDialog}
                    userInfo={userInfo}
                    selectedMovieId={this.state.selectedMovieId}
                />
            </Container>
        </MuiThemeProvider>
      );
    }
}

const authCondition = (authUser: any) => !!authUser;

export default withAuthorization(authCondition)(HomePage);