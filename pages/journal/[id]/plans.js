import React, {Component} from "react";
import {Row, Col, Table, Modal, Form, InputGroup, Alert} from "react-bootstrap";
import Thead from "../../../modules/tables/thead";
import Tbody from "../../../modules/tables/tbody";
import {globalState} from "../../../data/globalState";
import {getOrderJournal} from "../../../services/journals/get";
import Loading from "../../../modules/loading";
import CustomError from "../../../modules/error";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../../modules/cookie";
import {MainLayout} from "../../../components/layout/main";
import JournalLayout from "../../../components/layout/journals";
import {postCommentJournal} from "../../../services/journals/post";

class PlansJournal extends Component {

    constructor(props) {
        super(props);
        this.commentInput = React.createRef();
    }

    state = {
        sectors: [],
        activeSector: '',
        numbersSectors: 0,
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
        changeComment: {
            view: false,
            id: null,
            name: null,
            dataId: null,
            userId: null,
            userName: null,
            data: [],
            comment: null
        },
        link: null,
        journalID: null,
        error: null,
        loading: true,
        noSearch: '',
        isOwner: false,
        updatePage: null
    }

    async componentDidMount() {
        this.setState({isOwner: JSON.parse(localStorage.getItem('user')).isOwner})

        if (!this.props.journal[0]) {
            this.setState({loading: false})
            this.setState({noSearch: 'Данные находятся за гранью доступного'})
        } else {
            this.setState({loading: false})
        }

        this.setState({link: this.props.router.asPath})
        this.setState({journalID: this.props.router.query.id})

        await this.addSectors(this.props.journal)
        await this.addOrderPlan(this.props.journal)

        this.setState({updatePage: setInterval(this.updateData, 300000)})
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.journal !== prevProps.journal) {
            if (!this.props.journal[0]) {
                this.setState({loading: false})
                this.setState({noSearch: 'Данные находятся за гранью доступного'})
            } else {
                this.setState({loading: false})
                this.setState({noSearch: ''})
            }
            this.setState({ordersPlan: null})
        }

        if (this.props !== prevProps) {
            this.setState({link: this.props.router.asPath})
            this.setState({journalID: this.props.router.query.id})
            this.setState({activeFilter: 'all'})
            await this.addSectors(this.props.journal)
            await this.addOrderPlan(this.props.journal)
        }

        if (this.state.activeSector !== prevState.activeSector) {
            await this.addOrderPlan(this.props.journal)
        }

        if (this.state.ordersPlan !== prevState.ordersPlan) {
            this.renderHeader()
            this.filterOrder()
        }

        if (this.state.activeFilter !== prevState.activeFilter) {
            this.filterOrder()
        }

        if (this.state.changeComment.view) this.commentInput.current.focus()
    }

    componentWillUnmount() {
        clearInterval(this.state.updatePage)
    }

    updateData = async () => {
        const {token} = this.props
        const id = this.state.journalID

        let journal, error

        await getOrderJournal(id, token)
            .then(res  => journal = res.data.journal)
            .catch(err => error = err.response?.data)

        if (journal) {
            await this.addSectors(journal)
            await this.addOrderPlan(journal)
        }

        if (error) {
            console.log(error)
        }
    }

    addSectors = (journal) => {
        let sectors = []

        journal.map(sector => {
            sectors.push(sector.name)
        })

        if (sectors.length > 1) {
            sectors.push('Все участки')
        }

        this.setState({numbersSectors: journal.length})
        this.setState({sectors})
        this.setState({activeSector: sectors[0]})
    }

    addOrderPlan = (journal) => {
        const {activeSector} = this.state

        journal.map(sector => {
            if (activeSector === sector.name) {
                this.setState({ordersPlan: sector})
            }
        })
    }

    changeComment = (item) => {
        const userName = JSON.parse(localStorage.getItem('user')).userName,
            {userId} = this.props

        let viewComment = {
            userId: userId,
            userName: userName,
            text: '',
            dataId: 0
        }

        item.data.comments.map(obj => {
            if (+obj.userId === +userId) {
                viewComment.userId = obj.userId
                viewComment.userName = obj.userName
                viewComment.text = obj.text
                viewComment.dataId = obj.id
            }
        })

        this.setState(({changeComment}) => {
            return (
                changeComment.view = true,
                    changeComment.id = item.id,
                    changeComment.name = item.itmOrderNum,
                    changeComment.data = item.data.comments,
                    changeComment.userId = viewComment.userId,
                    changeComment.userName = viewComment.userName,
                    changeComment.dataId = viewComment.dataId,
                    changeComment.comment = viewComment.text
            )
        })
    }

    selectComment = (value) => {
        const {changeComment} = this.state
        const userName = JSON.parse(localStorage.getItem('user')).userName
        let search

        changeComment.data.map((comment, i) => {
            if (+value === +comment.userId) {
                return search = comment
            } else {
                return false
            }
        })

        if (search) {
            this.setState(({changeComment}) => {
                return (
                    changeComment.userId = search.userId,
                    changeComment.userName = search.userName,
                    changeComment.dataId = search.id,
                    changeComment.comment = search.text
                )
            })
        } else {
            this.setState(({changeComment}) => {
                return (
                    changeComment.userId = this.props.userId,
                    changeComment.userName = userName,
                    changeComment.dataId = 0,
                    changeComment.comment = ''
                )
            })
        }
    }

    filterOrder = (filter = 'all') => {
        const {ordersPlan, activeFilter} = this.state

        let overdue = [],
            today = [],
            future = []

        const addEditButton = (obj, arr) => {
            obj.map(item => {
                item.data.edit = <i
                    className='bi bi-pencil-square btn text-primary p-0'
                    style={{fontSize: 20}}
                    onClick={() => this.changeComment(item)}
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

    changeFilter = (value) => {
        this.setState({activeFilter: value})
    }

    submitComment = async (comment) => {
        const {token} = this.props
        let data = {}

        data.orderId = comment.id
        data.dataId = comment.dataId
        data.text = comment.comment

        await postCommentJournal(data, token)
            .then(res => {
                if (res.status === 201 || res.status === 200) {
                    this.getPlans()
                }
            })
            .catch(err => console.log(err.response?.data))
    }

    getPlans = async () => {
        const {journalID} = this.state
        const {token} = this.props
        let journal, error

        await getOrderJournal(journalID)
            .then(res  => journal = res.data.journal)
            .catch(err => console.log(err.response?.data))

        await this.addSectors(journal)
        await this.addOrderPlan(journal)

    }

    renderOption = () => {
        const {changeComment} = this.state
        const user = {
            userId: this.props.userId,
            userName: JSON.parse(localStorage.getItem('user')).userName,
        }
        let option = [], count = 0

        changeComment.data.map(comment => {
            if (+comment.userId === +user.userId) count = 1
        })

        changeComment.data.map(comment => {
            if (comment.userId !== user.userId && !count) {
                option.push(<option value={user.userId} key={user.userId}>{user.userName}</option>)
                count = 1
            }
        })

        changeComment.data.map(comment => {
            option.push(<option value={comment.userId} key={comment.id}>{comment.userName}</option>)
        })

        return option
    }

    render() {
        const {journalID, filters, activeFilter, headerTable, overdueOrders, todayOrders, futureOrders,
            changeComment, paramsTable, error, link, sectors, activeSector, numbersSectors} = this.state

        return (
            <MainLayout title={`Планы журнала`} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={journalID}
                    activePage={'plans'}
                    activeFilter={activeFilter}
                    filters={filters}
                    onChangeFilter={this.changeFilter}
                >
                    {numbersSectors <= 1 ? null : (
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
                    )}

                    {this.state.loading ? (
                        <Loading/>
                    ) : this.state.noSearch ? (
                        <Col className='text-muted text-center'>{this.state.noSearch}</Col>
                    ) : (
                        <Row>
                            <Col lg={12} className='text-muted text-end mb-3'>
                                Участок - {activeSector}
                            </Col>

                            <Col style={{height: '75vh', overflow: "auto"}}>
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
                    )}

                    <Modal show={changeComment.view}
                           onHide={() => this.setState(({changeComment}) => changeComment.view = false)}
                           centered
                    >
                        <Modal.Header className='text-center d-block bg-dark text-white text-uppercase'>
                            Введите комментарий к заказу
                            <br/>
                            <b>{changeComment.name}</b>
                        </Modal.Header>
                        <Modal.Body className='my-4'>
                            <Alert variant='light' className='m-0 mb-1 p-0 text-center'>
                                Пользователь
                            </Alert>
                            <Form.Select
                                size="sm"
                                className='mb-3'
                                value={changeComment.userId}
                                disabled={!this.state.isOwner}
                                onChange={e => this.selectComment(e.target.value)}
                            >
                                {changeComment.data[0] ?
                                    this.renderOption() :
                                    <option value={changeComment.userId} >{changeComment.userName}</option>
                                }
                            </Form.Select>

                            <Alert variant='light' className='m-0 mb-1 p-0 text-center'>
                                Комментарий
                            </Alert>
                            <Form.Control
                                type="text"
                                size='sm'
                                ref={this.commentInput}
                                autoFocus
                                value={changeComment.comment}
                                className='border rounded-0 text-center'
                                onChange={e => this.setState(({changeComment}) => changeComment.comment = e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        this.setState(({changeComment}) => changeComment.view = false)
                                        this.submitComment(changeComment)
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
