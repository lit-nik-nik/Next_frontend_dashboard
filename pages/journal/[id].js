import { Component } from "react";
import {Row, Col, Table, Button} from "react-bootstrap";
import Thead from "../../modules/tables/thead";
import Tbody from "../../modules/tables/tbody";
import { MainLyout } from "../../components/layout/main";
import Router, {withRouter} from "next/router";
import ModalError from "../../modules/modals/modal-error";
import {getJournals, getOrderJournal} from "../../services/journals/get";
import {globalState} from "../../data/globalState";
import {getOrders} from "../../services/orders/get";
import exitApp from "../../modules/exit";
import {getUsers} from "../../services/auth/get";
import {getTokenCookies} from "../../modules/cookie";

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
        if (this.props.token) await this.setState({token: this.props.token})
        else exitApp()

        await this.setState({orderList: this.props.data})

        // await this.getOrderJournal(this.props.router.query.id)

        if (this.state.orderList) {
            this.setState({disabledFilter: false})
            this.renderHeader()
            this.filterOrder('all')
        }
    }

    componentWillUnmount() {

    }

    // getOrderJournal = async (id) => {
    //     const {token} = this.state
    //
    //     await getOrderJournal(id, token)
    //         .then(res => this.setState({orderList: res.data.journal}))
    //         .catch(err => {
    //             this.setState(({error}) => {
    //                 return (
    //                     error.view = true,
    //                     error.message = err.response.data.message
    //                 )
    //             })
    //
    //             if (err.response.data.errors) {
    //                 if (
    //                     err.response.data.errors[0] === 'jwt expired' ||
    //                     err.response.data.errors[0] === 'jwt must be provided' ||
    //                     err.response.data.errors[0] === 'jwt malformed'
    //                 ) exitApp()
    //             }
    //         })
    // }

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
        const {link, error, orderList, overdueOrders, todayOrders, futureOrders, filter, disabledFilter, headerTable, paramsTable} = this.state

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
            <MainLyout title={'Журналы'} link={link} token={this.props.token}>
                <Row>
                    <Col className='text-end mb-3'>
                        {filterButton}
                    </Col>
                </Row>

                {orderList ? (
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
                ) : (
                    <Row>
                        <Col>
                            <p className='text-muted text-center'>Загрузка данных. Ожидайте...</p>
                        </Col>
                    </Row>
                )}



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

export async function getServerSideProps({req, query}) {

    const token = getTokenCookies(req.headers.cookie)
    const id = query.id

    let data, error

    await getOrderJournal(id, token)
        .then(res => data = res.data.journal)
        .catch(err => error = JSON.stringify(err))

    if (data) {
        return {
            props: {
                data
            }
        }
    } else if (error) {
        return {
            props: {
                error
            }
        }
    }
}