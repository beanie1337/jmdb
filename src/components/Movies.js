import React, { Component } from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input} from 'reactstrap'
import {TiStar} from 'react-icons/ti';
import Autosuggest from "react-autosuggest";
import StarRatingComponent from 'react-star-rating-component';
import {db, firebase} from '../firebase'

class AddNewMovieDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:false,
            value: '', suggestions: [], 
            selection: null,
            user: firebase.auth.currentUser,
            rating: 1
        }

        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    onChange = (event, { newValue, method }) => {
        this.setState({ value: newValue });
    }
      
    onSuggestionsFetchRequested = ({ value }) => {
        if (value.length > 3) {
        //Search movies by users input
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=a914495401933729d2471d53da4512bf&query=${value}`)
        .then(response => response.json())
        .then(data => this.setState({ suggestions: data.results })) 
        }
    }

    onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] });
    };

    onSuggestionSelected = (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) => {

        //Get movie again, but with more details
        fetch(`https://api.themoviedb.org/3/movie/${suggestion.id}?api_key=a914495401933729d2471d53da4512bf`)
        .then(response => response.json())
        .then(data => {
            this.setState({ selection:data })
        })
    }
    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }
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
    }
    
    render() {
        const { value, suggestions, selection } = this.state;
        const inputProps = {
            placeholder: "Skriv minst 4 bokstäver",
            value,
            onChange: this.onChange
        };
        
        const title = selection ? selection.title : '';
        const poster = selection ? selection.poster_path : '';
        const original_language = selection ? selection.original_language : '';
        const overview = selection ? selection.overview : '';
        const release_date = selection ? selection.release_date : '';
        const id = selection ? selection.id : '';
        const { rating } = this.state;
        return(
            <div>
                <Button color="success" onClick={this.toggle} style={{marginBottom:"10px", width:"100%"}}>Lägg till filmtips</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Lägg till filmtips</ModalHeader>
                    <ModalBody>
                        <Label style={{fontStyle:"bold"}}>Sök på filmtitel (hämtas från themoviedb.org)</Label>
                        <Autosuggest 
                            suggestions={suggestions}
                            onSuggestionSelected={this.onSuggestionSelected}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps} 
                            />

                        <Form>
                            <FormGroup>
                                <Label>Min rating: {rating}</Label>
                                <br />
                                <div style={{border:"1px dotted lightgrey", textAlign:"center", paddingTop:"10px"}}>
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={10}
                                        value={rating}
                                        renderStarIcon={() => <span><TiStar size={34} /></span>}
                                        onStarClick={this.onStarClick.bind(this)}
                                    />
                                </div>
                                <Label>(HIDE THIS) ID</Label>
                                <Input type="text" name="id" id="movieid" value={id} readOnly/>
                                <Label>Titel</Label>
                                <Input type="text" name="title" id="movieTitle" value={title} readOnly/>
                                <Label>Poster</Label>
                                <Input type="text" name="poster" id="moviePoster" value={poster} readOnly />
                                <Label>Språk</Label>
                                <Input type="text" name="lang" id="movieLanguage" value={original_language} readOnly />
                                <Label>Sammanfattning</Label>
                                <Input type="textarea" name="summary" id="movieSummary" value={overview} readOnly />
                                <Label>Utgivningsdatum</Label>
                                <Input type="text" name="releaseDate" id="movieReleaseDate" value={release_date} readOnly />
                            </FormGroup>
                        </Form>
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

const getSuggestionValue = (suggestion) => suggestion.title
const renderSuggestion = (suggestion) => (
    <div>
        <img style={{width:"30px"}} src={"https://image.tmdb.org/t/p/w92"+suggestion.poster_path} alt={suggestion.title} />
        <span> {suggestion.title}</span><br />
        
        {/* <span style={{color:"grey"}}> {suggestion.release_date}</span> */}
    </div>
)


// class StarRating extends Component {
//     constructor() {
//       super();
  
//       this.state = {
//         rating: 1
//       };
//     }
  
//     onStarClick(nextValue, prevValue, name) {
//       this.setState({rating: nextValue});
//     }
  
//     render() {
//       const { rating } = this.state;
      
//       return (                
//         <div>
//           <Label>Min rating: {rating}</Label>
//           <br />
//           <div style={{border:"1px dotted lightgrey", textAlign:"center", paddingTop:"10px"}}>
//             <StarRatingComponent 
//                 name="rate1" 
//                 starCount={10}
//                 value={rating}
//                 renderStarIcon={() => <span><TiStar size={34} /></span>}
//                 onStarClick={this.onStarClick.bind(this)}
//             />
//           </div>
//         </div>
//       );
//     }
//   }


// class SearchMovie extends Component {
//   constructor() {
//     super()
//     this.state = { value: '', suggestions: [], selection: null }
//     this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
//   }

//   onChange = (event, { newValue, method }) => {
//     this.setState({ value: newValue });
//   }
  
//   onSuggestionsFetchRequested = ({ value }) => {
//       if (value.length > 3) {
//         fetch(`https://api.themoviedb.org/3/search/movie?api_key=a914495401933729d2471d53da4512bf&query=${value}`)
//         .then(response => response.json())
//         .then(data => this.setState({ suggestions: data.results }))
//       }
//   }

//   onSuggestionsClearRequested = () => {
//     this.setState({ suggestions: [] });
//   };

//   onSuggestionSelected = (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) => {
//       this.setState({
//         selection:suggestion
//       });
//       console.log(suggestion.title)
//   }
//   render() {
//     const { value, suggestions, selection } = this.state;
//     const inputProps = {
//       placeholder: "Skriv minst 4 bokstäver",
//       value,
//       onChange: this.onChange
//     };
    
//     const title = selection ? selection.title : '';
//     const poster = selection ? selection.poster_path : '';
//     const original_language = selection ? selection.original_language : '';
//     const overview = selection ? selection.overview : '';
//     const release_date = selection ? selection.release_date : '';
//     const id = selection ? selection.id : '';

//     return (
//         <div>
//             <Autosuggest 
//                 suggestions={suggestions}
//                 onSuggestionSelected={this.onSuggestionSelected}
//                 onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//                 onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//                 getSuggestionValue={getSuggestionValue}
//                 renderSuggestion={renderSuggestion}
//                 inputProps={inputProps} 
//                 />

//             <Form>
//                 <FormGroup>
//                     <StarRating />
//                     <Label>ID (HIDE THIS)</Label>
//                     <Input type="text" name="id" id="movieid" value={id} readOnly/>
//                     <Label>Titel</Label>
//                     <Input type="text" name="title" id="movieTitle" value={title} readOnly/>
//                     <Label>Poster</Label>
//                     <Input type="text" name="poster" id="moviePoster" value={poster} readOnly />
//                     <Label>Språk</Label>
//                     <Input type="text" name="lang" id="movieLanguage" value={original_language} readOnly />
//                     <Label>Sammanfattning</Label>
//                     <Input type="textarea" name="summary" id="movieSummary" value={overview} readOnly />
//                     <Label>Utgivningsdatum</Label>
//                     <Input type="text" name="releaseDate" id="movieReleaseDate" value={release_date} readOnly />
//                 </FormGroup>
//             </Form>
//         </div>
//     );
//   }
// }
export default AddNewMovieDialog;
