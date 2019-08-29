import React, { ChangeEvent } from 'react';
import Autosuggest from "react-autosuggest";
import { IAddNewDialogProps, IAddNewDialogState, IMovie } from '../types/types';
import { db } from '../firebase';
import { userInfo } from 'os';
import { Paper } from 'material-ui';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { format } from 'date-fns';
import { apiKey, tmdbUrl } from '../constants/keys';
import { Rating } from '@material-ui/lab';

export class AddNewMovieDialog extends React.Component<IAddNewDialogProps, IAddNewDialogState> {
    constructor(props: IAddNewDialogProps) {
        super(props);

        this.state = {
            selection: [] as unknown as IMovie,
            suggestions: [],
            value: '',
            userRatingValue: 5
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleRatingChange = this.handleRatingChange.bind(this);
    }
    private onSuggestionsFetchRequested = () => {
        if (this.state.value.length > 1) {
            //Search movies by users input
            fetch(`${tmdbUrl}/search/movie?${apiKey}&query=${this.state.value}`)
            .then(response => response.json())
            .then(data => this.setState({ suggestions: data.results })) 
        }
    }
    private onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] });
    }
    private onSuggestionSelected = (event: React.FormEvent<any>, data: Autosuggest.SuggestionSelectedEventData<IMovie>) => {

        //Get movie again, but with more details
        fetch(`${tmdbUrl}/movie/${data.suggestion.id}?${apiKey}`)
        .then(response => response.json())
        .then(data => {
            this.setState({ selection:data })
        })
    }
    private saveMovieSuggestion = () => {
        let movie = Object.assign({}, this.state.selection);
        movie.addedByUserRating = this.state.userRatingValue;
        movie.addedByUser = this.props.userInfo.username;
        movie.addedByUserDate = new Date(Date.now());

        db.getMovie(this.state.selection.id).then(snapshot => {
            if (snapshot.val() == null) {
                db.saveMovieSuggestion(this.state.selection, this.state.userRatingValue, this.props.userInfo).then(() => {
                    this.props.addNewMovieDialog(false);
                    this.props.addMovieSuggestion([
                        movie.id.toString(),
                        movie
                    ]);
                })
            }
            else {
                alert("Filmtipset finns redan!")
            }
        })
        
    }
    private onChange(event: React.FormEvent<any>, {newValue, method}: Autosuggest.ChangeEvent):void {
        this.setState({ value: newValue });
    }
    private handleClose() {
        this.props.addNewMovieDialog(false);
        this.setState({ 
            selection: [] as unknown as IMovie,
            value: ''
        })
    }
    private handleRatingChange(event: React.ChangeEvent<{}>, value: number):void {
        this.setState({
            userRatingValue:value
        })
    }
    public render() {
        const {value, selection} = this.state;
        const title = selection ? selection.title : '';
        const poster = selection ? selection.poster_path : '';
        const original_language = selection ? selection.original_language : '';
        const overview = selection ? selection.overview : '';
        const release_date = selection ? selection.release_date : '';
        const id = selection ? selection.id : '';
        return <div>
                <Dialog className="addNewMovieDialog" draggable={true} open={this.props.open} onClose={() => this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Lägg till filmtips</DialogTitle>
                    <DialogContent className="dialogContent">
                        <Autosuggest 
                            suggestions={this.state.suggestions}
                            onSuggestionSelected={this.onSuggestionSelected}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={{
                                placeholder: `Filmer hämtas från TMDB.org`,
                                value,
                                onChange: (e, changeEvent) => this.onChange(e, changeEvent),
                            }}
                        />
                        <Form className="addNewMovieForm">
                            <FormGroup>
                                {Object.keys(selection).length != 0 ? <>
                                    <div className="userRatingStars">
                                        <div className="userRatingLabel">Min rating: {this.state.userRatingValue}</div>
                                        <Rating 
                                            className="userStarRating" 
                                            name="size-large" 
                                            value={this.state.userRatingValue} 
                                            size="large" 
                                            max={10} 
                                            onChange={this.handleRatingChange} 
                                        /> 
                                    </div>
                                    <div className="inputFields">
                                        <Label>(HIDE THIS) ID</Label><br />
                                        <Input type="text" name="id" id="movieid" value={id} readOnly/>
                                        <Label>Titel</Label><br />
                                        <Input type="text" name="title" id="movieTitle" value={title} readOnly/>
                                        <Label>Poster</Label><br />
                                        <Input type="text" name="poster" id="moviePoster" value={poster} readOnly />
                                        <Label>Språk</Label><br />
                                        <Input type="text" name="lang" id="movieLanguage" value={original_language} readOnly />
                                        <Label>Sammanfattning</Label><br />
                                        <Input type="textarea" name="summary" id="movieSummary" value={overview} readOnly />
                                        <Label>Utgivningsdatum</Label><br />
                                        <Input type="text" name="releaseDate" id="movieReleaseDate" value={release_date} readOnly />
                                    </div>
                                    <Paper className="image">
                                        <img 
                                            src={
                                                poster != undefined ? "http://image.tmdb.org/t/p/w185" + poster : "https://via.placeholder.com/185x278?text=No%20poster"
                                            }
                                        />
                                    </Paper></>
                                : null }
                            </FormGroup>
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary" variant="contained">
                            Avbryt
                        </Button>
                        <Button disabled={Object.keys(this.state.selection).length === 0} onClick={this.saveMovieSuggestion} color="primary" variant="contained">
                            Spara
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
    }
    
    protected getSuggestionValue(suggestion: IMovie): string { return suggestion.title }
    protected renderSuggestion(suggestion: IMovie, params: Autosuggest.RenderSuggestionParams) {
        return <div>
                    {
                        suggestion.poster_path != null ? 
                            <img className="suggestionImage" src={"https://image.tmdb.org/t/p/w92"+suggestion.poster_path} alt={suggestion.title} /> 
                            : 
                            <img className="suggestionImage" src="https://via.placeholder.com/35x50?text=X" />
                    }
                    <div className="suggestionTitle"> {suggestion.title}</div><br />
                    
                    <div className="suggestionYear" style={{color:"grey"}}> {format(suggestion.release_date, 'YYYY')}</div>
                </div>
    }
}