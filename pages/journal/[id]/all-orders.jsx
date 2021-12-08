import React, {Component} from "react";
import {getAdoptedOrderJournal} from "../../../services/journals/get";
import {globalState} from "../../../data/globalState";
import Thead from "../../../modules/tables/thead";
import Tbody from "../../../modules/tables/tbody";
import {Table, Row, Col, Alert, FormControl, Button, InputGroup, Form, FloatingLabel, Spinner} from "react-bootstrap";
import PaginationTable from "../../../modules/pagination";
import Loading from "../../../modules/loading";
import CustomError from "../../../modules/error";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../../modules/cookie";
import {MainLayout} from "../../../components/layout/main";
import JournalLayout from "../../../components/layout/journals";
import {format, previousMonday, previousSunday, startOfWeek, endOfWeek} from 'date-fns'
import {MyInput} from "../../../components/elements";

class AllOrdersJournal extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        title: 'Выполненные заказы',
        filters: [],
        allOrders: [],
        squareOrders: 0,
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
        link: null,
        noSearch: '',
        loading: true,
        timer: null
    }

    async componentDidMount() {
        if (this.props.data.count === 0) {
            this.setState({noSearch: 'Данные находятся за гранью доступного'})
            this.setState({loading: false})
        } else {
            this.setState({loading: false})
        }

        this.setState({link: this.props.router.asPath})
        await this.addData(this.props.data)
        this.renderHeader()
        this.countSquare()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.activePage !== prevState.activePage) {
            this.setState({loading: true})
            await this.changeData()
        }

        if (this.state.allOrders !== prevState.allOrders) {
            this.countSquare()
        }
    }

    // внесенние полученных данных в state
    addData = (data) => {
        this.setState({allOrders: data.orders})
        this.setState({counts: data.count})
        this.setState({pages: data.pages})
    }

    // получение заказов с сервера
    changeData = async () => {
        const {token, id} = this.props
        const {activePage, filter} = this.state
        const {startDate, endDate, search, limit} = filter

        let data, error, sDate = '', eDate = ''

        if (startDate) sDate = format(new Date(startDate), 'dd.MM.yyyy')
        if (endDate) eDate = format(new Date(endDate), 'dd.MM.yyyy')

        this.setState({loading: true})

        await getAdoptedOrderJournal(id, token, activePage, limit, sDate, eDate, search)
            .then(res => data = res.data)
            .catch(err => error = err.response?.data)

        this.setState({loading: false})

        if (data) {
            this.addData(data)
        }
        else if (error) {
            this.setState({error})
        }
    }

    // формирование заголовка таблицы
    renderHeader = () => {
        const {allOrders} = this.state,
            {headersTables} = globalState
        let header = [],
            params = []

        if (allOrders) {
            for (let key in allOrders[0]) {
                headersTables.map(item => {
                    if (key === 'data') {
                        for (let dataKey in allOrders[0][key]) {
                            item.label.map(label => {
                                if (label === dataKey) {
                                    params.push(dataKey)
                                    header.push(item.name)
                                }
                            })
                        }
                    } else {
                        item.label.map(label => {
                            if (label === key) {
                                params.push(key)
                                header.push(item.name)
                            }
                        })
                    }
                })
            }
        }

        this.setState({headerTable: header})
        this.setState({paramsTable: params})
    }

    // изменение активной страницы
    changeActivePage = (page) => {
        this.setState({activePage: page})
        this.setState({allOrders: []})
    }

    // отображение заказов за сегодня
    filterTodayOrder = async () => {
        let d = new Date(JSON.parse(this.props.date)),
            date = format(d, 'yyyy-MM-dd')

        await this.setState(({filter}) => {
            return (
                filter.startDate = date,
                filter.endDate = date
            )
        })

        this.setState({activePage: 1})

        this.changeData()
    }

    // отображение заказов за прошедшую неделю
    filterLastWeekOrder = async () => {
        let d = new Date(JSON.parse(this.props.date)),
            prevSunday = previousSunday(d),
            lastSunday = format(prevSunday, 'yyyy-MM-dd'),
            lastMonday = format(previousMonday(prevSunday), 'yyyy-MM-dd')

        await this.setState(({filter}) => {
            return (
                filter.startDate = lastMonday,
                filter.endDate = lastSunday
            )
        })

        this.setState({activePage: 1})

        this.changeData()
    }

    // отображение заказов за текущую неделю
    filterCurrentWeekOrder = async () => {
        let d = new Date(JSON.parse(this.props.date)),
            currentMonday = format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
            currentSunday = format(endOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd')

        await this.setState(({filter}) => {
            return (
                filter.startDate = currentMonday,
                filter.endDate = currentSunday
            )
        })

        this.setState({activePage: 1})

        this.changeData()
    }

    // отображение всех заказов
    filterAllOrder = async () => {
        await this.setState(({filter}) => {
            return (
                filter.startDate = '',
                filter.endDate = ''
            )
        })

        this.setState({activePage: 1})

        this.changeData()
    }

    // подсчет площади заказов
    countSquare = async () => {
        const {allOrders} = this.state
        let allSquare

        const count = (arr) => {
            let count = 0
            arr.map(order =>  count += order.fasadSquare)
            count = Math.round(count * 100) / 100
            return count
        }

        allSquare = count(allOrders)

        await this.setState({squareOrders: allSquare})
    }

    // фильтр с задержкой
    filterTimeout = (param, value) => {
        const {timer} = this.state

        clearTimeout(timer)

        this.setState(({filter}) => filter[param] = value)
        this.setState({activePage: 1})

        this.setState({timer: setTimeout(this.changeData, 1000)})
    }

    render() {
        const {headerTable, paramsTable, allOrders, activePage, pages, error, link, title, filter, activeFilter, squareOrders} = this.state

        return (
            <MainLayout title={title} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={this.props.id}
                    activePage={'all-orders'}
                    changeOpenFilter={() => this.setState({activeFilter: !this.state.activeFilter})}
                    openFilter={activeFilter}
                >
                    <Row>
                        <Col lg={activeFilter ? 10 : 12}>
                            <Row className='align-items-end'>
                                <Col lg={12} className='text-center'>
                                    <h3>
                                        {title}
                                    </h3>
                                </Col>

                                <Col>
                                    <MyInput
                                        name='Произвольный поиск'
                                        value={filter.search}
                                        onChange={(e) => this.filterTimeout('search', e.target.value)}
                                    />
                                </Col>

                                <Col className='mt-2 text-center' lg={5}>
                                    <Button
                                        variant='outline-secondary'
                                        className='me-3'
                                        onClick={() => this.filterTodayOrder()}
                                    >
                                        Сегодня
                                    </Button>
                                    <Button
                                        variant='outline-secondary'
                                        className='me-3'
                                        onClick={() => this.filterCurrentWeekOrder()}
                                    >
                                        Текущая неделя
                                    </Button>
                                    <Button
                                        variant='outline-secondary'
                                        className='me-3'
                                        onClick={() => this.filterLastWeekOrder()}
                                    >
                                        Прошедшая неделя
                                    </Button>
                                    <Button
                                        variant='outline-secondary'
                                        className='me-3'
                                        onClick={() => this.filterAllOrder()}
                                    >
                                        Все
                                    </Button>
                                </Col>

                                <Col className='mt-2 text-center'>

                                </Col>
                            </Row>

                            <hr className='mt-3 mb-2'/>

                            {this.state.loading ? (
                                <Loading/>
                            ) : this.state.noSearch ? (
                                <Col className='text-muted text-center'>{this.state.noSearch}</Col>
                            ) : (
                                <>
                                    <Row>
                                        <Col lg={6}>
                                            <PaginationTable activePage={+activePage} lastPage={pages} onClick={this.changeActivePage}/>
                                        </Col>
                                        <Col lg={6} className='text-end mb-2'>
                                            <Alert
                                                className='m-0 p-0'
                                                variant='light'
                                            >
                                                Всего заказов - {this.state.counts} на {this.state.pages} страниц
                                            </Alert>
                                            <Alert
                                                className='m-0 p-0'
                                                variant='light'
                                            >
                                                Общая площадь - {squareOrders} м2
                                            </Alert>
                                        </Col>

                                        <Col lg={12} style={{height: '65vh', overflow: "auto"}}>
                                            <Table hover bordered variant={'dark'} size='sm'>
                                                <Thead title={headerTable}/>
                                                <Tbody orders={allOrders} params={paramsTable} color={'table-light'}/>
                                            </Table>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Col>
                        <Col lg={2} className={`${activeFilter ? null : 'd-none'} border border-top-0 border-end-0 border-bottom-0 pt-3`}>
                            <Row>
                                <Col lg={12} className='mb-3 text-center'>Фильтры</Col>

                                <Col lg={12} className='mb-3'>
                                    <MyInput
                                        name='Кол-во заказов на странице'
                                        value={filter.limit}
                                        onChange={async (e) => this.filterTimeout('limit', e.target.value)}
                                    />
                                </Col>

                                <Col lg={12} className='mb-3'>
                                    <MyInput
                                        name='Дата начала'
                                        type='date'
                                        value={filter.startDate}
                                        onChange={(e) => this.filterTimeout('startDate', e.target.value)}
                                    />
                                </Col>

                                <Col lg={12} className='mb-3'>
                                    <MyInput
                                        name='Дата окончания'
                                        type='date'
                                        value={filter.endDate}
                                        onChange={(e) => this.filterTimeout('endDate', e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>



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

    let data, error, date = new Date()

    await getAdoptedOrderJournal(id, token)
        .then(res  => data = res.data)
        .catch(({response}) => error = response?.data)

    if (data) {
        return {
            props: {
                data,
                id,
                date: JSON.stringify(date)
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