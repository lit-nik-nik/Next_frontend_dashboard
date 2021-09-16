import {Button, Col, Alert, Form, InputGroup, Row, Table, Modal} from "react-bootstrap"
import { MainLyout } from '../components/layout/main'
import React, {Component} from "react";
import Thead from "../modules/tables/thead";
import Tbody from "../modules/tables/tbody";
import {getOrder} from "../services/order/get";
import {withRouter} from "next/router";
import {changeKeyboard} from "../modules/change-keyboard";
import {getBarcodes} from "../services/at-order/get";
import {postAtOrders} from "../services/at-order/post";
import ModalError from "../modules/modals/modal-error";
import ModalWindow from "../modules/modals/modal";
import {log10} from "chart.js/helpers";

class AccTransOrder extends Component {

    constructor(props) {
        super(props);
        this.transferInput = React.createRef();
        this.acceptedInput = React.createRef();
        this.orderInput = React.createRef();
        this.commentInput = React.createRef();
        this.dateInput = React.createRef();
    }

    state = {
        link: null,
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
            },
            date: {
                tzoffset: new Date().getTimezoneOffset() * 60000,
                label: 'Дата',
                id: 'data',
                value: null,
                isoValue: null,
                disabled: true,
                hide: true,
                update: null
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
            date: null,
            orders: []
        },
        hint: '',
        error: {
            view: false,
            message: ''
        },
        submit: {
            data: {
                view: false,
                message: null,
                orders: []
            },
            error: {
                view: false,
                message: null
            }
        },
        test: null
    }

    async componentDidMount() {
        if (this.props.error) {
            if (JSON.parse(this.props.error).code === "ECONNREFUSED") {
                this.setState(({error}) => {
                    return (
                        error.view = true,
                        error.message =  'Ошибка подключения к серверу. Попробуйте позже'
                    )
                })
            }
        }

        this.addHint(1)

        this.handlesDate()

        this.setState({link: this.props.router.pathname})

        if (this.props.barcodes) await this.setState(({users: this.props.barcodes}))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {data, orderChange} = this.state

        if(!data.transfer.name) this.transferInput.current.focus()
        else if (!data.accepted.name) this.acceptedInput.current.focus()
        else if (orderChange.view) this.commentInput.current.focus()
        else if (!data.date.disabled) this.dateInput.current.focus()
        else this.orderInput.current.focus()
    }

    componentWillUnmount() {
    }

    // добавление ошибки
    addError = (message, time = 2000) => {
        this.setState(({error}) => {
            return (
                error.type = true,
                error.message = message
            )
        })
        setTimeout(this.clearError, time)
    }

    // добавление подсказки
    addHint = (id) => {
        const arrHint = [
            'Отсканируйте - Передающий участок',
            'Отсканируйте - Принимающий участок',
            'Отсканируйте - Заказ',
            'Введите комментарий к заказу',
            'Введите дату'
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
            } else  {
                users.map(user => {
                    if (value === user.BARCODE) {
                        if (user.BLOCKED) {
                            this.setState(({data}) => data.transfer.value = '')
                            this.addError('Пользователь заблокирован')
                            i++
                        } else {
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
                        if (user.BLOCKED) {
                            this.setState(({data}) => data.accepted.value = '')
                            this.addError('Пользователь заблокирован')
                            i++
                        } else {
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
        let order

        await getOrder(data.order.value)
            .then(res => {
                order = res.data.order
            })
            .catch(err => {
                this.addError(err.response.data.message)
            })

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
                    data.order.statusOrder = ''
                )
            })
        }
    }

    // добавление даты передачи заказа
    handlesDate = async () => {
        const {date} = this.state.data,
            nowDate = new Date(Date.now() - date.tzoffset).toISOString().slice(0, -5)
        let isoDate

        if (!date.value) {
            await this.setState(({data}) => data.date.value = nowDate)
        }

        if (date.value > nowDate) {
            this.addError('Будущее еще не наступило')
            await this.setState(({data}) => data.date.value = nowDate)
        } else {
            isoDate = new Date(date.value).toISOString()
            await this.setState(({data}) => {
                return (
                    data.date.isoValue = isoDate,
                    data.date.disabled = true
                )
            })
        }
    }

    // отправка объекта с данными в базу
    handledSubmit = async (e) => {
        e.preventDefault()
        const {form, orders, data} = this.state
        let newOrders = []

        orders.map(order => {
            let obj = {}

            for (let key in order ) {
                if (
                    key === 'idOrder' ||
                    key === 'comment'
                ) obj[key] = order[key]
            }

            newOrders.push(obj)
        })

        await this.setState(({form}) => {
            return (
                form.idTransfer = data.transfer.value,
                form.idAccepted = data.accepted.value,
                form.date = data.date.isoValue,
                form.orders = newOrders
            )
        })

        console.log(form)

        await postAtOrders(form)
            .then(res => {
                this.setState(({submit}) => {
                    return (
                        submit.data.view = true,
                        submit.data.message = res.data.message,
                        submit.data.orders = res.data.orders
                    )
                })
            })
            .catch(err => {
                this.setState(({submit}) => {
                    return (
                        submit.error.view = true,
                        submit.error.message = err.response.data.errors
                    )
                })
            })
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

            arrOrder.delOrder =
                <i
                    className="bi bi-trash-fill btn text-danger"
                    style={{fontSize: 24}}
                    onClick={() => this.deleteOrder(arrOrder.idOrder)}
                />

            if (order.value) {
                if (!orders[0]) {
                    this.setState({orders: [arrOrder, ...this.state.orders]})
                } else {
                    orders.map(item => {
                        if (item.idOrder === arrOrder.idOrder) {
                            this.addError('Данный заказ уже находится в таблице')
                            compare = true
                        }
                    })

                    if (!compare) {
                        this.setState({orders: [arrOrder, ...this.state.orders]})
                    }
                    compare = false
                }
            }
        }

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

    // внесенние данных из поля ввода в state
    onChangeData = (label, value) => {
        if (label === 'transfer') this.setState(({data}) => data.transfer.value = value)
        if (label === 'accepted') this.setState(({data}) => data.accepted.value = value)
        if (label === 'order') this.setState(({data}) => data.order.value = value)
        if (label === 'date') this.setState(({data}) => data.date.value = value)
    }

    // Отображение страницы
    render() {
        const {data, hint, error, orders, orderChange, submit} = this.state,
            {accepted, transfer, order, date} = data

        const inputGroup = (label, data, ref, onKeyPress) => {
            let typeInput, blur

            if (label === 'order') typeInput = "number"
            else if (label === 'date') typeInput = "datetime-local"
            else typeInput = "password"

            return (
                <InputGroup>
                    <InputGroup.Text className='text-end d-block' style={{width: `50%`, whiteSpace: 'normal'}}>{data.label}</InputGroup.Text>
                    <Form.Control
                        type={typeInput}
                        id={data.id}
                        ref={ref}
                        onBlur={() => this.state.orderChange.view || !this.state.data.date.disabled ? null : ref.current.focus()}
                        autoFocus
                        required={label === 'order' ? null : true}
                        isValid={label === 'order' ? null : data.value}
                        isInvalid={label === 'order' ? null : !data.value}
                        value={data.value}
                        className={`border rounded-0 ${data.disabled ? 'd-none' : ''}`}
                        readOnly={data.disabled}
                        onChange={(e) => this.onChangeData(label, e.target.value)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') onKeyPress(e.target.value)
                        }}
                    />
                </InputGroup>
            )
        }

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
                    <Col lg={4} className='mb-3'>
                        {inputGroup('transfer', transfer, this.transferInput, this.handledTransfer)}
                    </Col>
                    <Col lg={3} className='text-center text-secondary'>
                        <Alert
                            className='p-2'
                            style={{fontSize: 12}}
                            variant={transfer.name ? 'success' : 'warning'}
                        >
                            {transfer.name ? transfer.name : '...'}
                        </Alert>
                    </Col>
                    <Col lg={1} className='text-center'>
                        <i
                            className="bi bi-trash-fill btn text-danger pt-0"
                            style={{fontSize: 24}}
                            onClick={() => this.clearValue('transfer')}
                        />
                    </Col>
                    <Col lg={3} className='text-center mb-3'>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `35%`, whiteSpace: 'normal'}}>{date.label}</InputGroup.Text>
                            <Form.Control
                                type='datetime-local'
                                id={date.id}
                                ref={this.dateInput}
                                onBlur={() => date.disabled || this.state.orderChange.view ? null : this.dateInput.current.focus()}
                                autoFocus
                                value={date.value}
                                className='border rounded-0'
                                readOnly={date.disabled}
                                onChange={(e) => this.onChangeData("date", e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={1} className='text-center mb-3'>
                        {date.disabled ? (
                            <i
                                className="bi bi-calendar2-plus-fill text-primary btn p-0"
                                style={{fontSize: 24}}
                                onClick={() => this.setState(({data}) => data.date.disabled = false)}
                            />
                        ) : (
                            <i
                                className="bi bi-calendar2-check-fill text-success btn p-0"
                                style={{fontSize: 24}}
                                onClick={() => this.handlesDate()}
                            />
                        )}
                    </Col>
                </Row>

                <Row>
                    <hr/>
                    <Col lg={4}>
                        {inputGroup('accepted', accepted, this.acceptedInput, this.handledAccept)}
                    </Col>
                    <Col lg={3} className='text-center'>
                        <Alert
                            className='p-2'
                            style={{fontSize: 12}}
                            variant={accepted.name ? 'success' : 'warning'}
                        >
                            {accepted.name ? accepted.name : '...'}
                        </Alert>
                    </Col>
                    <Col lg={1} className='text-center'>
                        <i
                            className="bi bi-trash-fill btn text-danger pt-0"
                            style={{fontSize: 24}}
                            onClick={() => this.clearValue('accepted')}
                        />
                    </Col>
                    <Col lg={3} className={`mb-3`}>
                        <div>
                            <InputGroup>
                                <InputGroup.Text className='text-end d-block' style={{width: `35%`, whiteSpace: 'normal'}}>{order.label}</InputGroup.Text>
                                <Form.Control
                                    type='number'
                                    id={order.id}
                                    ref={this.orderInput}
                                    onBlur={() => !order.disabled || this.state.orderChange.view || !date.disabled ? null : this.orderInput.current.focus()}
                                    autoFocus
                                    value={order.value}
                                    className={`border rounded-0 ${order.hide ? 'hide-input' : ''}`}
                                    readOnly={order.disabled}
                                    onChange={(e) => this.onChangeData('order', e.target.value)}
                                    onKeyPress={e => {
                                        if (e.key === 'Enter') this.addOrder(e.target.value)
                                    }}
                                />
                            </InputGroup>
                        </div>
                    </Col>
                    <Col lg={1} className='mb-3 text-end'>
                        {order.hide ? (
                            <Button
                                variant='outline-primary'
                                type='button'
                                style={{fontSize: 12}}
                                className='p-1'
                                onClick={() => this.setState(({data}) => data.order.hide = false)}
                            >Ручной ввод заказа</Button>
                        ) : (
                            <Button
                                variant='outline-primary'
                                type='button'
                                style={{fontSize: 12}}
                                className='p-1'
                                onClick={() => this.setState(({data}) => data.order.hide = true)}
                            >Скрыть поле</Button>
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <Table striped bordered hover responsive="lg">
                            <Thead
                                title={['Наименование заказа', 'Статус заказа', 'Комментарий к заказу', '']}
                            />
                            <Tbody
                                params={['nameOrder', 'statusOrder',  ['comment', 'commentOrder'], 'delOrder']}
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
                            disabled={!orders[0]}
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

                <ModalWindow
                    show={submit.data.view}
                    onHide={() => this.setState(({submit}) => submit.data.view = false)}
                    message={submit.data.message}
                    orders={submit.data.orders}
                />

                <ModalError
                    show={submit.error.view}
                    onHide={() => this.setState(({submit}) => submit.error.view = false)}
                    error={submit.error.message}
                />

                <ModalError
                    show={error.view}
                    onHide={() => this.setState(({error}) => error.view = false)}
                    error={error.message}
                />
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