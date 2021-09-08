import {Button, Col, Alert, Form, InputGroup, Row, Table, Modal} from "react-bootstrap"
import { MainLyout } from '../components/layout/main'
import React, {Component} from "react";
import Thead from "../modules/tables/thead";
import Tbody from "../modules/tables/tbody";
import {getOrder} from "../services/order/get";
import {withRouter} from "next/router";
import {changeKeyboard} from "../modules/change-keyboard";
import {getBarcodes} from "../services/at-order/get";

class AccTransOrder extends Component {

    constructor(props) {
        super(props);
        this.transferInput = React.createRef();
        this.acceptedInput = React.createRef();
        this.orderInput = React.createRef();
        this.commentInput = React.createRef();
    }

    state = {
        users: null,
        data: {
            transfer: {
                label: 'Передающий участок',
                id: 'transfer',
                name: '',
                value: '',
                disabled: false
            },
            accepted: {
                label: 'Принимающий участок',
                id: 'accepted',
                name: '',
                value: '',
                disabled: true
            },
            order: {
                label: 'Заказ',
                id: 'order',
                value: '',
                disabled: true,
                idOrder: '',
                nameOrder: '',
                statusOrder: '',
                hide: true
            }
        },
        orders: [],
        orderChange: {
            view: false,
            idOrder: '',
            nameOrder: '',
            comment: ''
        },
        form: {
            idTransfer: null,
            idAccepted: null,
            orders: []
        },
        hint: '',
        error: {
            type: false,
            message: ''
        },
        link: this.props.router.pathname
    }

    async componentDidMount() {
        this.addHint(1)

        if (this.props.barcodes) await this.setState(({users: this.props.barcodes}))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.state.data.transfer.name) {
            this.transferInput.current.focus()
        } else if (!this.state.data.accepted.name) {
            this.acceptedInput.current.focus()
        } else if (this.state.orderChange.view) {
            this.commentInput.current.focus()
        } else {
            this.orderInput.current.focus()
        }
    }

    // добавление ошибки
    addError = (message) => {
        this.setState(({error}) => {
            return (
                error.type = true,
                error.message = message
            )
        })
        setTimeout(this.clearError, 2000)
    }

    // добавление подсказки
    addHint = (id) => {
        const arrHint = [
            'Отсканируйте - Передающий участок',
            'Отсканируйте - Принимающий участок',
            'Отсканируйте - Заказ',
            'Введите комментарий к заказу',
        ]

        this.setState({hint: arrHint[id-1]})
    }

    // очистка ошибки
    clearError = () => {
        this.setState(({error}) => {
            return (
                error.type = false,
                error.message = ''
            )
        })
    }

    // удаление заказа из объекта заказов
    deleteOrder = (id) => {
        const {orders} = this.state
        let newArr = orders

        orders.map((item, i) => {
            if (item.idOrder === id) {
                newArr.splice(i, 1)
                return this.setState({orders: newArr})
            }
        })
    }

    //поиск и проверка передающей стороны
    handledTransfer = (value) => {
        const {users, data} = this.state
        let i = 0

        value = changeKeyboard(value)

        if (value) {
            if (value === data.accepted.value) {
                this.setState(({data}) => data.transfer.value='')
                this.addError('Участок был выбран ранее')
            } else {
                users.map(user => {
                    if(value === user.BARCODE) {
                        if(!this.state.data.accepted.name) {
                            this.setState(({data}) => {
                                return (
                                    data.transfer.name = `${user.SECTOR} / ${user.EMPLOYEE ? user.EMPLOYEE : '-'}`,
                                    data.transfer.disabled = true,
                                    data.accepted.disabled = false
                                )
                            })
                            this.addHint(2)
                        } else {
                            this.setState(({data}) => {
                                return (
                                    data.transfer.name = `${user.SECTOR} / ${user.EMPLOYEE ? user.EMPLOYEE : '-'}`,
                                    data.transfer.disabled = true,
                                    data.order.disabled = false
                                )

                            })
                            this.addHint(3)
                        }
                        i++
                    }
                })

                if (i === 0) {
                    this.setState(({data}) => data.transfer.value = '')
                    this.addError('Пользователь не найден')
                }
            }
        }
    }

    //поиск и проверка принимающей стороны
    handledAccept = (value) => {
        const {users, data} = this.state
        let i = 0

        value = changeKeyboard(value)

        if (value) {
            if (value === data.transfer.value) {
                this.setState(({data}) => data.accepted.value = '')
                this.addError('Участок был выбран ранее')
            } else {
                users.map(user => {
                    if(value === user.BARCODE) {
                        this.setState(({data}) => {
                            return (
                                data.accepted.name = `${user.SECTOR} / ${user.EMPLOYEE ? user.EMPLOYEE : '-'}`,
                                data.accepted.disabled = true,
                                data.order.disabled = false
                            )
                        })
                        this.addHint(3)
                        i++
                    }
                })

                if (i === 0) {
                    this.setState(({data}) => data.accepted.value = '')
                    this.addError('Пользователь не найден')
                }
            }
        }
    }

    //поиск и проверка заказа
    handledOrder = async () => {
        const {data} = this.state
        let order, error

        await getOrder(data.order.value)
            .then(res => order = res)
            .catch(err => error = err)

        if (order) {
            this.setState(({data}) => {
                return (
                    data.order.nameOrder = order.header[0].ITM_ORDERNUM,
                    data.order.idOrder = order.header[0].ID,
                    data.order.statusOrder = order.header[0].STATUS_DESCRIPTION
                )
            })
        } else {
            this.setState(({data}) => {
                return (
                    data.order.nameOrder = '',
                    data.order.idOrder = '',
                    data.order.commentOrder = '',
                    data.order.statusOrder = ''
                )
            })
        }
    }

    // отправка объекта с данными в базу
    handledSubmit = async (e) => {
        e.preventDefault()
        const {form, orders} = this.state
        let newOrders = []

        orders.map(order => {
            let obj = {}

            for (let key in order ) {
                if (
                    key === 'idOrder' ||
                    key === 'comment'
                ) {
                    obj[key] = order[key]
                }
            }

            newOrders.push(obj)
        })

        await this.setState(({form}) => {
            return (
                form.idTransfer = this.state.data.transfer.value,
                form.idAccepted = this.state.data.accepted.value,
                form.orders = newOrders
            )
        })

        console.log(form)
    }

    // очистка данных сохраненных в вводе
    clearValue = (area) => {
        if (area === 'transfer') {
            this.setState(({data, hint}) => {
                return (
                    data.transfer.value = '',
                    data.transfer.name = '',
                    data.transfer.disabled = false,
                    data.accepted.disabled = true,
                    data.order.disabled = true
                )
            })
            this.addHint(1)
        }

        if (area === 'accepted') {
            if(this.state.data.transfer.name) {
                this.setState(({data}) => {
                    return (
                        data.accepted.value = '',
                        data.accepted.name = '',
                        data.accepted.disabled = false,
                        data.transfer.disabled = true,
                        data.order.disabled = true
                    )
                })
                this.addHint(2)
            } else {
                this.setState(({data}) => {
                    return (
                        data.accepted.value = '',
                        data.accepted.name = ''
                    )
                })
                this.addHint(1)
            }
        }

        if (area === 'order') {
            this.setState(({data}) => {
                return (
                    data.order.nameOrder = '',
                    data.order.idOrder = '',
                    data.order.statusOrder = '',
                    data.order.value = ''
                )
            })
            this.addHint(3)
        }

        if (area === 'all') {
            this.setState({orders: []})
            this.setState(({data}) => {
                return (
                    data.transfer.value = '',
                    data.transfer.name= '',
                    data.transfer.disabled = false,
                    data.accepted.value = '',
                    data.accepted.name = '',
                    data.accepted.disabled = true,
                    data.order.nameOrder = '',
                    data.order.idOrder = '',
                    data.order.statusOrder = '',
                    data.order.value = '',
                    data.order.disabled = true
                )
            })
            this.addHint(1)
        }
    }

    // Добавление заказа в объект для таблицы
    addOrder = async () => {
        const {orders, data} = this.state,
            {order} = data
        let arrOrder = {},
            compare = false

        await this.handledOrder()

        if (order.idOrder) {
            for (let key in order) {
                if (key === 'idOrder' ||
                    key === 'nameOrder' ||
                    key === 'statusOrder') {
                    arrOrder[key] = order[key]
                }
            }

            arrOrder.comment = ''

            arrOrder.commentOrder =
                    <i
                        className='bi bi-pencil-square btn text-warning'
                        style={{fontSize: 20}}
                        onClick={() => this.onComment(arrOrder.idOrder)}
                    />

            arrOrder.employee = ''

            arrOrder.delOrder =
                <i
                    className="bi bi-trash-fill btn text-danger"
                    style={{fontSize: 24}}
                    onClick={() => this.deleteOrder(arrOrder.idOrder)}
                />

            if (order.value) {
                if (!orders[0]) {
                    this.setState({orders: [...this.state.orders, arrOrder]})
                } else {
                    orders.map(item => {
                        if (item.idOrder === arrOrder.idOrder) {
                            this.addError('Данный заказ уже находится в таблице')
                            compare = true
                        }
                    })

                    if (!compare) {
                        this.setState({orders: [...this.state.orders, arrOrder]})
                    }
                    compare = false
                }
            }
        } else this.addError(`Заказ № ${order.value} не существует`)

        this.clearValue('order')
    }

    // функция вызова изменения комментария заказа
    onComment = (id) => {
        const {orders} = this.state

        orders.map (order => {
            if (order.idOrder === id) {
                this.setState(({orderChange}) => {
                    return (
                        orderChange.view = true,
                        orderChange.idOrder = order.idOrder,
                        orderChange.nameOrder = order.nameOrder,
                        orderChange.comment = order.comment
                    )
                })
            }
        })

        this.addHint(4)
    }

    // функция изменения комментария заказа в объекте заказов
    changeCommentOrder = () => {
        const {orderChange} = this.state

        this.setState(({orders}) => {
            return orders.map(order => {
                if (order.idOrder === orderChange.idOrder) {
                    order.comment = orderChange.comment
                }
            })
        })

        this.setState(({orderChange}) => orderChange.view = false)
        this.addHint(3)
    }

    // Отображение страницы
    render() {
        const {data, hint, error, orders, orderChange} = this.state,
            {accepted, transfer, order} = data

        return (
            <MainLyout title='Форма приема-передачи заказа' link={this.state.link}>
                <h2 className='text-center fw-bold mb-3'>Форма приема-передачи заказа</h2>

                <Row>
                    <Col/>
                    <Col lg={5}>
                        <Alert
                            className={`p-1 mb-3 text-center ${error.type ? 'd-none' : ''}`}
                            variant='secondary'
                        >
                            {`${hint}`}
                        </Alert>
                        <Alert
                            className={`p-1 mb-3 text-center ${error.type ? '' : 'd-none'}`}
                            variant='danger'
                        >
                            {error.message ? error.message : '...'}
                        </Alert>
                    </Col>
                    <Col/>
                </Row>

                <Row>
                    <Col lg={5}>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `35%`, whiteSpace: 'normal'}}>{transfer.label}</InputGroup.Text>
                            <Form.Control
                                type="password"
                                id={transfer.id}
                                ref={this.transferInput}
                                onBlur={() => this.transferInput.current.focus()}
                                autoFocus
                                required
                                isValid={transfer.value}
                                isInvalid={!transfer.value}
                                value={transfer.value}
                                className={`border rounded-0 ${transfer.disabled ? 'd-none' : ''}`}
                                readOnly={transfer.disabled}
                                onChange={(e) =>
                                    this.setState(({data}) => data.transfer.value = e.target.value)
                                }
                                onKeyPress={e => {
                                    if (e.key === 'Enter') this.handledTransfer(e.target.value)
                                }}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={6} className='text-center text-secondary'>
                        <Alert
                            className={'p-1'}
                            variant={transfer.name ? 'success' : 'warning'}
                        >
                            {transfer.name ? transfer.name : '...'}
                        </Alert>
                    </Col>
                    <Col lg={1}>
                        <i
                            className="bi bi-trash-fill btn text-danger pt-0"
                            style={{fontSize: 24}}
                            onClick={() => this.clearValue('transfer')}
                        />
                    </Col>
                </Row>

                <Row>
                    <hr/>
                    <Col lg={5}>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `35%`, whiteSpace: 'normal'}}>{accepted.label}</InputGroup.Text>
                            <Form.Control
                                type="password"
                                id={accepted.id}
                                ref={this.acceptedInput}
                                onBlur={() => this.acceptedInput.current.focus()}
                                required
                                isValid={accepted.value}
                                isInvalid={!accepted.value}
                                value={accepted.value}
                                className={`border rounded-0 ${accepted.disabled ? 'd-none' : ''}`}
                                readOnly={accepted.disabled}
                                onChange={(e) =>
                                    this.setState(({data}) => data.accepted.value = e.target.value)
                                }
                                onKeyPress={e => {
                                    if (e.key === 'Enter') this.handledAccept(e.target.value)
                                }}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={6} className='text-center'>
                        <Alert
                            className={'p-1'}
                            variant={accepted.name ? 'success' : 'warning'}
                        >
                            {accepted.name ? accepted.name : '...'}
                        </Alert>
                    </Col>
                    <Col lg={1}>
                        <i
                            className="bi bi-trash-fill btn text-danger pt-0"
                            style={{fontSize: 24}}
                            onClick={() => this.clearValue('accepted')}
                        />
                    </Col>
                </Row>

                <Row className={this.state.data.order.hide ? 'hide-input' : ''}>
                    <hr/>
                    <Col lg={5} className='mb-3'>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `35%`, whiteSpace: 'normal'}}>{order.label}</InputGroup.Text>
                            <Form.Control
                                type="number"
                                id={order.id}
                                ref={this.orderInput}
                                onBlur={() => {
                                    if (!this.state.orderChange.view) this.orderInput.current.focus()
                                }}
                                required
                                isValid={order.nameOrder}
                                value={order.value}
                                className={`border rounded-0 ${order.disabled ? 'd-none' : ''}`}
                                readOnly={order.disabled}
                                onChange={e => {
                                    this.setState(({data}) => data.order.value = e.target.value)
                                }}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') this.addOrder()
                                }}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={5} className='text-center'/>
                    <Col lg={2} className='mb-3 text-center'>
                        <Button
                            variant='link'
                            type='button'
                            onClick={() => this.setState(({data}) => data.order.hide = true)}
                        >Скрыть поле</Button>
                    </Col>
                </Row>

                <Row className={`${this.state.data.order.hide ? '' : 'hide-input'}`}>
                    <hr className='m-0'/>
                    <Col lg={10}/>
                    <Col lg={2} className='text-end'>
                        <Button
                            variant='link'
                            type='button'
                            style={{fontSize: 10}}
                            className='p-0'
                            onClick={() => this.setState(({data}) => data.order.hide = false)}
                        >Не читается штрих-код заказа</Button>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <Table>
                            <Thead
                                title={['Наименование заказа', 'Статус заказа', 'Комментарий к заказу', 'Работник', '']}
                            />
                            <Tbody
                                params={['nameOrder', 'statusOrder',  ['comment', 'commentOrder'], 'employee', 'delOrder']}
                                orders={orders}
                            />
                        </Table>
                    </Col>
                </Row>

                <Row>
                    <hr/>
                    <Col lg={6} className='text-start'>
                        <Button
                            variant='outline-danger'
                            type='button'
                            onClick={e => this.clearValue('all')}
                        >Очистить форму</Button>
                    </Col>
                    <Col lg={6} className='text-end'>
                        <Button
                            variant='outline-success'
                            type='button'
                            onClick={e => this.handledSubmit(e)}
                        >Сохранить данные</Button>
                    </Col>
                </Row>

                <Modal show={this.state.orderChange.view} centered>
                    <Modal.Header className='text-center d-block'>
                        {`Введите комментарий к заказу - ${orderChange.nameOrder}`}
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control
                            type="text"
                            ref={this.commentInput}
                            onBlur={() => this.commentInput.current.focus()}
                            value={orderChange.comment}
                            className='border rounded-0'
                            onChange={e => this.setState(({orderChange}) => orderChange.comment = e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') this.changeCommentOrder()
                            }}
                        />
                    </Modal.Body>
                </Modal>
            </MainLyout>
        )
    }
}

export default withRouter(AccTransOrder)

export async function getServerSideProps() {

    let barcodes, error

    await getBarcodes()
        .then(res  => barcodes = res.data.barcodes)
        .catch(err => error = JSON.stringify(err))

    if (barcodes) {
        return {
            props: {
                barcodes
            }
        }
    }

    if (error) {
        return {
            props: {
                error
            }
        }
    }
}
