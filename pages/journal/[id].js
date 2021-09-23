import React, { Component } from "react";
import {Row, Col, Table, Button, Modal, Form} from "react-bootstrap";
import Thead from "../../modules/tables/thead";
import Tbody from "../../modules/tables/tbody";
import { MainLayout } from "../../components/layout/main";
import {withRouter} from "next/router";
import {getOrderJournal} from "../../services/journals/get";
import {globalState} from "../../data/globalState";
import {getTokenCookies} from "../../modules/cookie";

class PageJournals extends Component {

    constructor(props) {
        super(props);
        this.commentInput = React.createRef();
    }

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
        changeOrder: {
            view: false,
            id: null,
            name: null,
            comment: ''
        },
        filterOrder: 'all',
        link: null
    }

    async componentDidMount() {
        await this.setState({orderList: this.props.data})

        this.setState({link: this.props.router.asPath})

        if (this.state.orderList) {
            this.setState({disabledFilter: false})
            this.renderHeader()
            this.filterOrder()
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.changeOrder.view) this.commentInput.current.focus()

        if (this.props !== prevProps) {
            this.setState({link: this.props.router.asPath})

            if (this.props.data) {
                await this.setState({orderList: this.props.data})
                this.setState({disabledFilter: false})
                this.renderHeader()
                this.filterOrder()
            }

            if (this.props.error) {
                await this.setState({orderList: null})
                this.setState({disabledFilter: true})
            }
        }
    }

    componentWillUnmount() {

    }

    filterOrder = () => {
        const {orderList, filterOrder} = this.state
        let overdue = [],
            today = [],
            future = []

        const onComment = (item) => {
            this.setState(({changeOrder}) => {
                return (
                    changeOrder.view = true,
                    changeOrder.id = item.ID,
                    changeOrder.name = item.ORDER_NAME,
                    changeOrder.comment = item.COMMENT_PLAN ? item.COMMENT_PLAN : ''
                )
            })
        }

        const addEditButton = (obj, arr) => {
            obj.map(item => {
                item.EDIT = <i
                    className='bi bi-pencil-square btn text-primary'
                    style={{fontSize: 20}}
                    onClick={() => onComment(item)}
                />
                arr.push(item)
            })
        }

        if (orderList) {
            addEditButton(orderList.overdue, overdue)
            addEditButton(orderList.forToday, today)
            addEditButton(orderList.forFuture, future)
        }

        if (filterOrder === 'all') {
            this.setState({overdueOrders: overdue})
            this.setState({todayOrders: today})
            this.setState({futureOrders: future})
        } else if (filterOrder === 'overdue') {
            this.setState({overdueOrders: overdue})
            this.setState({todayOrders: []})
            this.setState({futureOrders: []})
        } else if (filterOrder === 'forToday') {
            this.setState({overdueOrders: []})
            this.setState({todayOrders: today})
            this.setState({futureOrders: []})
        } else if (filterOrder === 'forFuture') {
            this.setState({overdueOrders: []})
            this.setState({todayOrders: []})
            this.setState({futureOrders: future})
        }
    }

    onChangeComment =  async (item) => {
        const {orderList} = this.state
        let obj, index

        for (let key in orderList) {
            orderList[key].map((order, i) => {
                if (order.ID === item.id) {
                    obj = key
                    index = i
                }
            })
        }

        this.setState(({orderList}) => orderList[obj][index].COMMENT_PLAN = item.comment)

        this.filterOrder()
    }

    renderHeader = () => {
        const {orderList} = this.state,
            {headersTables} = globalState
        let header = [],
            params = []

        if (orderList) {
            for (let key in orderList.overdue[0]) {
                headersTables.map(item => {
                    if(item.label === key) {
                        if (key === 'COMMENT_PLAN') {
                            params.push([key, 'EDIT'])
                        } else {
                            params.push(key)
                        }
                        header.push(item.name)
                    }
                })
            }
        }

        this.setState({headerTable: header})
        this.setState({paramsTable: params})
    }

    render() {
        const {link, orderList, overdueOrders, todayOrders, futureOrders, filter, filterOrder, disabledFilter, headerTable, paramsTable, changeOrder} = this.state

        const filterButton = filter.map((item, i) => {
            return (
                <Button
                    type='button'
                    variant={`outline-${item.button}`}
                    className='me-3'
                    active={filterOrder === item.type}
                    key={i}
                    disabled={disabledFilter}
                    onClick={async () => {
                        await this.setState({filterOrder: item.type})
                        this.filterOrder()
                    }}
                >
                    {item.name}
                </Button>
            )
        })

        return (
            <MainLayout title={'Журналы'} link={link} token={this.props.token} error={this.props.error}>
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

                <Modal show={changeOrder.view} onHide={() => this.setState(({changeOrder}) => changeOrder.view = false) } centered>
                    <Modal.Header className='text-center d-block bg-dark text-white text-uppercase'>
                        Введите комментарий к заказу
                        <br/>
                        <b>{changeOrder.name}</b>
                    </Modal.Header>
                    <Modal.Body className='my-4'>
                        <Form.Control
                            type="text"
                            ref={this.commentInput}
                            autoFocus
                            value={changeOrder.comment}
                            className='border rounded-0 text-center'
                            onChange={e => this.setState(({changeOrder}) => changeOrder.comment = e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    this.setState(({changeOrder}) => changeOrder.view = false)
                                    this.onChangeComment(changeOrder)
                                }
                            }}
                        />
                    </Modal.Body>
                </Modal>
            </MainLayout>
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
        .catch(err => error = err.response.data)

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