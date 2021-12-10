import React, {Component} from "react";
import {Row, FloatingLabel, Col, Table, Modal, Form, Alert, Button, FormControl} from "react-bootstrap";
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
import {MyInput, MySelect} from "../../../components/elements";

class PlansJournal extends Component {

    constructor(props) {
        super(props);
        this.commentInput = React.createRef();
    }

    state = {
        title: 'Планы журнала',
        sectors: [],
        activeSector: '',
        numbersSectors: 0,
        squareOrders: 0,
        ordersPlan: [],
        headerTable: [],
        paramsTable: [],
        activeOrders: {
            overdueOrders: [],
            todayOrders: [],
            futureOrders: [],
        },
        filters: [
            {
                type: 'all',
                name: `Все`,
                button: 'info',
                number: 0
            },
            {
                type: 'overdue',
                name: `Просроченные`,
                button: 'danger',
                number: 0
            },
            {
                type: 'forToday',
                name: 'Текущие',
                button: 'primary',
                number: 0
            },
            {
                type: 'forFuture',
                name: 'Будущие',
                button: 'success',
                number: 0
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
        loading: false,
        noSearch: '',
        isOwner: false,
        updatePage: null,
        search: '',
        test: 0
    }

    async componentDidMount() {
        this.setState({isOwner: JSON.parse(localStorage.getItem('user')).isOwner})

        if (!this.props.journal[0]) {
            this.setState({noSearch: 'Данные находятся за гранью доступного'})
        }

        this.setState({link: this.props.router.asPath})
        this.setState({journalID: this.props.router.query.id})

        await this.addSectors(this.props.journal)
        await this.addOrderPlan(this.props.journal)
        this.renderHeader()
        this.countOrders()
        this.countSquare()

        this.setState({updatePage: setInterval(this.getPlans, 300000)})
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.journal !== prevProps.journal) {
            if (!this.props.journal[0]) {
                this.setState({noSearch: 'Данные находятся за гранью доступного'})
            } else {
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

        if (this.state.activeFilter !== prevState.activeFilter) {
            this.countSquare()
        }

        if (this.state.ordersPlan !== prevState.ordersPlan) {
            await this.filterOrder()
            this.countOrders()
            this.countSquare()
        }

        if (this.state.search !== prevState.search) {
            await this.searchOrder()
            this.countOrders()
            this.countSquare()
        }

        if (this.state.changeComment.view) this.commentInput.current.focus()
    }

    componentWillUnmount() {
        clearInterval(this.state.updatePage)
    }

    // формирование секторов в плане
    addSectors = (journal) => {
        let sectors = []

        journal.map(sector => {
            sectors.push(sector.name)
        })

        this.setState({numbersSectors: journal.length})
        this.setState({sectors})
        this.setState({activeSector: sectors[0]})
    }

    // выбор заказов плана в соответствии с выбраным сектором
    addOrderPlan = (journal) => {
        const {activeSector} = this.state

        journal.map(sector => {
            if (activeSector === sector.name) {
                this.setState({ordersPlan: sector})
            }
        })
    }

    // изменение комментария к заказу
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

    // выбор комментария пользователя
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

    // формирование таблицы заказов
    filterOrder = async (filter = 'all') => {
        const {ordersPlan} = this.state

        let overdue = [], today = [], future = [],
            newActiveOrders = {
                overdueOrders: [],
                todayOrders: [],
                futureOrders: [],
            }

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

        newActiveOrders.overdueOrders = overdue
        newActiveOrders.todayOrders = today
        newActiveOrders.futureOrders = future

        this.setState({activeOrders: newActiveOrders})

        this.setState({loading: false})
    }

    // создание заголовка таблицы
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

    // изменение фильтра заказов
    changeFilter = (value) => {
        this.setState({activeFilter: value})
    }

    // отправка комментария в базу
    submitComment = async (comment) => {
        const {token} = this.props
        let data = {}, error

        data.orderId = comment.id
        data.dataId = comment.dataId
        data.text = comment.comment

        await postCommentJournal(data, token)
            .then(res => {
                if (res.status === 201 || res.status === 200) {
                    this.getPlans()
                }
            })
            .catch(err => {
                error = err.response?.data
            })

        if (error) {
            await this.setState({error})
        }
    }

    // получение плана с сервера
    getPlans = async () => {
        const {journalID} = this.state
        const {token} = this.props
        let journal, error

        await getOrderJournal(journalID, token)
            .then(res  => journal = res.data.journal)
            .catch(err => error = err.response?.data)

        if(journal) {
            await this.addSectors(journal)
            await this.addOrderPlan(journal)
        }

        if(error) {
            this.setState({error})
        }
    }

    // формирования выбора пользователя и комментария
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

    // поиск заказов
    searchOrder = () => {
        const {search, ordersPlan} = this.state
        let overdue = [], today = [], future = [],
            newActiveOrders = {
                overdueOrders: [],
                todayOrders: [],
                futureOrders: [],
            }

        const ordersMap = (obj, newObj) => {
            obj.map(order => {
                const itmOrder = order.itmOrderNum.toUpperCase(),
                    upperSearch = search.toUpperCase()

                if (itmOrder.includes(upperSearch)) newObj.push(order)
            })
        }

        if (search) {
            ordersMap(ordersPlan.overdue, overdue)
            ordersMap(ordersPlan.forToday, today)
            ordersMap(ordersPlan.forFuture, future)

            newActiveOrders.overdueOrders = overdue
            newActiveOrders.todayOrders = today
            newActiveOrders.futureOrders = future

            this.setState({activeOrders: newActiveOrders})
        } else {
            newActiveOrders.overdueOrders = ordersPlan.overdue
            newActiveOrders.todayOrders = ordersPlan.forToday
            newActiveOrders.futureOrders = ordersPlan.forFuture

            this.setState({activeOrders: newActiveOrders})
        }
    }

    // подсчет кол-ва заказов
    countOrders = () => {
        const {filters, activeOrders} = this.state
        let overdueCounts = activeOrders.overdueOrders.length,
            todayCounts = activeOrders.todayOrders.length,
            futureCounts = activeOrders.futureOrders.length,
            allCounts = overdueCounts + todayCounts + futureCounts,
            newFilters = [...filters]

        newFilters.map((filter, i) => {
            if (filter.type === 'all') filter.number = allCounts
            if (filter.type === 'overdue') filter.number = overdueCounts
            if (filter.type === 'forToday') filter.number = todayCounts
            if (filter.type === 'forFuture') filter.number = futureCounts
        })

        this.setState({filters: newFilters})
    }

    // подсчет площади заказов
    countSquare = async () => {
        const {activeFilter, activeOrders} = this.state
        let overdueSquare,
            todaySquare,
            futureSquare,
            allSquare

        const count = (arr) => {
            let count = 0

            arr.map(order => count += order.generalSquare)

            count = Math.round(count * 100) / 100

            return count
        }

        overdueSquare = count(activeOrders.overdueOrders)
        futureSquare = count(activeOrders.futureOrders)
        todaySquare = count(activeOrders.todayOrders)

        allSquare = overdueSquare + todaySquare + futureSquare

        allSquare = Math.round(allSquare * 100) / 100

        if (activeFilter === 'all') await this.setState({squareOrders: allSquare})
        else if (activeFilter === 'overdue') await this.setState({squareOrders: overdueSquare})
        else if (activeFilter === 'forToday') await this.setState({squareOrders: todaySquare})
        else if (activeFilter === 'forFuture') await this.setState({squareOrders: futureSquare})
    }

    render() {
        const {journalID, filters, activeFilter, headerTable, activeOrders,
            changeComment, paramsTable, error, link, sectors, activeSector,
            numbersSectors, title, squareOrders, loading} = this.state

        let optionSector = []

        sectors.map((sector, i) => {
            return (
                optionSector.push(<option value={sector} key={i}>{sector}</option>)
            )
        })

        return (
            <MainLayout title={title} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={journalID}
                    activePage={'plans'}
                    activeFilter={activeFilter}
                    filters={filters}
                    onChangeFilter={this.changeFilter}
                >

                    <Row className='mb-3 align-items-end'>
                        <Col lg={4} className=''>
                            <MyInput
                                name='Поиск по наименованию'
                                type='text'
                                value={this.state.search}
                                onChange={e => this.setState({search: e.target.value})}
                            />

                            {this.state.search ? (
                                <Button
                                    className='border-0 inline-input'
                                    variant='outline-danger'
                                    onClick={() => this.setState({search: ''})}
                                >
                                    X
                                </Button>
                            ) : null}
                        </Col>

                        <Col lg={1} />

                        {numbersSectors <= 1 ? <Col lg={2} /> : (
                            <Col lg={2}>
                                <MySelect
                                    name='Выберите участок'
                                    value={activeSector}
                                    onChange={(e) => {
                                        this.setState({loading: true})
                                        this.setState({activeSector: e.target.value})
                                    }}
                                    option={optionSector}
                                />
                            </Col>
                        )}
                        <Col lg={2} />

                        <Col lg={3} className='text-end'>
                            <Alert
                                className='text-end m-0 p-0 text-black-50 fst-italic'
                                style={{fontSize: '12px'}}
                                variant='light'
                            >
                                Участок - {activeSector}
                            </Alert>
                            <Alert
                                className='text-end m-0 p-0 text-black-50 fst-italic'
                                style={{fontSize: '12px'}}
                                variant='light'
                            >
                                Общая площадь - {squareOrders} м2
                            </Alert>
                        </Col>
                    </Row>

                    {loading ? (
                        <Loading />
                    ) : this.state.noSearch ? (
                        <Col className='text-muted text-center'>{this.state.noSearch}</Col>
                    ) : (
                        <Row>
                            <Col style={{height: '75vh', overflow: "auto"}}>
                                <Table hover bordered variant={'dark'} size='sm'>
                                    <Thead title={headerTable}/>

                                    {activeFilter === 'all' || activeFilter === 'overdue' ?
                                        <Tbody orders={activeOrders.overdueOrders} params={paramsTable} color={'table-danger'}/>
                                        : null}

                                    {activeFilter === 'all' || activeFilter === 'forToday' ?
                                        <Tbody orders={activeOrders.todayOrders} params={paramsTable} color={'table-primary'}/>
                                        : null}

                                    {activeFilter === 'all' || activeFilter === 'forFuture' ?
                                        <Tbody orders={activeOrders.futureOrders} params={paramsTable} color={'table-success'}/>
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

                    <CustomError error={error} cleanError={() => this.setState({error: null})}/>
                </JournalLayout>
            </MainLayout>
        )
    }
}

export default withRouter(PlansJournal)

export async function getServerSideProps({req,query}) {

    const token = getTokenCookies(req.headers.cookie)
    const cookies = req.headers.cookie
    const id = query.id

    let journal, error

    journal = await getOrderJournal(id, token)

    if (journal) {
        return {
            props: {
                journal,
            }
        }
    } else if (error) {
        return {
            props: {
                error,
                cookiesServ: cookies,
                tokenServ: token
            }
        }
    } else {
        return {
            props: {}
        }
    }
}
