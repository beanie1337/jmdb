import { db } from './firebase';

// *********** User API ***********
export const doCreateUser = (id, username, email, permission) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    permission,
  });


export const getUserInformation = (uid) => 
  db.ref('users').child(uid).once('value');

export const onceGetUsers = () =>
  db.ref('users').once('value');

// *********** Movies ***********

export const getMovieCommentsRef = (selectedMovieId) =>
  db.ref(`comments/${selectedMovieId}`);

export const getMovieComments = (selectedMovieId) =>
  db.ref(`comments/${selectedMovieId}`).once('value');

export const getMovie = (id) => 
  db.ref(`movies/${id}`).once('value');;

export const getMovies = () => 
  db.ref('movies').once('value');;
 
export const movieRef = () => 
  db.ref('movies'); 

export const saveMovieComment = (id, userComment, user) => {
    // var date = new Date(); 
    return db.ref(`comments/${id}/${parseInt(Date.now())}`).set({
      addedByUser:user.username,
      addedByUserDate:parseInt(Date.now()),
      comment:userComment
    });
}

export const saveMovieRatingByOthers = (movieId, user, rating) => {
  return db.ref(`movieRatingByOtherUsers/${movieId}/${user.uid}`).set({
      username: user.username,
      rating: rating
  });
}

export const getMovieRatingByOthers = (movieId) => 
  db.ref(`movieRatingByOtherUsers/${movieId}`).once('value');;
  


export const saveMovieSuggestion = (selected, rating, user) => {
  return db.ref(`movies/${selected.id}`).set({
    addedByUser:user.username,
    addedByUserDate:parseInt(Date.now()),
    addedByUserRating:rating,
    adult: selected.adult,
    vote_count: selected.vote_count,
    id: selected.id,
    video: selected.video,
    vote_average: selected.vote_average,
    title: selected.title,
    popularity: selected.popularity,
    poster_path: selected.poster_path,
    original_language: selected.original_language,
    genres: selected.genres,
    backdrop_path: selected.backdrop_path,
    overview: selected.overview,
    release_date: selected.release_date,
    budget: selected.budget,
    imdb_id: selected.imdb_id,
    revenue: selected.revenue,
    tagline: selected.tagline,
    runtime: selected.runtime
  });
}

// *********** Watchlist ***********

export const getWatchList = (uid) => 
  db.ref(`users/${uid}/watchList`).once('value')

export const removeMovieFromWatchList = (uid, key, id) => {
  db.ref(`users/${uid}/watchList/${key}`).remove()
}
export const saveMovieToWatchList = (uid, selected) => {
  console.log(uid, selected)
  db.ref(`users/${uid}/watchList`).push({
    // addedByUser:user.username,
    // adult: selected.adult,
    // vote_count: selected.vote_count,
    id: selected.id,
    // video: selected.video,
    // vote_average: selected.vote_average,
    title: selected.title,
    // popularity: selected.popularity,
    // poster_path: selected.poster_path,
    // original_language: selected.original_language,
    // genres: selected.genres,
    // backdrop_path: selected.backdrop_path,
    // overview: selected.overview,
    // release_date: selected.release_date,
    // budget: selected.budget,
    // imdb_id: selected.imdb_id,
    // revenue: selected.revenue,
    // tagline: selected.tagline,
    // runtime: selected.runtime
  });
}
  
