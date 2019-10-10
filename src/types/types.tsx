import { userInfo } from "os";

export interface IMoviesState {
    movies: IMovie[],
    myWatchList: IMovie[],
    page:number,
    rowsPerPage:number,
    feedbackOpen:boolean,
    feedbackMessage:string,
    feedbackVariant?: 'error' | 'info' | 'success' | 'warning',
    filterValue:string,
    completedLoadingMovies:boolean,
    completedLoadingWatchList: boolean,
    addNewMovieDialogOpen:boolean,
    movieCommentsDialogOpen:boolean,
    movieComments:IMovieComment[],
    selectedMovieId:number | null
}

export interface IMovieCommentsDialogProps {
    open:boolean,
    comments:IMovieComment[],
    saveMovieComment:any,
    movieCommentsDialog:any,
    userInfo:any,
    selectedMovieId:number | null
}

export interface IMovieCommentsDialogState {
    comment:string,
    page: number,
    rowsPerPage: number,
}

export interface IMovieComment {
    addedByUser:string,
    addedByUserDate:number,
    comment:string
}

export interface IMoviesProps {

}

export interface IMovieProps {
    suggestion:IMovie,
    addSuggestionToWatchList:any,
    handleCommentsClick:any,
    isTvShow:boolean
}

export interface IMovieState {
    expanded:boolean
}

export interface IMovie {
    title:string,
    name:string,
    addedByUser:string,
    addedByUserDate:Date,
    addedByUserRating:number,
    adult:boolean,
    backdrop_path:string,
    budget:number,
    genres:Array<string>,
    id:number,
    imdb_id:string,
    original_language:string,
    overview:string,
    popularity:number,
    poster_path:string,
    release_date:string,
    first_air_date:string,
    revenue:number,
    runtime:number,
    tagline:string,
    video:false,
    vote_average:number,
    vote_count:number,
    movieCommentsCount:number
    [key:number]:IMovie,
    media_type:string,
    stream:string,
    seasons:number,
    homepage:string,
    in_production:boolean,
    number_of_episodes:number,
    number_of_seasons:number,
    status:string,
    type:string,
    episode_run_time:number
}

export interface IOverviewProps {
    movie: IMovie
}

export interface IWatchListProps {
    userId: string,
    watchList: IMovie[],
    removeMovieFromWatchList:any,
    completedLoadingWatchList:boolean
}

export interface IWatchListState {
    watchList: IMovie[]
}

export interface IPaginationProps {
    page:number,
    rowsPerPage:number,
    items:IMovie[] | IMovieComment[],
    handleChangePage:any,
    handleChangeRowsPerPage:any
}

export interface IFeedbackMessageProps {
    variant:string, 
    className?:string,
    message:string,
    open:boolean,
    handleCloseFeedback:any
}

export interface IFeedbackMessageState {
    showSnackbar:boolean
}

export interface IAddNewDialogProps {
    open:boolean,
    addNewMovieDialog:any,
    addMovieSuggestion:any,
    userInfo:any
}

export interface IAddNewDialogState {
    suggestions: IMovie[],
    selection: IMovie,
    value:string,
    userRatingValue:number
}

export interface ISuggestedMovie {
    suggestion:IMovie[]
}

export interface IMovieStatsInfoProps {
    movie: IMovie
}

export interface IMovieToolsProps {
    movie: IMovie,
    addMovieToWatchList: any,
    handleCommentsClick:any
}

export interface IStreamProps {
    suggestion: IMovie
}