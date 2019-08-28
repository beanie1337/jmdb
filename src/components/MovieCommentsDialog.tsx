import React from 'react';
import { IMovieCommentsDialogProps, IMovieCommentsDialogState, IMovieComment } from '../types/types';
import { Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, Paper, Typography, TextField, Divider, TablePagination } from '@material-ui/core';
import { Button } from 'reactstrap';
import { format } from 'date-fns';
import { Pagination } from './Pagination';

export class MovieCommentsDialog extends React.Component<IMovieCommentsDialogProps, IMovieCommentsDialogState> {
    constructor(props: IMovieCommentsDialogProps) {
        super(props)
        this.state = {
            comment: '',
            page: 0,
            rowsPerPage: 10,
        }
        this.handleClose = this.handleClose.bind(this);
    }
    private handleClose() {
        this.setState({
            comment:''
        })
        this.props.movieCommentsDialog(false);
    }
    private onChange(event:any) {
        this.setState({
            comment:event.target.value
        })
    }
    private saveMovieComment(comment:string) {
        let saveComment:IMovieComment = {
            addedByUser:this.props.userInfo.username,
            addedByUserDate:Date.now(),
            comment:comment
        }
        this.setState({
            comment:''
        })
        this.props.saveMovieComment(this.props.selectedMovieId, saveComment);
    }
    render() {
        return <Dialog className="movieCommentsDialog" draggable={true} open={this.props.open} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Kommentarer</DialogTitle>
                    <DialogContent className="dialogContent">
                        {
                            this.props.comments != null ? 
                                <List className="commentsList">
                                    {
                                        Object.entries(this.props.comments).map(x => {
                                            return <>
                                                    <ListItem key={x[1].addedByUserDate.toString()}>
                                                        <Paper className="commentContent">
                                                            <div className="user">
                                                                {x[1].addedByUser}
                                                            </div>
                                                            <div className="date">
                                                                {format(x[1].addedByUserDate, 'YYYY-MM-DD HH:mm')}
                                                            </div>
                                                            <div className="comment">
                                                                {x[1].comment}
                                                            </div>
                                                        </Paper>
                                                    </ListItem>
                                            </>
                                        }).reverse()
                                    }
                                </List>
                                : <div className="noCommentsExists">Det finns inga kommentarer</div>
                        }
                        <TextField
                            id="filled-multiline-static"
                            className="commentTextField"
                            label="Skriv kommentar"
                            multiline
                            rows="4"
                            placeholder="Skriv din kommentar och tryck sedan på spara."
                            margin="normal"
                            onChange={(e) => this.onChange(e)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Stäng
                        </Button>
                        <Button disabled={this.state.comment.length === 0} onClick={() => this.saveMovieComment(this.state.comment)} color="primary">
                            Spara
                        </Button>
                    </DialogActions>
                </Dialog>
    }
}