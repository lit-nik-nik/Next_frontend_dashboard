import React, {Component} from "react";
import {Col, Button, Row} from "react-bootstrap";
import Link from "next/link";

export default class JournalLayout extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        pages: [
            {
                type: 'plans',
                name: 'Планы',
                button: 'dark'
            },
            {
                type: 'all-orders',
                name: 'Переданные заказы',
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
        const {activePage, journalID, filters, activeFilter, onChangeFilter, activeSalary, children} = this.props

        return (
            <>
                <Row className='sticky-top bg-white py-2 shadow mb-3' style={{top: '60px', zIndex: 1}}>
                    <Col>
                        {pages.map((page, i) => {
                            return (
                                <Link href={`/journal/${journalID}/${page.type}`} key={i}>
                                    <a className={`btn btn btn-outline-${page.button} me-3 ${page.type.includes(activePage) ? 'active' : null}`}>
                                        {page.name}
                                    </a>
                                </Link>
                            )
                        })}
                    </Col>
                    <Col className='text-end'>
                        {filters ? filters.map((filter, i) => {
                                return (
                                    <Button
                                        type='button'
                                        variant={`outline-${filter.button}`}
                                        className='me-3'
                                        active={activeFilter === filter.type}
                                        key={i}
                                        onClick={() => onChangeFilter(filter.type)}
                                    >
                                        {filter.name}
                                    </Button>
                                )
                            })
                            : activeSalary ? filterSalary.map((salary, i) => {
                                return (
                                    <Link href={`/journal/${journalID}/salary/${salary.type}`} key={i}>
                                        <a
                                            className={`btn btn-outline-${salary.button} me-3 ${activeSalary === salary.type ? 'active' : null}`}
                                        >
                                            {salary.name}
                                        </a>
                                    </Link>
                                )
                            })
                                : null
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