import React, {Component} from "react";
import {Col, Form, InputGroup, ListGroup, Row, Table} from "react-bootstrap";
import Thead from "../../../../modules/tables/thead";
import Link from "next/link";
import {MainLayout} from "../../../../components/layout/main";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../../../modules/cookie";
import {getWeekSalary} from "../../../../services/journals/get";
import JournalLayout from "../../../../components/layout/journals";

class WeekSalary extends Component {

    state = {
        headerTable: [],
        total: {
            premium: [],
            cost: {
                selection: 0,
                gash: 0,
                masterJohn: 0,
                vayma: 0,
                fifth: 0,
                final: 0
            },
            allCost: 0,
            allPrem: 0,
            allPenalty: 0,
            result: 0,
            square: 0
        },
        activeSalary: 'week-salary',
        allSectors: [],
        sector: '',
        link: null,
        journalID: null
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        this.setState({journalID: this.props.router.query.id})
        this.renderHeaderTable()
        await this.addSectors()
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.renderHeaderTable()
            await this.addSectors()
        }

        if (this.state.sector !== prevState.sector) {
            await this.addWork()
            await this.addPrem()
            await this.addTotalSquare()
            await this.addTotalCost()
            await this.addTotalPrem()
            await this.addTotalPenalty()
            await this.addResult()
        }
    }

    addSectors = () => {
        const {sectors} = this.props

        let allSectors = []

        sectors.map(sector => {
            allSectors.push(sector.name)
        })

        this.setState({allSectors})
    }

    addWork = () => {
        const {sectors} = this.props
        let totalCost = {
            selection: 0,
            gash: 0,
            masterJohn: 0,
            vayma: 0,
            fifth: 0,
            final: 0
        }

        sectors.map(item => {
            if (item.name === this.state.sector) {
                item.orders.map((order, oI) => {
                    order.works.map(work => {
                        if (oI === 0) {
                            if (work.work === 'Подбор') totalCost.selection = work.money
                            else if (work.work === 'Запил') totalCost.gash = work.money
                            else if (work.work === 'Мастер Джон') totalCost.masterJohn = work.money
                            else if (work.work === 'Вайма') totalCost.vayma = work.money
                            else if (work.work === 'Пятый') totalCost.fifth = work.money
                            else if (work.work === 'Финальная очистка фасада') totalCost.final = work.money
                        } else {
                            if (work.work === 'Подбор') totalCost.selection += work.money
                            else if (work.work === 'Запил') totalCost.gash += work.money
                            else if (work.work === 'Мастер Джон') totalCost.masterJohn += work.money
                            else if (work.work === 'Вайма') totalCost.vayma += work.money
                            else if (work.work === 'Пятый') totalCost.fifth += work.money
                            else if (work.work === 'Финальная очистка фасада') totalCost.final += work.money
                        }

                    })
                })
            }
        })

        this.setState(({total}) => {
            return (
                total.cost.selection = Math.round(totalCost.selection * 100) / 100,
                    total.cost.gash = Math.round(totalCost.gash * 100) / 100,
                    total.cost.masterJohn = Math.round(totalCost.masterJohn * 100) / 100,
                    total.cost.vayma = Math.round(totalCost.vayma * 100) / 100,
                    total.cost.fifth = Math.round(totalCost.fifth * 100) / 100,
                    total.cost.final = Math.round(totalCost.final * 100) / 100
            )
        })
    }

    addPrem = () => {
        const {sectors} = this.props
        let totalPrem = [],
            objPrem = {}

        sectors.map(item => {
            if (item.name === this.state.sector) {
                item.orders.map((order, oI) => {
                    order.works.map(work => {
                        if (oI === 0) {
                            if (work.work === 'Надбавка Фин. очистка фасада') {
                                objPrem.label = work.work
                                objPrem.cost = work.money
                            }
                        } else {
                            if (work.work === 'Надбавка Фин. очистка фасада') objPrem.cost += work.money
                        }
                    })
                })
                if (objPrem.cost) objPrem.cost = Math.round(objPrem.cost * 100) / 100
                if (objPrem.cost) totalPrem.push(objPrem)
                objPrem = {}

                item.orders.map((order, oI) => {
                    order.works.map(work => {
                        if (oI === 0) {
                            if (work.work === 'Надбавка Мастер Джон') {
                                objPrem.label = work.work
                                objPrem.cost = work.money
                            }
                        } else {
                            if (work.work === 'Надбавка Мастер Джон') objPrem.cost += work.money
                        }
                    })
                })
                if (objPrem.cost) objPrem.cost = Math.round(objPrem.cost * 100) / 100
                if (objPrem.cost) totalPrem.push(objPrem)
                objPrem = {}

                item.otherTransactoins.data.map(penalty => {
                    if (penalty.modifer === 1) {
                        objPrem.label = `${penalty.userName}.: ${penalty.description}`
                        objPrem.cost = +penalty.amount
                        if (objPrem.cost) objPrem.cost = Math.round(objPrem.cost * 100) / 100
                        if (objPrem.cost) totalPrem.push(objPrem)
                        objPrem = {}
                    }
                })
            }
        })

        this.setState(({total}) => total.premium = totalPrem)
    }

    addTotalSquare = () => {
        const {sectors} = this.props
        let totalSquare = 0

        sectors.map(item => {
            if (item.name === this.state.sector) {
                item.orders.map(order => {
                    totalSquare += +order.works[0].square
                })
            }
        })

        this.setState(({total}) => total.square = Math.round(totalSquare * 1000) / 1000)
    }

    addTotalCost = () => {
        const total = this.state.total
        let allCost = 0

        for (let key in total.cost) {
            allCost += total.cost[key]
        }

        this.setState(({total}) => total.allCost = Math.round(allCost * 100) / 100)
    }

    addTotalPenalty = () => {
        const {sectors} = this.props
        let allPenalty = 0

        sectors.map(sector => {
            if (sector.name === this.state.sector) {
                sector.otherTransactoins.data.map(penalty => {
                    if (penalty.modifer === -1) {
                        allPenalty += +penalty.amount
                    }
                })
            }
        })

        allPenalty = Math.round(allPenalty * 100) / 100

        this.setState(({total}) => total.allPenalty = allPenalty)

    }

    addTotalPrem = () => {
        const total = this.state.total
        let allPrem = 0

        if (total.premium[0]) {
            total.premium.map(item => {
                allPrem += +item.cost
            })
        }

        allPrem = Math.round(allPrem * 100) / 100

        this.setState(({total}) => total.allPrem = allPrem)
    }

    addResult = () => {
        const {total} = this.state
        let res

        res = total.allCost + total.allPrem - total.allPenalty

        this.setState(({total}) => total.result = Math.round(res * 100) / 100)
    }

    renderWeekSalary = () => {
        const {sectors} = this.props
        let line = [], cell

        let allCells = []

        return sectors.map((item, i) => {
            if (item.name === this.state.sector) {
                item.orders.map((order, oI) => {
                    cell = [
                        <td key={`${oI}_1`} className='bg-light text-dark' width={'3%'}>{oI + 1}</td>,
                        <td key={`${oI}_2`} className='bg-light text-dark'>
                            <Link href={`/order/${order.id}`}>
                                <a className='text-dark text-decoration-none'>
                                    {order.itmOrderNum}
                                </a>
                            </Link>

                        </td>,
                        <td key={`${oI}_3`} className='bg-light text-dark' width={'9%'}>{Math.round(order.works[0].square*1000)/1000}</td>
                    ]

                    allCells = [...cell]

                    order.works.map((work, wI) => {
                        if (!work.work.includes('Надбавка')) {
                            for (let key in work) {
                                if (key === 'money') {
                                    cell = <td key={wI} className='bg-light text-dark' width={'9%'}>{Math.round(work[key]*100)/100} ₽</td>

                                    allCells.push(cell)
                                }
                            }
                        }
                    })

                    line.push(<tr className='text-center' key={oI}>
                        {allCells}
                    </tr>)
                })
            }
            return line
        })
    }

    renderHeaderTable = () => {
        const {sectors} = this.props
        let header = ['№', 'Наименование', 'Площадь']

        sectors.map(item => {
            item.orders[0].works.map(work => {
                if (!work.work.includes('Надбавка')) {
                    header = [...header, work.work]
                }
            })
        })

        this.setState({headerTable: header})
    }

    renderTotal = (total) => {
        let line, cell = []

        cell.push(
            <td colSpan={2} className='text-uppercase text-end' key='total'>
                Итого:
            </td>
        )

        cell.push(
            <td className='text-uppercase text-center' key='square'>
                {total.square}
            </td>
        )

        for (let key in total.cost) {
            cell.push(
                <td className='text-center' key={key}>
                    {total.cost[key]} ₽
                </td>
            )
        }

        line = <tr className='fw-bold text-uppercase'>
            {cell}
        </tr>

        return line
    }

    renderListPrem = (object) => {
        let listItems = []

        for (let key in object) {

            listItems.push(
                <ListGroup.Item
                    variant="success"
                    key={key}
                    className='text-start'
                >
                    {object[key].label} - <b>{object[key].cost} ₽</b>
                </ListGroup.Item>
            )
        }

        return (
            <ListGroup>
                {listItems}
            </ListGroup>
        )
    }

    renderListPenalty = (array) => {
        let listItems = []

        array.map((penalty, i) => {
            if (penalty.modifer === -1) {
                listItems.push(
                    <ListGroup.Item
                        variant="danger"
                        key={i}
                        className='text-start'
                    >
                        {penalty.userName}.: {penalty.description} - <b>{penalty.amount} ₽</b>
                    </ListGroup.Item>
                )
            }
        })

        return (
            <ListGroup>
                {listItems}
            </ListGroup>
        )
    }

    render() {
        const {headerTable, total, link, journalID, activeSalary, sector, allSectors} = this.state
        const {sectors} = this.props

        return (
            <MainLayout title={`Предварительный недельный расчет`} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={journalID}
                    activePage={'salary'}
                    activeSalary={activeSalary}
                >
                    <Row>
                        <Col lg={4}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Выберите участок</InputGroup.Text>
                                <Form.Select
                                    value={sector}
                                    onChange={(e) => {
                                        this.setState({sector: e.target.value})
                                    }}>
                                    <option value=''>{''}</option>
                                    {allSectors.map((sector, i) => {
                                        return (
                                            <option value={sector} key={i}>{sector}</option>
                                        )
                                    })}
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    </Row>

                    {sector ? (
                        <>
                            <Row className='my-3'>
                                <Col>
                                    <h3 className='fw-bold text-center'>Предварительный расчет для сектора {sector}</h3>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Table bordered hover className='my-3'>
                                        <Thead title={headerTable} />
                                        <tbody>
                                        {this.renderWeekSalary()}
                                        {this.renderTotal(total)}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <Row className='mb-3'>
                                <Col>
                                    <h3 className='text-start mb-3'>Сводный отчет:</h3>
                                    <hr/>
                                    <ListGroup>
                                        {total.cost
                                            ? <ListGroup.Item variant="light" className='text-start'>
                                                Зарплата за период: <b>{total.allCost} ₽</b>
                                            </ListGroup.Item>
                                            : null}

                                        {total.allPrem
                                            ? <ListGroup.Item variant="light" className='text-start'>
                                                Доплат всего: <b>{total.allPrem} ₽</b>
                                            </ListGroup.Item>
                                            : null}

                                        {total.allPenalty
                                            ? <ListGroup.Item variant="light" className='text-start'>
                                                Удержаний всего: <b>{total.allPenalty} ₽</b>
                                            </ListGroup.Item>
                                            : null}

                                        {total.result
                                            ? <ListGroup.Item variant="light" className='text-start'>
                                                К выдаче: <b>{total.result} ₽</b>
                                            </ListGroup.Item>
                                            : null}
                                    </ListGroup>
                                </Col>

                                {total.premium
                                    ? <Col>
                                        <h3 className='text-start mb-3'>Доплаты:</h3>
                                        <hr/>
                                        {this.renderListPrem(total.premium)}
                                    </Col>
                                    : null
                                }

                                {sectors[0].otherTransactoins.data[0]
                                    ? <Col>
                                        <h3 className='text-start mb-3'>Удержания:</h3>
                                        <hr/>
                                        {this.renderListPenalty(sectors[0].otherTransactoins.data)}
                                    </Col>
                                    : null
                                }
                            </Row>

                                <hr/>

                            <Row>
                                <Col>
                                    <p className='text-muted m-0'>
                                        * Условие получение надбавки на Мастер Джон: беспрерывная работа станка с 8:00 до 17: 00 при наличии заказов
                                    </p>
                                    <p className='text-muted m-0'>
                                        * Условие получение надбавки на ФОФ: беспрерывный прием и сдача продукции
                                    </p>
                                </Col>
                            </Row>
                        </>
                        ) : null}
                </JournalLayout>
            </MainLayout>
        )
    }
}

export default withRouter(WeekSalary)

export async function getServerSideProps({req,query}) {

    const token = getTokenCookies(req.headers.cookie)
    const id = query.id

    let sectors, error

    await getWeekSalary(id, token)
        .then(res  => sectors = res.data.sectors)
        .catch(err => error = err.response?.data)


    if (sectors) {
        return {
            props: {
                sectors
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