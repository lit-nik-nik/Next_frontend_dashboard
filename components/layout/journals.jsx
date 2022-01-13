import React, {Component} from "react";
import {Col, Button, Row, Alert} from "react-bootstrap";
import Link from "next/link";

export default class JournalLayout extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        pages: [
            {
                type: 'plans',
                name: 'План',
                button: 'dark'
            },
            {
                type: 'all-orders',
                name: 'Выполненные заказы',
                button: 'dark'
            },
            {
                type: 'salary/period-salary',
                name: 'Зарплата',
                button: 'dark'
            }
        ],
        filterSalary: [
            {
                type: 'period-salary',
                name: 'Текущий период',
                button: 'info'
            },
            {
                type: 'all-transaction',
                name: 'Выплаченно',
                button: 'success'
            },
        ],
    }

    render() {
        const {pages, filterSalary} = this.state
        const {activePage, journalID, filters, activeFilter, onChangeFilter, activeSalary, children, title, square, changeOpenFilter, openFilter} = this.props

        return (
            <>
                <Row className='bg-white py-2 border border-end-0 border-start-0 border-top-0 align-items-center' style={{zIndex: 5}}>
                    <Col lg={4}>
                        {pages.map((page, i) => {
                            return (
                                <Link href={`/journal/${journalID}/${page.type}`} key={i}>
                                    <a className={`btn btn btn-outline-${page.button} me-3 shadow ${page.type.includes(activePage) ? 'active' : null}`}>
                                        {page.name}
                                    </a>
                                </Link>
                            )
                        })}
                    </Col>
                    <Col lg={3}>
                        <div className='text-uppercase fst-italic fw-bold text-center' style={{fontSize: '16px'}}>
                            {title}
                        </div>
                        {square ? (
                            <div
                                className='text-center m-0 p-0 fst-italic'
                                style={{fontSize: '12px'}}
                            >
                                (Общая площадь - <b>{square} м2</b>)
                            </div>
                        ) : null}
                    </Col>
                    <Col lg={5} className='text-end'>
                        {filters ? filters.map((filter, i) => {
                                return (
                                    <Button
                                        type='button'
                                        variant={`outline-${filter.button}`}
                                        className='me-3 shadow position-relative'
                                        active={activeFilter === filter.type}
                                        key={i}
                                        onClick={() => onChangeFilter(filter.type)}
                                    >
                                        {filter.name}

                                        {filter.number !== 0 ? (
                                            <span
                                                className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark`}
                                            >
                                                {filter.number}
                                            </span>
                                        ) : null}

                                    </Button>
                                )
                            })
                            : activeSalary ? filterSalary.map((salary, i) => {
                                return (
                                    <Link href={`/journal/${journalID}/salary/${salary.type}`} key={i}>
                                        <a
                                            className={`btn btn-outline-${salary.button} me-3 shadow ${activeSalary === salary.type ? 'active' : null}`}
                                        >
                                            {salary.name}
                                        </a>
                                    </Link>
                                )
                            }) : null
                        }
                    </Col>
                </Row>

                <Row>
                    {children}
                </Row>
            </>
        )
    }
}