import React, {Component} from "react";
import {Row, Col, Table, Modal, Form, Button, InputGroup} from "react-bootstrap";
import Thead from "../../../modules/tables/thead";
import Tbody from "../../../modules/tables/tbody";
import {globalState} from "../../../data/globalState";
import {getOrderJournal} from "../../../services/journals/get";
import Loading from "../../../modules/loading";
import CustomError from "../../../modules/error";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../../modules/cookie";
import {getWeekSalary} from "../../../services/journals/get";
import {MainLayout} from "../../../components/layout/main";
import JournalLayout from "../../../components/layout/journals";

class PlansJournal extends Component {

    constructor(props) {
        super(props);
        this.commentInput = React.createRef();
    }

    state = {
        sectors: [],
        activeSector: '',
        ordersPlan: [],
        headerTable: [],
        paramsTable: [],
        overdueOrders: [],
        todayOrders: [],
        futureOrders: [],
        filters: [
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
        activeFilter: 'all',
        changeOrder: {
            view: false,
            id: null,
            name: null,
            comment: ''
        },
        link: null,
        journalID: null,
        error: null
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        this.setState({journalID: this.props.router.query.id})
        await this.addSectors()
        await this.addOrderPlan()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({link: this.props.router.asPath})
            this.setState({journalID: this.props.router.query.id})
            this.setState({activeFilter: 'all'})
            await this.addSectors()
            await this.addOrderPlan()
        }

        if (this.state.activeSector !== prevState.activeSector) {
            await this.addOrderPlan()
        }

        if (this.state.ordersPlan !== prevState.ordersPlan) {
            this.renderHeader()
            this.filterOrder()
        }

        if (this.state.activeFilter !== prevState.activeFilter) {
            this.filterOrder()
        }

        if (this.state.changeOrder.view) this.commentInput.current.focus()
    }

    addSectors = () => {
        const {journal} = this.props
        let sectors = []

        journal.map(sector => {
            sectors.push(sector.name)
        })

        this.setState({sectors})
        this.setState({activeSector: sectors[0]})
    }

    addOrderPlan = () => {
        const {journal} = this.props
        const {activeSector} = this.state

        journal.map(sector => {
            if (activeSector === sector.name) {
                this.setState({ordersPlan: sector})
            }
        })
    }

    filterOrder = (filter = 'all') => {
        const {ordersPlan, activeFilter} = this.state

        let overdue = [],
            today = [],
            future = []

        const onComment = (item) => {
            let viewComment

            item.data.comments.map(obj => {
                viewComment = obj.text
            })

            this.setState(({changeOrder}) => {
                return (
                    changeOrder.view = true,
                    changeOrder.id = item.id,
                    changeOrder.name = item.itmOrderNum,
                    changeOrder.comment = viewComment ? viewComment : ''
                )
            })
        }

        const addEditButton = (obj, arr) => {
            obj.map(item => {
                item.data.edit = <i
                    className='bi bi-pencil-square btn text-primary p-0'
                    style={{fontSize: 20}}
                    onClick={() => onComment(item)}
                />
                arr.push(item)
            })
        }

        if (ordersPlan) {
            addEditButton(ordersPlan.overdue, overdue)
            addEditButton(ordersPlan.forToday, today)
            addEditButton(ordersPlan.forFuture, future)
        }

        if (activeFilter === 'all') {
            this.setState({overdueOrders: overdue})
            this.setState({todayOrders: today})
            this.setState({futureOrders: future})
        } else if (activeFilter === 'overdue') {
            this.setState({overdueOrders: overdue})
            this.setState({todayOrders: []})
            this.setState({futureOrders: []})
        } else if (activeFilter === 'forToday') {
            this.setState({overdueOrders: []})
            this.setState({todayOrders: today})
            this.setState({futureOrders: []})
        } else if (activeFilter === 'forFuture') {
            this.setState({overdueOrders: []})
            this.setState({todayOrders: []})
            this.setState({futureOrders: future})
        }
    }

    renderHeader = () => {
        const {ordersPlan} = this.state,
            {headersTables} = globalState
        let header = [],
            params = []

        if (ordersPlan) {
            for (let key in ordersPlan.overdue[0]) {
                headersTables.map(item => {
                    item.label.map(label => {
                        if (label === key) {
                            params.push(key)
                            header.push(item.name)
                        }
                    })
                })
                if (key === 'data') {
                    params.push('comments')
                    header.push('Комментарии')
                }
            }
        }

        this.setState({headerTable: header})
        this.setState({paramsTable: params})
    }

    onChangeComment = async (item) => {
        const {ordersPlan} = this.state
        let obj, index, commentObj

        for (let key in ordersPlan) {
            if (typeof(ordersPlan[key]) === 'object') {
                ordersPlan[key].map((order, i) => {
                    if (order.id === item.id) {
                        obj = key
                        index = i
                    }
                })
            }
        }

        commentObj = {
            id: '',
            sector: '',
            userId: this.props.userId,
            userName: 'Рома',
            text: item.comment
        }

        this.setState(({ordersPlan}) => ordersPlan[obj][index].data.comments = [...this.state.ordersPlan[obj][index].data.comments, commentObj])

        this.filterOrder()
    }

    changeFilter = (value) => {
        this.setState({activeFilter: value})
    }

    render() {
        const {ordersPlan, journalID, filters, activeFilter, headerTable, overdueOrders, todayOrders, futureOrders, changeOrder, paramsTable, error, link, sectors, activeSector} = this.state

        return (
            <MainLayout title={`Планы журнала`} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={journalID}
                    activePage={'plans'}
                    activeFilter={activeFilter}
                    filters={filters}
                    onChangeFilter={this.changeFilter}
                >

                    <Row>
                        <Col lg={4}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Выберите участок</InputGroup.Text>
                                <Form.Select
                                    value={activeSector}
                                    onChange={(e) => {
                                        this.setState({activeSector: e.target.value})
                                    }}>
                                    {sectors.map((sector, i) => {
                                        return (
                                            <option value={sector} key={i}>{sector}</option>
                                        )
                                    })}
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Table hover bordered variant={'dark'} size='sm'>
                                <Thead title={headerTable}/>

                                {overdueOrders ?
                                    <Tbody orders={overdueOrders} params={paramsTable} color={'table-danger'}/>
                                    : null}

                                {todayOrders ?
                                    <Tbody orders={todayOrders} params={paramsTable} color={'table-primary'}/>
                                    : null}

                                {futureOrders ?
                                    <Tbody orders={futureOrders} params={paramsTable} color={'table-success'}/>
                                    : null}
                            </Table>
                        </Col>
                    </Row>

                    <Modal show={changeOrder.view} onHide={() => this.setState(({changeOrder}) => changeOrder.view = false)}
                           centered>
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

                    <CustomError error={error}/>
                </JournalLayout>
            </MainLayout>
        )
    }
}

export default withRouter(PlansJournal)

export async function getServerSideProps({req,query}) {

    const token = getTokenCookies(req.headers.cookie)
    const id = query.id

    let journal, error

    await getOrderJournal(id, token)
        .then(res  => journal = res.data.journal)
        .catch(err => error = err.response?.data)


    if (journal) {
        return {
            props: {
                journal
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
