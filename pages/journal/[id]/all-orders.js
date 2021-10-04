import React, {Component} from "react";
import {getAdoptedOrderJournal} from "../../../services/journals/get";
import {globalState} from "../../../data/globalState";
import Thead from "../../../modules/tables/thead";
import Tbody from "../../../modules/tables/tbody";
import {Table, Row, Col, Alert, InputGroup, FormControl, Button} from "react-bootstrap";
import PaginationTable from "../../../modules/pagination";
import Loading from "../../../modules/loading";
import CustomError from "../../../modules/error";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../../modules/cookie";
import {MainLayout} from "../../../components/layout/main";
import JournalLayout from "../../../components/layout/journals";

class AllOrdersJournal extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        title: 'Выполненные заказы',
        filters: [],
        allOrders: [],
        counts: null,
        pages: null,
        filter: {
            search: '',
            startDate: '',
            endDate: '',
            limit: 100
        },
        activeFilter: false,
        activePage: 1,
        limit: 100,
        headerTable: [],
        paramsTable: [],
        error: null,
        link: null
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        await this.addData()
        this.renderHeader()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.state.activePage !== prevState.activePage
        ) {
            await this.changeData()
        }
    }

    addData = () => {
        const {data} = this.props

        if (data) {
            this.setState({allOrders: data.orders})
            this.setState({counts: data.count})
            this.setState({pages: data.pages})
        }
    }

    changeData = async () => {
        const {token, id} = this.props
        const {activePage, filter} = this.state
        const {startDate, endDate, search, limit} = filter

        let data, error, sDate = '', eDate = ''

        if (startDate) sDate = new Date(startDate).toLocaleString().slice(0,10)
        if (endDate) eDate = new Date(endDate).toLocaleString().slice(0,10)


        await getAdoptedOrderJournal(id, token, activePage, limit, sDate, eDate, search)
            .then(res => data = res.data)
            .catch(err => error = err.response?.data)

        if (data) {
            this.setState({allOrders: data.orders})
            this.setState({counts: data.count})
            this.setState({pages: data.pages})
        }
        else if (error) {
            this.setState({error})
        }
    }

    renderHeader = () => {
        const {allOrders} = this.state,
            {headersTables} = globalState
        let header = [],
            params = []

        if (allOrders) {
            for (let key in allOrders[0]) {
                headersTables.map(item => {
                    item.label.map(label => {
                        if(label === key) {
                            params.push(key)

                            header.push(item.name)
                        }
                    })
                })
            }
        }

        this.setState({headerTable: header})
        this.setState({paramsTable: params})
    }

    changeActivePage = (page) => {
        this.setState({activePage: page})
        this.setState({allOrders: []})
    }

    render() {
        const {headerTable, paramsTable, allOrders, activePage, pages, error, link, title, filter, activeFilter} = this.state

        return (
            <MainLayout title={title} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={this.props.id}
                    activePage={'all-orders'}
                >
                    <Row>
                        <Col className='mb-3 text-center text-uppercase fw-bold'>
                            <h3>{title}</h3>
                        </Col>
                    </Row>

                    <hr/>

                    <Row className='mb-3'>
                        <Col lg={12} className='text-center fw-bold h4 text-uppercase'>
                            <Button
                                type='button'
                                variant='outline-dark'
                                className='me-3'
                                active={activeFilter}
                                onClick={() => this.setState({activeFilter: !this.state.activeFilter})}
                            >
                                {activeFilter ? 'Скрыть фильтры' : 'Открыть фильтры'}
                            </Button>
                        </Col>

                        {activeFilter
                            ? (
                            <>
                                <Col lg={12}>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Произвольный поиск</InputGroup.Text>
                                        <FormControl
                                            placeholder="Произвольный поиск"
                                            value={filter.search}
                                            onChange={(e) => this.setState(({filter}) => {
                                                return filter.search = e.target.value
                                            })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    this.setState({activePage: 1})
                                                    this.changeData()
                                                }
                                            }}
                                        />
                                    </InputGroup>
                                </Col>

                                <Col lg={4}>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Кол-во заказов на странице</InputGroup.Text>
                                        <FormControl
                                            placeholder="Заказы"
                                            value={filter.limit}
                                            onChange={(e) => this.setState(({filter}) => {
                                                return filter.limit = e.target.value
                                            })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') this.changeData()
                                            }}
                                        />
                                    </InputGroup>
                                </Col>

                                <Col lg={4}>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Дата начала</InputGroup.Text>
                                        <FormControl
                                            placeholder="Дата начала"
                                            type='date'
                                            value={filter.startDate}
                                            onChange={(e) => this.setState(({filter}) => {
                                                return filter.startDate = e.target.value
                                            })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') this.changeData()
                                            }}
                                        />
                                    </InputGroup>
                                </Col>

                                <Col lg={4}>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Дата окончания</InputGroup.Text>
                                        <FormControl
                                            placeholder="Дата окончания"
                                            type='date'
                                            value={filter.endDate}
                                            onChange={(e) => this.setState(({filter}) => {
                                                return filter.endDate = e.target.value
                                            })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') this.changeData()
                                            }}
                                        />
                                    </InputGroup>
                                </Col>
                            </>
                            )
                            : null
                        }
                    </Row>

                    <hr/>

                    <Row>
                        <Col>
                            <PaginationTable activePage={+activePage} lastPage={pages} onClick={this.changeActivePage}/>
                        </Col>
                        <Col>
                            {allOrders[0] ? null : <Loading/>}
                        </Col>
                        <Col className='text-end'>
                            <Alert variant='light p-2'>
                                Всего заказов - {this.state.counts} на {this.state.pages} страниц
                            </Alert>
                        </Col>
                    </Row>

                    <Table hover bordered variant={'dark'}>
                        <Thead title={headerTable}/>
                        <Tbody orders={allOrders} params={paramsTable} color={'table-light'}/>
                    </Table>

                    <CustomError error={error} />
                </JournalLayout>
            </MainLayout>
        )
    }

}

export default withRouter(AllOrdersJournal)

export async function getServerSideProps({req,query}) {

    const token = getTokenCookies(req.headers.cookie)
    const id = query.id

    let data, error

    await getAdoptedOrderJournal(id, token)
        .then(res  => data = res.data)
        .catch(err => error = err.response?.data)


    if (data) {
        return {
            props: {
                data,
                id
            }
        }
    } else if (error) {
        return {
            props: {
                error
            }
        }
    } else {
        return {
            props: {}
        }
    }
}