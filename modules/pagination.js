import { Component } from "react"
import {Button, Pagination} from "react-bootstrap"

export default class PaginationTable extends Component {

    state = {
        pagesCount: []
    }

    componentDidMount() {
        this.renderPagesCount()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.renderPagesCount()
        }
    }

    renderPagesCount = () => {
        let pages = []

        for (let i = 1; i <= this.props.lastPage; i++) pages.push(i)

        this.setState({pagesCount: pages})
    }

    render() {
        const {activePage, lastPage, onClick} = this.props
        const {pagesCount} = this.state

        const pageCount = pagesCount.map((page, i) => {
            if (page < activePage + 10) {
                if (page > activePage - 10) {
                    let active = '';

                    if (page === activePage) active = 'active'

                    return (
                        <li key={i} className={"page-item " + active}>
                            <Button
                                type='link'
                                className="page-link"
                                disabled={active}
                                onClick={() => onClick(page)}
                            >
                                {page}
                            </Button>
                        </li>
                    )
                }
            }
        })

        const pageEllipsis = <Pagination.Ellipsis disabled/>

        return (
            <Pagination className='text-right'>
                <li className={"page-item"}>
                    <Button
                        type='link'
                        variant='dark'
                        className="page-link"
                        disabled={activePage === 1}
                        onClick={() => onClick(1)}
                    >
                        &laquo;
                    </Button>
                </li>
                
                {pageEllipsis}
                {pageCount}
                {pageEllipsis}

                <li className={"page-item"}>
                    <Button
                        type='link'
                        variant='dark'
                        className="page-link"
                        disabled={activePage === lastPage}
                        onClick={() => onClick(lastPage)}
                    >
                        &raquo;
                    </Button>
                </li>
            </Pagination>
        )
    }
}