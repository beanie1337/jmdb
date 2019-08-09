import { TablePagination } from "@material-ui/core";
import React from "react";
import { IPaginationProps } from "../types/types";

export class Pagination extends React.Component<IPaginationProps, {}> {
    constructor(props: IPaginationProps) {
        super(props)
    }
    render() {
        return <TablePagination
                    component="div"
                    page={this.props.page}
                    rowsPerPage={this.props.rowsPerPage}
                    count={Object.keys(this.props.movies).length}
                    onChangePage={this.props.handleChangePage}
                    onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
                    backIconButtonProps={{
                        'aria-label' : 'Föregående'
                    }}
                    nextIconButtonProps={{
                        'aria-label' : 'Nästa'
                    }}
                    labelRowsPerPage="Filmer per sida"
                />
    }
}