import {Button, Col, Alert, Form, InputGroup, Row, Table} from "react-bootstrap"
import { MainLyout } from '../components/layout/main'
import React, {Component} from "react";
import Thead from "../modules/tables/thead";
import Tbody from "../modules/tables/tbody";
import {getOrder} from "../services/order/get";
import ModalError from "../modules/modals/modal-error";

export default class AccTransOrder extends Component {

    constructor(props) {
        super(props);
        this.transferInput = React.createRef();
        this.acceptedInput = React.createRef();
        this.orderInput = React.createRef();
    }

    state = {
        users: [
            {
                code: '225658458',
                name: 'Тестовый пользователь'
            },
            {
                code: '158654854',
                name: 'Тестовый пользователь 2'
            }
        ],
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
                commentOrder: ''
            }
        },
        orders: [],
        form: {
            idTransfer: null,
            idAccepted: null,
            idOrders: []
        },
        renderID: 0,
        hint: 'Передающий участок',
        error: {
            type: false,
            message: ''
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.state.data.transfer.name) {
            this.transferInput.current.focus()
        } else if (!this.state.data.accepted.name) {
            this.acceptedInput.current.focus()
        } else {
            this.orderInput.current.focus()
        }
    }

    // ререндер страницы
    rerenderPage = () => {
        this.setState({renderID: this.state.renderID + 1})
    }

    addError = (message) => {
        this.setState(({error}) => {
            error.type = true,
            error.message = message
        })
        setTimeout(this.clearError, 2000)
    }

    // очистка ошибки
    clearError = () => {
        this.setState(({error}) => {
            error.type = false,
                error.message = ''
        })
        this.rerenderPage()
    }

    // удаление заказа из объекта заказов
    deleteOrder = (id) => {
        let newArr = this.state.orders

        this.state.orders.map((item, i) => {
            if (item.idOrder === id) {
                newArr.splice(i, 1)
                this.setState({orders: newArr})
            }
        })
    }

    //поиск и проверка передающей стороны
    handledTransfer = (value) => {
        const {users} = this.state

        if (value === this.state.data.accepted.value) {
            this.setState(({data}) => {
                data.transfer.value=''
            })
            this.addError('Участок был выбран ранее')
        } else {
            users.map(user => {
                if(value === user.code) {
                    if(!this.state.data.accepted.name) {
                        this.setState(({data}) => {
                            data.transfer.name = user.name,
                                data.transfer.disabled = true,
                                data.accepted.disabled = false
                        })
                        this.setState({hint: 'Принимающий участок'})
                    } else {
                        this.setState(({data, hint}) => {
                            data.transfer.name = user.name,
                            data.transfer.disabled = true,
                            data.order.disabled = false
                        })
                        this.setState({hint: 'Заказы'})
                    }
                }
            })
        }
    }

    //поиск и проверка принимающей стороны
    handledAccept = (value) => {
        const {users} = this.state

        if (value === this.state.data.transfer.value) {
            this.setState(({data}) => {
                data.accepted.value = ''
            })
            this.addError('Участок был выбран ранее')
        } else {
            users.map(user => {
                if(value === user.code) {
                    this.setState(({data, hint}) => {
                        data.accepted.name = user.name,
                        data.accepted.disabled = true,
                        data.order.disabled = false
                    })
                    this.setState({hint: 'Заказы'})
                }
            })
        }
    }

    //поиск и проверка заказа
    handledOrder = async (value) => {
        const {users} = this.state
        let order, error

        await getOrder(value)
            .then(res => order = res)
            .catch(err => error = err)

        if (order) {
            this.setState(({data}) => {
                data.order.nameOrder = order.header[0].ORDERNUM,
                data.order.idOrder = order.header[0].ID,
                data.order.commentOrder = order.header[0].PRIMECH,
                data.order.statusOrder = order.header[0].STATUS_DESCRIPTION
            })
        } else {
            this.setState(({data}) => {
                data.order.nameOrder = `Заказ с № ${value} не существует в базе`,
                data.order.idOrder = '',
                data.order.commentOrder = '',
                data.order.statusOrder = ''
            })
        }

        this.rerenderPage()
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
                    key === 'nameOrder' ||
                    key === 'employee'
                ) {
                    obj[key] = order[key]
                }
            }

            newOrders.push(obj)
        })

        await this.setState(({form}) => {
            form.idTransfer = this.state.data.transfer.value,
            form.idAccepted = this.state.data.accepted.value,
            form.idOrders = newOrders
        })

        console.log(form)

        alert('Заказы успешно переданы на следующи этап обработки')
        this.rerenderPage()
    }

    //очистка данных сохраненных в вводе
    clearValue = (area) => {
        if (area === 'transfer') {
            this.setState(({data, hint}) => {
                data.transfer.value = '',
                data.transfer.name = '',
                data.transfer.disabled = false,
                data.accepted.disabled = true,
                data.order.disabled = true
            })
            this.setState({hint: 'Передающий участок'})
        }

        if (area === 'accepted') {
            if(this.state.data.transfer.name) {
                this.setState(({data, hint}) => {
                    data.accepted.value = '',
                    data.accepted.name = '',
                    data.accepted.disabled = false,
                    data.transfer.disabled = true,
                    data.order.disabled = true
                })
                this.setState({hint: 'Принимающий участок'})
            } else {
                this.setState(({data}) => {
                    data.accepted.value = '',
                    data.accepted.name = ''
                })
                this.setState({hint: 'Передающий участок'})
            }
        }

        if (area === 'order') {
            this.setState(({data}) => {
                data.order.nameOrder = '',
                data.order.idOrder = '',
                data.order.commentOrder = '',
                data.order.statusOrder = '',
                data.order.value = ''
            })
        }

        this.rerenderPage()
    }

    // Добавление заказа в объект для таблицы
    addOrder = () => {
        const {orders, data} = this.state,
            {order} = data
        let arrOrder = {},
            compare = false

        for (let key in order) {
            if (key === 'idOrder' ||
                key === 'nameOrder' ||
                key === 'commentOrder' ||
                key === 'statusOrder') {
                arrOrder[key] = order[key]
            }
        }

        arrOrder.employee = ''

        arrOrder.delOrder = <Button variant='outline-danger' type='button' onClick={() => this.deleteOrder(arrOrder.idOrder)}>Удалить</Button>

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

        this.clearValue('order')

        this.rerenderPage()
    }

    // Отображение страницы
    render() {
        const {data, hint, error, orders} = this.state,
            {accepted, transfer, order} = data

        return (
            <MainLyout title='Форма приема-передачи заказа'>
                <h2 className='text-center fw-bold mb-3'>Форма приема-передачи заказа</h2>

                <Row>
                    <Col/>
                    <Col lg={5}>
                        <Alert
                            className={`p-1 mb-3 text-center ${error.type ? 'd-none' : ''}`}
                            variant='secondary'
                        >
                            {`Заполните - ${hint}`}
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
                    <Col lg={5} className='mb-3'>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `225px`}}>{transfer.label}</InputGroup.Text>
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
                                onChange={(e) => {
                                    this.setState(({data}) => data.transfer.value = e.target.value)
                                    this.handledTransfer(e.target.value)
                                }}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={5} className='text-center text-secondary'>
                        <Alert
                            className={transfer.name ? 'p-1' : ''}
                            variant={transfer.name ? 'success' : 'warning'}
                        >
                            {transfer.name}
                        </Alert>
                    </Col>
                    <Col lg={2} className='mb-3'>
                        <Button
                            variant='outline-danger'
                            type='button'
                            onClick={() => this.clearValue('transfer')}
                        >Очистить участок</Button>
                    </Col>

                    <hr/>
                    <Col lg={5} className='mb-3'>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `225px`}}>{accepted.label}</InputGroup.Text>
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
                                onChange={(e) => {
                                    this.setState(({data}) => data.accepted.value = e.target.value)
                                    this.handledAccept(e.target.value)
                                }}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={5} className='text-center'>
                        <Alert
                            className={accepted.name ? 'p-1' : ''}
                            variant={accepted.name ? 'success' : 'warning'}
                        >
                            {accepted.name}
                        </Alert>
                    </Col>
                    <Col lg={2} className='mb-3'>
                        <Button
                            variant='outline-danger'
                            type='button'
                            onClick={() => this.clearValue('accepted')}
                        >Очистить участок</Button>
                    </Col>

                    <hr/>
                    <Col lg={5}>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `225px`}}>{order.label}</InputGroup.Text>
                            <Form.Control
                                type="password"
                                id={order.id}
                                ref={this.orderInput}
                                onBlur={() => this.orderInput.current.focus()}
                                required
                                isValid={order.nameOrder}
                                value={order.value}
                                className={`border rounded-0 ${order.disabled ? 'd-none' : ''}`}
                                readOnly={order.disabled}
                                onChange={e => {
                                    this.setState(({data}) => data.order.value = e.target.value)
                                    this.handledOrder(e.target.value)
                                }}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') this.addOrder()
                                }}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={5} className='text-center'>
                        <Alert
                            className={`p-1`}
                            variant={order.idOrder ? 'success' : 'warning'}
                        >
                            {order.nameOrder ? order.nameOrder : '...'}
                        </Alert>
                    </Col>
                    <Col lg={2}>
                        <Button
                            variant='outline-danger'
                            type='button'
                            onClick={() => this.clearValue('order')}
                        >Очистить заказ</Button>
                    </Col>

                    <hr/>
                    <Col lg={12}>
                        <Table>
                            <Thead
                                title={['ID', 'Наименование заказа', 'Статус заказа', 'Комментарий', 'Работник', '']}
                            />
                            <Tbody
                                params={['idOrder', 'nameOrder', 'statusOrder',  'commentOrder', 'employee', 'delOrder']}
                                orders={orders}
                            />
                        </Table>
                    </Col>

                    <hr/>
                    <Col lg={12} className='text-end'>
                        <Button
                            variant='outline-success'
                            type='button'
                            onClick={e => this.handledSubmit(e)}
                        >Сохранить данные</Button>
                    </Col>
                </Row>
            </MainLyout>
        )
    }
}
