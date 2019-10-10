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
  db.ref(`movies/${id}`).once('value');

export const getMovies = () => 
  db.ref('movies').once('value');
 
export const movieRef = () => 
  db.ref('movies'); 

export const saveMovieComment = (id, comment) => {
    // var date = new Date(); 
    return db.ref(`comments/${id}/${parseInt(Date.now())}`).set({
      addedByUser:comment.addedByUser,
      addedByUserDate:comment.addedByUserDate,
      comment:comment.comment
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
  


export const saveMovieSuggestion = (selected, user) => {
  return db.ref(`movies/${selected.id}`).set({
    addedByUser: user.username,
    addedByUserDate: parseInt(Date.now()),
    addedByUserRating: selected.addedByUserRating,
    adult: selected.adult !== undefined ? selected.adult : false,
    vote_count: selected.vote_count,
    id: selected.id,
    video: selected.video !== undefined ? selected.video : false,
    vote_average: selected.vote_average,
    title: selected.title,
    popularity: selected.popularity,
    poster_path: selected.poster_path,
    original_language: selected.original_language,
    genres: selected.genres,
    backdrop_path: selected.backdrop_path,
    overview: selected.overview,
    release_date: selected.release_date,
    budget: selected.budget !== undefined ? selected.budget : 0,
    imdb_id: selected.imdb_id !== undefined ? selected.imdb_id : "",
    revenue: selected.revenue !== undefined ? selected.revenue : 0,
    tagline: selected.tagline !== undefined ? selected.tagline : "",
    runtime: selected.runtime !== undefined ? selected.runtime : 0,
    movieCommentsCount: 0,
    media_type: selected.media_type,
    moreInfo: selected.media_type === 'tv' ? { //Check if media_type is tv then save additional info
      homepage: selected.homepage,
      in_production: selected.in_production,
      number_of_episodes: selected.number_of_episodes,
      number_of_seasons: selected.number_of_seasons,
      status: selected.status,
      type: selected.type,
      episode_run_time: selected.episode_run_time
    } : null //Just null if media_type is movie
  });
}

export const incrementMovieCommentsCount = (movieId) => {
  getMovie(movieId).then(snapshot => {
    let commentsCount = snapshot.val().movieCommentsCount +1
    console.log(commentsCount)
    db.ref(`movies/${movieId}`).update({movieCommentsCount:commentsCount})
  });
  
} 

// *********** Watchlist ***********

export const getWatchList = (uid) => 
  db.ref(`users/${uid}/watchList`).once('value')

export const removeMovieFromWatchList = (uid, key) => {
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
  
