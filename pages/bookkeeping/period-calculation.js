import React, {Component} from "react";
import {Button, Col, Form, InputGroup, ListGroup, Row, Table} from "react-bootstrap";
import Thead from "../../modules/tables/thead";
import Link from "next/link";
import {MainLayout} from "../../components/layout/main";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../modules/cookie";
import {getWeekSalary} from "../../services/journals/get";

class BookkeepingCalc extends Component {

    state = {
        sectors: null,
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
        activeSalary: 'period-calculation',
        allSectors: [],
        sector: '',
        link: null,
        journalID: null,
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        this.setState({journalID: this.props.router.query.id})
        if (this.props.sectors[0]) this.setState({sectors: this.props.sectors})
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

    // создание массива секторов
    addSectors = () => {
        const {sectors} = this.props

        let allSectors = []

        sectors.map(sector => {
            allSectors.push(sector.name)
        })

        this.setState({allSectors})
        this.setState({sector: allSectors[0]})
    }

    // расчет итога по работам
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

    // расчет премий по работам
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

    // расчет итоговой площади
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

    // расчет итоговой запралты
    addTotalCost = () => {
        const total = this.state.total
        let allCost = 0

        for (let key in total.cost) {
            allCost += total.cost[key]
        }

        this.setState(({total}) => total.allCost = Math.round(allCost * 100) / 100)
    }

    // расчет итогового штрафа
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

    //расчет итоговой премии
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

    // просчет итогового результаты оплаты
    addResult = () => {
        const {total} = this.state
        let res

        res = total.allCost + total.allPrem - total.allPenalty

        this.setState(({total}) => total.result = Math.round(res * 100) / 100)
    }

    // отображение расчет по каждому заказу
    renderWeekSalary = () => {
        const {sectors} = this.state
        let line = [], cell

        let allCells = []

        return sectors.map((item, i) => {
            if (item.name === this.state.sector) {
                item.orders.map((order, oI) => {
                    cell = [
                        <td key={`${oI}_1`} className='' width={'3%'}>{oI + 1}</td>,
                        <td key={`${oI}_2`} className=''>
                            <Link href={`/order/${order.id}`}>
                                <a className={`text-decoration-none ${order.isDeleted ? 'text-light' : 'text-dark'}`}>
                                    {order.itmOrderNum}
                                </a>
                            </Link>

                        </td>,
                        <td key={`${oI}_3`} className='' width={'9%'}>{Math.round(order.works[0].square*1000)/1000}</td>
                    ]

                    allCells = [...cell]

                    order.works.map((work, wI) => {
                        if (!work.work.includes('Надбавка')) {
                            for (let key in work) {
                                if (key === 'money') {
                                    cell = <td key={wI} className={`${work.isDeleted ? 'bg-danger text-light' : ''}`} width={'10%'}>
                                        <Row>
                                            <Col style={work.isDeleted ? {textDecoration: 'line-through'} : null}>
                                                {Math.round(work[key]*100)/100} ₽
                                            </Col>
                                            {work.isDeleted
                                                ? (
                                                    <Col lg={3}>
                                                        <Form.Check
                                                            disabled={work.optional}
                                                            value={work.isDeleted}
                                                            onChange={(e) => {
                                                                this.setState(({sectors}) => {
                                                                    return (
                                                                        sectors[i].orders[oI].works[wI].isDeleted = e.target.checked ? 1 : 0
                                                                    )
                                                                })
                                                            }}
                                                        />
                                                    </Col>
                                                ) : null}
                                        </Row>
                                    </td>

                                    allCells.push(cell)
                                }
                            }
                        }
                    })

                    cell = <td key={`${oI}_del`}>
                        <Row>
                            <Col>
                                <Form.Check
                                    value={order.isDeleted}
                                    onChange={(e) => {
                                        this.setState(({sectors}) => {
                                            return (
                                                sectors[i].orders[oI].isDeleted = e.target.checked ? 1 : 0
                                            )
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                    </td>

                    allCells.push(cell)

                    line.push(
                        <tr
                            className={`text-center ${order.isDeleted ? 'bg-danger text-light' : 'bg-light text-dark'}`}
                            style={order.isDeleted ? {textDecoration: 'line-through'} : null}
                            key={oI}
                        >
                            {allCells}
                        </tr>
                    )
                })
            }
            return line
        })
    }

    // отображение заголовка таблицы
    renderHeaderTable = () => {
        const {sectors} = this.props
        let header = ['№', 'Наименование', 'Площадь']

        sectors.map(item => {
            item.orders[0].works.map(work => {
                if (!work.work?.includes('Надбавка')) {
                    header = [...header, work.work]
                }
            })
        })

        header.push('X')

        this.setState({headerTable: header})
    }

    // отображение итоговой информации по каждой работе
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

    // отображение премий
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

    // отображение штрафов
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
        const {headerTable, total, link, sector, allSectors} = this.state
        const {sectors} = this.props

        return (
            <MainLayout title={`Предварительный расчет`} link={link} token={this.props.token} error={this.props.error}>
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
                        <Col />
                        <Col lg={5} className='text-end'>
                            <Button
                                className='me-3'
                                variant='danger'>
                                    Добавить штрафы
                            </Button>
                            <Button
                                className='me-3'
                                variant='success'>
                                    Подписать и отправить
                            </Button>
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
            </MainLayout>
        )
    }
}

export default withRouter(BookkeepingCalc)

export async function getServerSideProps({req}) {

    const token = getTokenCookies(req.headers.cookie)
    const id = 5

    let sectors = [], error

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