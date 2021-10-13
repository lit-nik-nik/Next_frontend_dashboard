import React, {Component} from "react";
import {Button, Col, Form, InputGroup, ListGroup, Modal, Row, Table} from "react-bootstrap";
import Thead from "../../modules/tables/thead";
import Link from "next/link";
import {MainLayout} from "../../components/layout/main";
import Router, {withRouter} from "next/router";
import {getTokenCookies} from "../../modules/cookie";
import {getWeekSalary} from "../../services/journals/get";
import ModalBookkeeping from "../../modules/modals/modal-bookkeeping";
import {patchTransaction} from "../../services/journals/patch";

class BookkeepingCalc extends Component {

    state = {
        sector: '',
        sectorData: null,
        headerTable: [],
        paramsTable: [],
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
        disableSector: false,
        disabledRestore: false,
        link: null,
        journalID: null,
        render: 0,
        modal: false,
        changeSector: false,
        submitModal: {
            show: false,
            text: ''
        }
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        this.setState({journalID: this.props.router.query.id})
        await this.addSectors()

        this.props.sectors.map(async sector => {
            if (sector.name === this.state.sector) await this.setState({sectorData: sector})
        })

        this.addHeaderTable()
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            await this.addSectors()

            this.addHeaderTable()
        }

        if (this.state.sector !== prevState.sector) {
            this.setState({sectorData: null})

            this.props.sectors.map(async sector => {
                if (sector.name === this.state.sector) await this.setState({sectorData: sector})
            })
        }

        if (this.state.sectorData !== prevState.sectorData || this.state.sector !== prevState.sector || this.state.render !== prevState.render) {
            await this.addWork()
            await this.addPrem()
            await this.addTotalSquare()
            await this.addTotalCost()
            await this.addTotalPrem()
            await this.addTotalPenalty()
            await this.addResult()
            await this.disabledSector()
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

    // создание заголовков таблицы
    addHeaderTable = () => {
        const {sectorData} = this.state
        let header = ['№', 'Наименование', 'Площадь'],
            params = []

        if (sectorData) {
            sectorData.orders[0].works.map(work => {
                if (!work.work?.includes('Надбавка')) {
                    header = [...header, work.work]
                    params = [...params, work.work]
                }
            })
        }

        header.push('X')

        this.setState({headerTable: header})
        this.setState({paramsTable: params})
    }

    // добавление штрафов/премий
    addPenaltyPrem = (arr) => {
        this.setState(({sectorData}) => sectorData.otherTransactoins.data = arr)

        this.setState({render: this.state.render + 1})
    }

    // расчет итога по работам
    addWork = () => {
        const {sectorData} = this.state
        let totalCost = {
            selection: 0,
            gash: 0,
            masterJohn: 0,
            vayma: 0,
            fifth: 0,
            final: 0
        }

        if (sectorData) {
            sectorData.orders.map((order, oI) => {
                if (!order.isDeleted) {
                    order.works.map(work => {
                        if (!work.isDeleted) {
                            if (work.work === 'Подбор') totalCost.selection = totalCost.selection ? totalCost.selection + work.money : work.money
                            else if (work.work === 'Запил') totalCost.gash = totalCost.gash ? totalCost.gash + work.money : work.money
                            else if (work.work === 'Мастер Джон') totalCost.masterJohn = totalCost.masterJohn ? totalCost.masterJohn + work.money : work.money
                            else if (work.work === 'Вайма') totalCost.vayma = totalCost.vayma ? totalCost.vayma + work.money : work.money
                            else if (work.work === 'Пятый') totalCost.fifth = totalCost.fifth ? totalCost.fifth + work.money : work.money
                            else if (work.work === 'Финальная очистка фасада') totalCost.final = totalCost.final ? totalCost.final + work.money : work.money
                        }
                    })
                }
            })
        }

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
        const {sectorData} = this.state
        let totalPrem = [],
            objPrem = {}

        if (sectorData) {
            sectorData.orders.map((order, oI) => {
                if(!order.isDeleted) {
                    order.works.map(work => {
                        if (!work.isDeleted) {
                            if (work.work === 'Надбавка Фин. очистка фасада') {
                                objPrem.label = work.work
                                objPrem.cost = objPrem.cost ? objPrem.cost + work.money : work.money
                            }
                        }
                    })
                }
            })
        }

        if (objPrem.cost) {
            objPrem.cost = Math.round(objPrem.cost * 100) / 100
            totalPrem.push(objPrem)
            objPrem = {}
        }

        if (sectorData) {
            sectorData.orders.map((order, oI) => {
                if (!order.isDeleted) {
                    order.works.map(work => {
                        if (!work.isDeleted) {
                            if (work.work === 'Надбавка Мастер Джон') {
                                objPrem.label = work.work
                                objPrem.cost = objPrem.cost ? objPrem.cost + work.money : work.money
                            }
                        }
                    })
                }
            })
        }

        if (objPrem.cost) {
            objPrem.cost = Math.round(objPrem.cost * 100) / 100
            totalPrem.push(objPrem)
            objPrem = {}
        }

        if (sectorData) {
            sectorData.otherTransactoins.data.map(penalty => {
                if (penalty.modifer === 1) {
                    objPrem.description = penalty.description
                    objPrem.userName = penalty.userName
                    objPrem.label = `${penalty.userName}: ${penalty.description}`
                    objPrem.cost = +penalty.amount

                    if (objPrem.cost) {
                        objPrem.cost = Math.round(objPrem.cost * 100) / 100
                        totalPrem.push(objPrem)
                        objPrem = {}
                    }
                }
            })
        }

        this.setState(({total}) => total.premium = totalPrem)
    }

    // расчет итоговой площади
    addTotalSquare = () => {
        const {sectorData} = this.state
        let totalSquare = 0

        if (sectorData) {
            sectorData.orders.map(order => {
                if (!order.isDeleted) {
                    totalSquare += +order.works[0].square
                }
            })
        }

        this.setState(({total}) => total.square = Math.round(totalSquare * 1000) / 1000)
    }

    // расчет итоговой зарплаты
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
        const {sectorData} = this.state
        let allPenalty = 0

        if (sectorData) {
            sectorData.otherTransactoins.data.map(penalty => {
                if (penalty.modifer === -1) {
                    allPenalty += +penalty.amount
                }
            })
        }

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
    renderWeekSalary = (data) => {
        let line = [], cell, allCells = []

        if (data) {
            data.orders.map((order, oI) => {
                cell = [
                    <td key={`${oI}_1`} className='' width={'3%'}>{oI + 1}</td>,
                    <td key={`${oI}_2`} className='text-start'>
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
                                cell = <td key={wI} className={`${work.isDeleted ? 'bg-secondary text-light' : ''}`} width={'10%'}>
                                    <Row>
                                        <Col className={work.isDeleted ? 'text-decoration-line-through' : null}>
                                            {Math.round(work[key]*100)/100} ₽
                                        </Col>
                                        {this.state.changeSector
                                            ? (
                                                <Col lg={3}>
                                                    <Form.Check
                                                        disabled={!work.optional}
                                                        checked={work.isDeleted}
                                                        onChange={(e) => {
                                                            this.setState(({sectorData}) => {
                                                                return (
                                                                    sectorData.orders[oI].works[wI].isEdited = 1,
                                                                        sectorData.orders[oI].works[wI].isDeleted = e.target.checked ? 1 : 0
                                                                )
                                                            })
                                                            this.setState({render: this.state.render + 1})
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
                            {this.state.changeSector ?
                                <Form.Check
                                    checked={order.isDeleted}
                                    onChange={(e) => {
                                        this.setState(({sectorData}) => {
                                            return (
                                                sectorData.orders[oI].isDeleted = e.target.checked ? 1 : 0
                                            )
                                        })
                                        this.setState({render: this.state.render + 1})
                                    }}
                                /> : null}
                        </Col>
                    </Row>
                </td>

                allCells.push(cell)

                line.push(
                    <tr
                        className={`text-center ${order.isDeleted ? 'bg-secondary text-light text-decoration-line-through' : 'bg-light text-dark'}`}
                        key={oI}
                    >
                        {allCells}
                    </tr>
                )
            })
        }

        return line
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
                    <Row>
                        <Col>
                            {total.cost[key]} ₽
                        </Col>
                    </Row>
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
                    variant='success'
                    key={key}
                    className='text-start'
                >

                    <Row>
                        <Col>
                            {object[key].label} - <b>{object[key].cost} ₽</b>
                        </Col>
                        <Col lg={2} className='text-end'>
                            <i
                                className="bi bi-x-octagon text-danger"
                                onClick={() => this.delPenaltyPrem(object[key].description ? object[key] : object[key].label, object[key].label.includes('Надбавка') ? 'work' : 'other')}
                            />
                        </Col>
                    </Row>

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

                        <Row>
                            <Col>
                                {penalty.userName}: {penalty.description} - <b>{penalty.amount} ₽</b>
                            </Col>
                            <Col lg={2} className='text-end'>
                                <i
                                    className="bi bi-x-octagon text-danger"
                                    onClick={() => this.delPenaltyPrem(penalty, 'other')}
                                />
                            </Col>
                        </Row>

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

    // модификация заголовков
    modifyHeader = (name) => {
        const {paramsTable} = this.state

        return paramsTable.map(param => {
            if (param === name) {
                return (
                    <Col lg={3}>
                        <Form.Check
                            onChange={(e) => {
                                this.setState(({sectorData}) => {
                                    sectorData.orders.map(order => {
                                        order.works.map(work => {
                                            if (work.work === param) {
                                                return (
                                                    work.isEdited = 1,
                                                    work.isDeleted = e.target.checked ? 1 : 0
                                                )
                                            }
                                        })
                                    })
                                })
                                this.setState({render: this.state.render + 1})
                            }}
                        />
                    </Col>
                )
            }
        })


    }

    // удаление премии/штрафа
    delPenaltyPrem = async (label, type) => {
        let sectorData = this.state.sectorData,
            data = sectorData.otherTransactoins.data

        if (type === 'work') {
            sectorData.orders.map(order => {
                order.works.map(work => {
                    if(work.work === label) {
                        work.isDeleted = 1
                        work.isEdited = 1
                    }
                })
            })

            this.setState({disabledRestore: true})
        }

        if (type === 'other') {
            data.map((item, i) => {
                if (item.description === label.description) {
                    if (item.userName === label.userName) {
                        if (label.cost) {
                            if (item.amount === label.cost) {
                                data = [...data.slice(0, i), ...data.slice(i + 1)]

                                sectorData.otherTransactoins.data = data
                            }
                        } else {
                            if (item.amount === label.amount) {
                                data = [...data.slice(0, i), ...data.slice(i + 1)]

                                sectorData.otherTransactoins.data = data
                            }
                        }
                    }
                }
            })
        }

        await this.setState({sectorData})

        await this.setState({render: this.state.render + 1})
    }

    // отключение выбора сектора
    disabledSector = () => {
        const {sectorData} = this.state

        if (sectorData) {
            sectorData.orders.map(order => {
                if (order.isDeleted) this.setState({disableSector: true})

                order.works.map(work => {
                    if (work.isDeleted || work.isEdited) this.setState({disableSector: true})
                })
            })

            if (sectorData.otherTransactoins.data[0]) this.setState({disableSector: true})
        }
    }

    // восстановление надбавок
    restorePrem = () => {
        const {sectorData} = this.state

        sectorData.orders.map(order => {
            order.works.map(work => {
                if(work.work.includes('Надбавка')) {
                    work.isDeleted = 0
                }
            })
        })

        this.setState({sectorData})

        this.setState({disabledRestore: false})

        this.setState({render: this.state.render + 1})
    }

    // сохранение транзакции
    submitTransaction = async () => {
        const {sectorData} = this.state
        let data = { sectors: [] }

        data.sectors.push(sectorData)

        this.setState({disableSector: false})
        this.setState({changeSector: false})

        await patchTransaction(this.props.token, data)
            .then(res => {
                console.log(res)
                if (res.status === 201) {
                    this.setState(({submitModal}) => {
                        return (
                            submitModal.show = true,
                            submitModal.text = res.data.transaction.ID
                        )
                    })

                    const redirect = () => Router.push(`/transaction/${res.data.transaction.ID}`)

                    setTimeout(redirect, 2000)
                }
            })
            .catch(err => console.log(err.response))

    }

    render() {
        const {headerTable, total, link, sector, allSectors, sectorData, disableSector, disabledRestore, submitModal} = this.state

        return (
            <MainLayout title={`Предварительный расчет`} link={link} token={this.props.token} error={this.props.error}>
                    <Row className='sticky-top bg-white pt-3 shadow' style={{top: '60px', zIndex: 1}}>
                        <Col lg={4}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Выберите участок</InputGroup.Text>
                                <Form.Select
                                    disabled={disableSector}
                                    value={sector}
                                    onChange={(e) => {
                                        this.setState({sector: e.target.value})
                                    }}>
                                    {allSectors.map((sector, i) => {
                                        return (
                                            <option value={sector} key={i}>{sector}</option>
                                        )
                                    })}
                                </Form.Select>
                            </InputGroup>
                        </Col>
                        <Col />
                        <Col lg={6} className='text-end'>
                            <Button
                                className='me-2'
                                variant='warning'
                                onClick={() => this.setState({changeSector: !this.state.changeSector})}
                            >
                                {this.state.changeSector ? 'Заблокировать изменения' : 'Изменить расчет'}
                            </Button>
                            <Button
                                className='me-2'
                                variant='info'
                                onClick={() => this.setState({modal: true})}
                            >
                                Доплаты / Удержания
                            </Button>
                            <Button
                                className='me-2'
                                variant='success'
                                onClick={() => this.submitTransaction()}
                            >
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
                                    <Table bordered className='my-3' size='sm'>
                                        <thead className='align-middle text-center'>
                                            <tr>
                                                {headerTable.map((name, index) =>
                                                    <th key={index}>
                                                        <Row>
                                                            <Col>
                                                                {name}
                                                            </Col>
                                                            {this.state.changeSector ?
                                                                this.modifyHeader(name) : null}
                                                        </Row>
                                                    </th>
                                                )}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {this.renderWeekSalary(sectorData)}
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
                                        {disabledRestore ?
                                            <Button
                                                variant='outline-secondary'
                                                className='w-100'
                                                onClick={() => this.restorePrem()}
                                            >
                                                Восстановить надбавки
                                            </Button>
                                            : null}

                                        {this.renderListPrem(total.premium)}
                                    </Col>
                                    : null
                                }

                                {sectorData
                                    ? <Col>
                                        <h3 className='text-start mb-3'>Удержания:</h3>
                                        <hr/>
                                        {this.renderListPenalty(sectorData.otherTransactoins.data)}
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

                <ModalBookkeeping
                    show = {this.state.modal}
                    otherTransactoins = {sectorData?.otherTransactoins}
                    data = {sectorData ? sectorData.otherTransactoins.data : []}
                    addPenaltyPrem = {this.addPenaltyPrem}
                    message={'Доплаты и удержания'}
                    onHide={() => this.setState({modal: false})}
                />

                <Modal centered show={submitModal.show} onHide={() => this.setState(({submitModal}) => submitModal.show = false)}>
                    <Modal.Header closeButton>
                        <h3 className='text-center w-100'>Расчет сохранен!</h3>
                    </Modal.Header>
                    <Modal.Body>
                        <p className='text-success text-center'>
                            Номер транзакции - {submitModal.text}
                        </p>
                        <p className='text-center text-muted' style={{fontSize: '10px'}}>На новую транзакцию вы будете перенаправлены через 2 сек</p>
                    </Modal.Body>
                </Modal>
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