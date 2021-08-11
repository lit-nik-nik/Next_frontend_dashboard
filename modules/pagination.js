import { Component } from "react"
import { Pagination } from "react-bootstrap"
import Link from "next/link"

export default class PaginationTable extends Component {

    render() {
        const {pagesCount, acitvePage, lastPage} = this.props

        const pageCount = pagesCount.map((page, i) => {
            if (page < acitvePage + 10) {
                if (page > acitvePage - 10) {
                    let active = '';

                    if (page === acitvePage) active = 'active'

                    return (
                        <li key={i} className={"page-item " + active}>
                            <Link  href={`/packages/${page}`} >
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
                    <Link  href={`/packages/1`} >
                        <a className="page-link">
                            &laquo;
                        </a>
                    </Link>
                </li>
                
                {pageEllipsis}
                {pageCount}
                {pageEllipsis}

                <li className={"page-item"}>
                    <Link  href={`/packages/${lastPage}`} >
                        <a className="page-link">
                            &raquo;
                        </a>
                    </Link>
                </li>
            </Pagination>
        )
    }
}