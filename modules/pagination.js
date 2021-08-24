import { Component } from "react"
import { Pagination } from "react-bootstrap"
import Link from "next/link"

export default class PaginationTable extends Component {

    render() {
        const {pagesCount, activePage, lastPage} = this.props

        const pageCount = pagesCount.map((page, i) => {
            if (page < activePage + 10) {
                if (page > activePage - 10) {
                    let active = '';

                    if (page === activePage) active = 'active'

                    return (
                        <li key={i} className={"page-item " + active}>
                            <Link  href={`${page}`} >
                                <a className="page-link">
                                    {page}
                                </a>
                            </Link>
                        </li>
                        
                        
                    )
                }
            }
        })

        const pageEllipsis = <Pagination.Ellipsis disabled/>

        return (
            <Pagination className='text-right'>
                <li className={"page-item"}>
                    <Link  href={`1`} >
                        <a className="page-link">
                            &laquo;
                        </a>
                    </Link>
                </li>
                
                {pageEllipsis}
                {pageCount}
                {pageEllipsis}

                <li className={"page-item"}>
                    <Link  href={`${lastPage}`} >
                        <a className="page-link">
                            &raquo;
                        </a>
                    </Link>
                </li>
            </Pagination>
        )
    }
}