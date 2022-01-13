import React, {Component} from "react";
import {Row, Col, Table, Modal, Form, Alert, Button, Toast} from "react-bootstrap";
import {connect} from 'react-redux';
import {withRouter} from "next/router";
import Thead from "../../../modules/tables/thead";
import Tbody from "../../../modules/tables/tbody";
import {globalState} from "../../../data/globalState";
import {getCommentsOrder, getOrdersSector, getSectors} from "../../../services/journals/get";
import {connectCommentsOrder} from "../../../services/journals/post";
import MainLayout from "../../../components/layout/main";
import JournalLayout from "../../../components/layout/journals";
import {MyInput, MySelect} from "../../../components/elements";
import {setLoading, removeLoading, setError, setTokenTimer, setFullscreen} from "../../../redux/actions/actionsApp";
import {
    setOrdersSector,
    setSectors,
    setTodayOrders,
    setFutureOrders,
    setOverdueOrders,
    removeOrders,
    setCommentsOrder, removeCommentsOrder
} from "../../../redux/actions/actionsJournals";
import MyChat from "../../../modules/chat/chat";
import {IconPrint, printPage} from "../../../modules/print";
import exitApp from "../../../modules/exit";


class PlansJournal extends Component {
    constructor(props) {
        super(props);
        this.commentInput = React.createRef();
    }

    state = {
        title: 'Планы журнала',
        journal: [],
        sectors: [],
        activeSector: '',
        activeSectorId: 0,
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
        filtersButtons: [
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
        activeFilterButtons: 'all',
        filters: {
            search: '',
            startDate: '',
            endDate: ''
        },
        activeFilter: false,
        viewComment: {
            view: false,
            orderId: 0,
            orderName: ''
        },
        link: null,
        journalID: null,
        error: null,
        loading: false,
        noSearch: '',
        isOwner: false,
        updatePage: null,
        timer: null
    }

    async componentDidMount() {
        await this.setState({link: this.props.router.asPath})
        await this.setState({journalID: this.props.router.query.id})

        this.setState({isOwner: this.props.user.isOwner})

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.router.query.id !== prevProps.router.query.id) {
            this.setState({link: this.props.router.asPath})
            this.setState({journalID: this.props.router.query.id})
            this.setState({activeFilterButtons: 'all'})
        }

        if (this.state.journalID !== prevState.journalID) {
            if (this.state.journalID) {
                // clearTimeout(this.props.timerID)
                this.props.removeOrders()
                this.clearFilters()

                await this.getSectors()
                // this.props.setTokenTimer(setTimeout(() => exitApp(), 900000))
            }
        }

        if (this.state.activeSectorId !== prevState.activeSectorId) {
            this.props.removeOrders()
            this.clearFilters()
            // clearTimeout(this.props.timerID)

            this.props.setLoading()

            await this.getOrdersSector()
            this.createHeaderAndParams()

            this.props.removeLoading()
            // this.props.setTokenTimer(setTimeout(() => exitApp(), 900000))
        }

        if (this.state.activeFilterButtons !== prevState.activeFilterButtons) {
            this.countSquare()
        }

        if (
            this.props.todayOrders !== prevProps.todayOrders ||
            this.props.overdueOrders !== prevProps.overdueOrders ||
            this.props.futureOrders !== prevProps.futureOrders
        ) {
            this.countOrders()
            this.countSquare()
        }
    }

    componentWillUnmount() {
        this.props.removeOrders()
    }

    // + получение секторов и размещение их в редакс
    getSectors = async () => {
        const allSector = {
            id: null,
            name: "Все участки"
        }

        await getSectors(this.props.token, this.props.router.query.id )
            .then(res => {
                let idSector = res.data[0].id, sectors

                if (res.data.length > 1) sectors = [...res.data, allSector]
                else sectors = [...res.data]

                this.props.setSectors(sectors)

                this.setState({activeSectorId: idSector})
                this.setState({activeSector: res.data[0].name})

            })
    }

    // + получение заказов и размещение в редакс
    getOrdersSector = async (search = '') => {
        const {activeSectorId, journalID} = this.state,
            allFilters = ['сегодня', 'будущие', 'просроченные'],
            promises = allFilters.map(async filter => {
                let newFilter = filter + ' + ' + search

                await getOrdersSector(this.props.token, journalID, activeSectorId, newFilter)
                    .then(res => this.changeOrder(res.data, filter))
            });

        await Promise.all(promises);
    }

    // + изменение объекта заказов
    changeOrder = (orders, filter) => {
        let newOrders = []

        const addEditButton = (obj, arr) => {
            obj.map(item => {
                item.data.edit =
                    <i
                        className='position-relative bi bi-chat-square-text-fill text-dark'
                        style={{fontSize: 18}}
                        onClick={() => this.viewChatComments(item)}
                    >
                        <span
                            className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark ms-1'
                            style={{fontSize: 10}}
                        >
                            {item.data.comments.length !== 0 ? item.data.comments.length : null}
                        </span>
                    </i>
                arr.push(item)
            })
        }

        {orders ? addEditButton(orders, newOrders) : null}

        if (filter.includes("СЕГОДНЯ") || filter.includes("сегодня")) this.props.setTodayOrders(newOrders)
        else if (filter.includes("ПРОСРОЧЕННЫЕ") || filter.includes("просроченные")) this.props.setOverdueOrders(newOrders)
        else if (filter.includes("БУДУЩИЕ") || filter.includes("будущие")) this.props.setFutureOrders(newOrders)
        else this.props.setOrdersSector(newOrders)
    }

    // + создание заголовка и параметров таблицы
    createHeaderAndParams = () => {
        const {futureOrders, todayOrders, overdueOrders} = this.props,
            {headersTables} = globalState
        let header = [],
            params = []

        if (overdueOrders) {
            for (let key in overdueOrders[0]) {
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
        else if (futureOrders) {
            for (let key in futureOrders[0]) {
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
        else if (todayOrders) {
            for (let key in todayOrders[0]) {
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

    // + подсчет кол-ва заказов
    countOrders = () => {
        const {filtersButtons} = this.state,
            {todayOrders, overdueOrders, futureOrders} = this.props
        let overdueCounts = overdueOrders.length,
            todayCounts = todayOrders.length,
            futureCounts = futureOrders.length,
            allCounts = overdueCounts + todayCounts + futureCounts,
            newFilters = [...filtersButtons]

        newFilters.map((filter, i) => {
            if (filter.type === 'all') filter.number = allCounts
            if (filter.type === 'overdue') filter.number = overdueCounts
            if (filter.type === 'forToday') filter.number = todayCounts
            if (filter.type === 'forFuture') filter.number = futureCounts
        })

        this.setState({filters: newFilters})
    }

    // + подсчет площади заказов
    countSquare = () => {
        const {activeFilterButtons} = this.state,
            {todayOrders, overdueOrders, futureOrders} = this.props
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

        overdueSquare = count(overdueOrders)
        futureSquare = count(futureOrders)
        todaySquare = count(todayOrders)

        allSquare = overdueSquare + todaySquare + futureSquare

        allSquare = Math.round(allSquare * 100) / 100

        if (activeFilterButtons === 'all') this.setState({squareOrders: allSquare})
        else if (activeFilterButtons === 'overdue') this.setState({squareOrders: overdueSquare})
        else if (activeFilterButtons === 'forToday') this.setState({squareOrders: todaySquare})
        else if (activeFilterButtons === 'forFuture') this.setState({squareOrders: futureSquare})
    }

    // открытие чата комментариев
    viewChatComments = async (item) => {
        const newViewComment = {
            view: true,
            orderId: item.id,
            orderName: item.itmOrderNum
        }

        this.setState({viewComment: newViewComment})

        await this.getComments(item.id)
    }

    // получение комментариев заказа
    getComments = async (id) => {
        await getCommentsOrder(this.props.token, id)
            .then(async res => {
                this.props.setCommentsOrder(res.data.comments)
                // await connectCommentsOrder()
            })
            .catch(e => {
                this.props.setError(e.response?.data)
            })
    }

    // выбор комментария пользователя
    selectComment = (value) => {
        const {changeComment} = this.state
        const userName = this.props.user.userName
        let search

        changeComment.data.map(comment => {
            if (+value === +comment.employeeId) {
                return search = comment
            }
        })

        if (search) {
            this.setState(({changeComment}) => {
                return (
                    changeComment.userId = search.employeeId,
                    changeComment.userName = search.userName,
                    changeComment.dataId = search.id,
                    changeComment.comment = search.data
                )
            })
        }
    }

    // закрытие чата комментариев
    closeChatComments = () => {
        const newViewComment = {
            view: false,
            orderId: 0,
            orderName: ''
        }

        this.setState({viewComment: newViewComment})

        this.props.removeCommentsOrder()
    }

    // изменение кнопок фильтрации заказов
    changeButtonFilter = (value) => {
        this.setState({activeFilterButtons: value})
    }

    // + фильтр с задержкой
    filterTimeout = async (param, value) => {
        const {timer, filters} = this.state

        clearTimeout(timer)

        await this.setState(({filters}) => filters[param] = value)

        this.setState({timer: setTimeout(() => {
                this.getOrdersSector(filters.search)
            }, 2000)})

    }

    // очистка фильтров
    clearFilters = () => {
        const clearFilters = {
            search: '',
            startDate: '',
            endDate: ''
        }

        this.setState({filters: clearFilters})

        this.getOrdersSector()
    }

    render() {
        const {journalID, filtersButtons, activeFilterButtons, headerTable,
            viewComment, paramsTable, activeFilter, filters, link, activeSector,
            title, squareOrders} = this.state
        const {todayOrders, overdueOrders, futureOrders, sectors, fullscreen, setFullscreen} = this.props

        let optionSector = []

        sectors.map(sector => {
            return (
                optionSector.push(<option id={sector.id} value={sector.name} key={sector.id}>{sector.name}</option>)
            )
        })

        return (
            <MainLayout title={title} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={journalID}
                    activePage={'plans'}
                    activeFilter={activeFilterButtons}
                    filters={filtersButtons}
                    title={`${title} - ${activeSector}`}
                    square={squareOrders}
                    onChangeFilter={this.changeButtonFilter}
                >

                    <Row className='align-items-end mb-3'>
                        <Col lg={4}>
                            <MyInput
                                name='Произвольный поиск'
                                type='text'
                                value={filters.search}
                                onChange={e => this.filterTimeout('search', e.target.value)}
                            />
                        </Col>

                        <Col lg={1}/>

                        {sectors.length > 1 ?
                            <Col lg={2}>
                                <MySelect
                                    name='Выберите участок'
                                    value={activeSector}
                                    onChange={(e) => {
                                        const index = e.target.selectedIndex
                                        this.setState({activeSector: e.target.value})
                                        this.setState({activeSectorId: e.target[index].id})
                                    }}
                                    option={optionSector}
                                />
                            </Col>
                        : <Col lg={2}/> }

                        <Col lg={2} />

                        <Col lg={3} className='mt-2 text-end'>
                            <Button
                                type='button'
                                variant='outline-dark'
                                className={`bi ${fullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'} me-3 shadow border-0`}
                                onClick={() => setFullscreen()}
                            />

                            <Button
                                type='button'
                                variant='outline-dark'
                                className='bi bi-funnel-fill me-3 shadow border-0'
                                active={activeFilter}
                                onClick={() => this.setState({activeFilter: !this.state.activeFilter})}
                            />

                            <IconPrint onClickPrint={() => printPage('doc-print')} />
                        </Col>
                    </Row>

                    {overdueOrders.length === 0 && todayOrders.length === 0 && futureOrders.length === 0  ? (
                        <Col className='text-muted text-center'>Данных не существует...</Col>
                    ) : (
                        <Row>
                            <Col id='doc-print' style={fullscreen ? {height: '80vh', overflow: "auto", fontSize: '30px'} : {height: '75vh', overflow: "auto"}}>
                                <Table variant={'dark'} size='sm'>
                                    <Thead title={headerTable}/>

                                    {activeFilterButtons === 'all' || activeFilterButtons === 'overdue' ?
                                        <Tbody orders={overdueOrders} params={paramsTable} color={'red'}/>
                                        : null}

                                    {activeFilterButtons === 'all' || activeFilterButtons === 'forToday' ?
                                        <Tbody orders={todayOrders} params={paramsTable} color={'blue'}/>
                                        : null}

                                    {activeFilterButtons === 'all' || activeFilterButtons === 'forFuture' ?
                                        <Tbody orders={futureOrders} params={paramsTable} color={'green'}/>
                                        : null}
                                </Table>
                            </Col>
                        </Row>
                    )}

                    {viewComment.view ?
                        <MyChat
                            token={this.props.token}
                            viewComments={viewComment}
                            closeChat={this.closeChatComments}
                            getComments={this.getComments}
                        />
                            : null}

                    <Toast
                        show={activeFilter}
                        onClose={() => this.setState({activeFilter: !this.state.activeFilter})}
                        className='position-absolute top-20 bg-white'
                        style={{right: '10px', zIndex: 15}}
                    >
                        <Toast.Header>
                            <strong className="me-auto">Фильтры</strong>
                        </Toast.Header>
                        <Toast.Body>
                            <Row>
                                <Col lg={12}>
                                    <Button
                                        variant={"outline-dark"}
                                        className={'w-100'}
                                        onClick={() => {
                                            this.getOrdersSector('принятые')
                                        }}
                                    >
                                        Принятые
                                    </Button>
                                </Col>

                                <hr className={'my-3'}/>

                                <Col lg={12}>
                                    <MyInput
                                        name='Дата начала'
                                        type='date'
                                        disabled={true}
                                        value={filters.startDate}
                                        onChange={(e) => this.filterTimeout('startDate', e.target.value)}
                                    />
                                    <MyInput
                                        name='Дата окончания'
                                        type='date'
                                        disabled={true}
                                        value={filters.endDate}
                                        onChange={(e) => this.filterTimeout('endDate', e.target.value)}
                                    />
                                </Col>

                                <hr className={'my-3'}/>

                                <Col lg={12}>
                                    <Button
                                        variant={"outline-danger"}
                                        className={'w-100'}
                                        onClick={() => {
                                            this.clearFilters()
                                        }}
                                    >
                                        Сбросить фильтры
                                    </Button>
                                </Col>
                            </Row>
                        </Toast.Body>
                    </Toast>
                </JournalLayout>
            </MainLayout>
        )
    }
}

const mapSTP = state => ({
    timerID: state.app.activeTimer,
    user: state.app.user,
    sectors: state.journal.sectors,
    orders: state.journal.orders,
    todayOrders: state.journal.todayOrders,
    overdueOrders: state.journal.overdueOrders,
    futureOrders: state.journal.futureOrders,
    fullscreen: state.app.fullscreen
})

export default connect(mapSTP, {
    setLoading, removeLoading, setError, setSectors, setOrdersSector, setTodayOrders,
    setFutureOrders, setOverdueOrders, removeOrders, setCommentsOrder,
    removeCommentsOrder, setTokenTimer, setFullscreen
})(withRouter(PlansJournal))
