export interface IMoviesState {
    movies: IMovie[],
    myWatchList: IMovie[],
    page:number,
    rowsPerPage:number,
    feedbackOpen:boolean,
    feedbackMessage:string,
    feedbackVariant?: 'error' | 'info' | 'success' | 'warning'
}

export interface IMoviesProps {

}

export interface IMovieProps {
    movie:IMovie,
    addMovieToWatchlist:any
}

export interface IMovieState {
    expanded:boolean
}

export interface IMovie {
    title:string,
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
    revenue:number,
    runtime:number,
    tagline:string,
    video:false,
    vote_average:number,
    vote_count:number

}

export interface IOverviewProps {
    movie: IMovie
}

export interface IWatchListProps {
    userId: string,
    watchList: IMovie[],
    removeMovieFromWatchList:any
}

export interface IWatchListState {
    watchList: IMovie[]
}

export interface IPaginationProps {
    page:number,
    rowsPerPage:number,
    movies:IMovie[],
    handleChangePage:any,
    handleChangeRowsPerPage:any
}

export interface IFeedbackMessageProps {
    variant?:string, 
    className?:string,
    message:string,
    open:boolean,
    handleCloseFeedback:any
}

export interface IFeedbackMessageState {
    showSnackbar:boolean
}