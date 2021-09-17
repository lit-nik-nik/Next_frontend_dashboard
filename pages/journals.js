import { Component } from "react";
import {Row, Col, Table, Button} from "react-bootstrap";
import Thead from "../modules/tables/thead";
import Tbody from "../modules/tables/tbody";
import { MainLyout } from "../components/layout/main";
import Router, {withRouter} from "next/router";
import ModalError from "../modules/modals/modal-error";
import {getJournals, getOrderJournal} from "../services/journals/get";
import {globalState} from "../data/globalState";

class PageJournals extends Component {

    state = {
        listJournals: [],
        orderList: null,
        disabledFilter: true,
        filter: [
            {
                type: 'all',
                name: 'Все',
                button: 'info'
            },
            {
                type: 'overdue',
                name: 'Просроченные',
                button: 'danger'
            },
            {
                type: 'forToday',
                name: 'Текущие заказы',
                button: 'primary'
            },
            {
                type: 'forFuture',
                name: 'Будущие заказы',
                button: 'success'
            }
        ],
        headerTable: [],
        paramsTable: [],
        overdueOrders: [],
        todayOrders: [],
        futureOrders: [],
        token: null,
        link: this.props.router.asPath,
        error: {
            view: false,
            message: ''
        }
    }

    async componentDidMount() {
        if (localStorage.getItem('token')) await this.setState({token: localStorage.getItem('token')})
        else this.routeAuth()

        this.getListJournals()
    }

    routeAuth = () => Router.push('/auth')

    getListJournals = async () => {
        const {token} = this.state

        await getJournals(token)
            .then(res => this.setState({listJournals: res.data.journals}))
            .catch(err => {
                this.setState(({error}) => {
                    return (
                        error.view = true,
                        error.message = err.response.data.message
                    )
                })

                localStorage.removeItem('token')
                localStorage.removeItem('userId')

                setTimeout(this.routeAuth, 2000)
            })
    }

    getOrderJournal = async (id) => {
        const {token} = this.state

        await getOrderJournal(id, token)
            .then(res => this.setState({orderList: res.data.journal}))
            .catch(err => {
                this.setState(({error}) => {
                    return (
                        error.view = true,
                        error.message = err.response.data.message
                    )
                })
            })
    }

    filterOrder = (type) => {
        const {orderList} = this.state

        if (type === 'all') {
            this.setState({overdueOrders: orderList.overdue})
            this.setState({todayOrders: orderList.forToday})
            this.setState({futureOrders: orderList.forFuture})
        } else if (type === 'overdue') {
            this.setState({overdueOrders: orderList[type]})
            this.setState({todayOrders: []})
            this.setState({futureOrders: []})
        } else if (type === 'forToday') {
            this.setState({overdueOrders: []})
            this.setState({todayOrders: orderList[type]})
            this.setState({futureOrders: []})
        } else if (type === 'forFuture') {
            this.setState({overdueOrders: []})
            this.setState({todayOrders: []})
            this.setState({futureOrders: orderList[type]})
        }
    }

    renderHeader = () => {
        const {orderList} = this.state,
            {headersTables} = globalState
        let header = [],
            params = []

        if (orderList.overdue) {
            for (let key in orderList.overdue[0]) {
                headersTables.map(item => {
                    if(item.label === key) {
                        params.push(key)
                        header.push(item.name)
                    }
                })
            }
        }

        this.setState({headerTable: header})
        this.setState({paramsTable: params})
    }

    render() {
        const {link, listJournals, error, overdueOrders, todayOrders, futureOrders, filter, disabledFilter, headerTable, paramsTable} = this.state

        const list = listJournals.map(item => {
            return (
                <Button
                    variant='outline-dark'
                    type='button'
                    className='me-3'
                    key={item.id}
                    onClick={async () => {
                        await this.getOrderJournal(item.id)
                        if (this.state.orderList) {
                            this.setState({disabledFilter: false})
                            this.renderHeader()
                            this.filterOrder('all')
                        }
                    }}
                >
                    {item.name}
                </Button>)
        })

        const filterButton = filter.map((item, i) => {
            return (
                <Button
                    type='button'
                    variant={`outline-${item.button}`}
                    className='me-3'
                    key={i}
                    disabled={disabledFilter}
                    onClick={() => this.filterOrder(item.type)}
                >
                    {item.name}
                </Button>
            )
        })

        return (
            <MainLyout title={'Журналы'} link={link}>
                <Row>
                    <Col className='text-start mb-3'>
                        {list}
                    </Col>
                    <Col className='text-end mb-3'>
                        {filterButton}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Table hover bordered variant={'dark'}>
                            <Thead title={headerTable}/>

                            {overdueOrders ?
                                <Tbody orders={overdueOrders} params={paramsTable} color={'table-danger'}/>
                                : null }

                            {todayOrders ?
                                <Tbody orders={todayOrders} params={paramsTable} color={'table-primary'}/>
                                : null }

                            {futureOrders ?
                                <Tbody orders={futureOrders} params={paramsTable} color={'table-success'}/>
                                : null }
                        </Table>
                    </Col>
                </Row>

                <ModalError
                    show={error.view}
                    onHide={()=> this.setState(({error}) => error.view = false)}
                    error={error.message}
                />
            </MainLyout>
        );
    }
}

export default withRouter(PageJournals)