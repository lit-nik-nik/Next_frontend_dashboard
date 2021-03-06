import {Alert, Button, Col, Form, InputGroup, Modal, Row, Spinner, Table} from "react-bootstrap"
import React, {Component} from "react";
import {format} from 'date-fns';
import {connect} from "react-redux";
import Thead from "../../modules/tables/thead";
import Tbody from "../../modules/tables/tbody";
import {changeKeyboard} from "../../modules/change-keyboard";
import {getBarcodes, getOrderAt, getServerTime} from "../../api/at-order/get";
import {addExtraData, postAtOrders} from "../../api/at-order/post";
import ModalWindow from "../../modules/modals/modal";
import {decriptedStr, encritptedStr} from "../../modules/encription";
import {MyInput, MySelect} from "../elements/input";
import {setLoading, setError, removeLoading} from "../../redux/actions/actionsApp";

class ComAccTransOrder extends Component {

    constructor(props) {
        super(props);
        this.transferInput = React.createRef();
        this.acceptedInput = React.createRef();
        this.orderInput = React.createRef();
        this.commentInput = React.createRef();
        this.dateInput = React.createRef();
    }

    state = {
        barcodes: null,
        serverDate: null,
        dateInterval: null,
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
                hide: true,
                extraData: [],
                extraTime: null,
                extraDate: null,
                extraDataView: false,
                extraDataDisabled: true
            },
            date: {
                label: 'Дата',
                id: 'data',
                value: '',
                isoValue: '',
                disabled: true,
                hide: true,
                update: null
            },
            allExtraData: [],
            prevSelectExtra: null,
        },
        ordersID: [],
        orders: [],
        extraData: [],
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
            orders: [],
            extraData: []
        },
        hint: '',
        error: {
            view: false,
            message: ''
        },
        errorExtra: null,
        submit: {
            disable: false,
            data: {
                view: false,
                message: null,
                orders: []
            },
            error: {
                data: null
            }
        }
    }

    async componentDidMount() {
        await this.getBarcodes()

        this.addHint(1)
        setInterval(this.receiveServerDate, 1800000)

        if (localStorage.getItem('transfer')) {
            const transfer = decriptedStr(localStorage.getItem('transfer'))
            this.onChangeData('transfer', transfer)
            await this.addTransfer(transfer)
        }
        if (localStorage.getItem('accepted')) {
            const accepted = decriptedStr(localStorage.getItem('accepted'))
            this.onChangeData('accepted', accepted)
            await this.addAccept(accepted)
        }

        if (localStorage.getItem('extraData')) {
            this.setState(({data}) => data.allExtraData = JSON.parse(localStorage.getItem('extraData')))
        }

        if (localStorage.getItem('orders')) {
            JSON.parse(localStorage.getItem('orders')).map(async order => {
                await this.receiveOrder(order)
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {data, orderChange, ordersID} = this.state

        if(!data.transfer.name) this.transferInput.current.focus()
        else if (!data.accepted.name) this.acceptedInput.current.focus()
        else if (orderChange.view) this.commentInput.current.focus()
        else if (!data.date.disabled) this.dateInput.current.focus()
        else if (!data.order.disabled) this.orderInput.current.focus()

        if(this.state !== prevState) {
            if (data.transfer.value) localStorage.setItem('transfer', encritptedStr(data.transfer.value))
            if (data.accepted.value) localStorage.setItem('accepted', encritptedStr(data.accepted.value))
            if (ordersID.length > 0) localStorage.setItem('orders', JSON.stringify(ordersID))
            if (data.allExtraData.length > 0) localStorage.setItem('extraData', JSON.stringify(data.allExtraData))
        }

        if (this.state.extraData !== prevState.extraData) {
            this.addOrderToTable()
        }
    }

    componentWillUnmount() {
        localStorage.removeItem('transfer')
        localStorage.removeItem('accepted')
        localStorage.removeItem('extraData')
        localStorage.removeItem('orders')
        clearInterval(this.state.dateInterval)
    }

    getBarcodes = async () => {
        let barcodes

        this.props.setLoading()

        await getBarcodes()
            .then(res => barcodes = res.data.barcodes)
            .catch(() => {
                this.props.setError({errors: [], message: 'Не удалось получить данные'})
            })

        this.props.removeLoading()

        this.setState(() => ({barcodes}))
    }

    // получение и проверка заказа
    receiveOrder = async (value) => {
        let order

        this.props.setLoading()

        await getOrderAt(value)
            .then(res => {
                order = res.data.order
            })
            .catch(err => {
                this.addError(err.response?.data.message)
            })

        this.props.removeLoading()

        if (order) {
            this.setState((state) => (
                state.data.order.nameOrder = order.itmOrderNum,
                state.data.order.idOrder = order.id,
                state.data.order.statusOrder = order.status
            ))

            if (this.state.extraData[0]) this.addExtraData(order.id)
            else this.addOrderToTable()
        } else {
            this.clearValue('order')
        }
    }

    // получение дополнительных свойств заказа
    receiveExtraData = async () => {
        const {data} = this.state,
            {accepted, transfer} = data

        let barcodes = {
            barcodeTransfer: transfer.value,
            barcodeAccepted: accepted.value
        }

        if (accepted.name && transfer.name) {
            this.props.setLoading()

            await addExtraData(barcodes)
                .then(res => this.setState({extraData: res.data}))
                .catch(e => {
                    this.props.setError(e.response.data)
                    this.clearValue('transfer')
                    this.clearValue('accepted')
                })

            await this.receiveServerDate()

            this.props.removeLoading()
        }
    }

    // получение серверного времени
    receiveServerDate = async () => {
        const date = new Date(await getServerTime()),
            formatDate = format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss")

        await this.setState({serverDate: date})
        await this.setState(({data}) => data.date.value = formatDate)

        await this.addDate()
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

    //поиск и проверка передающей стороны
    addTransfer = async (value) => {
        const {barcodes, data} = this.state
        let i = 0

        if (value) {
            if (value === data.accepted.value) {
                this.setState(({data}) => data.transfer.value='')
                this.addError('Участок был выбран ранее')
            } else  {
                await barcodes.map(user => {
                    if (value === user.BARCODE) {
                        if (user.BLOCKED) {
                            this.setState(({data}) => data.transfer.value = '')
                            this.addError('Пользователь заблокирован')
                            i++
                        } else {
                            if(!this.state.data.accepted.name) {
                                const name = `${user.SECTOR} / ${user.EMPLOYEE ? user.EMPLOYEE : '-'}`

                                this.setState(({data}) => {
                                    return (
                                        data.transfer.name = name,
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

        this.receiveExtraData()
    }

    //поиск и проверка принимающей стороны
    addAccept = async (value) => {
        const {barcodes, data} = this.state
        let i = 0

        if (value) {
            if (value === data.transfer.value) {
                this.setState(({data}) => data.accepted.value = '')
                this.addError('Участок был выбран ранее')
            } else {
                await barcodes.map(user => {
                    if(value === user.BARCODE) {
                        if (user.BLOCKED) {
                            this.setState(({data}) => data.accepted.value = '')
                            this.addError('Пользователь заблокирован')
                            i++
                        } else {
                            const name = `${user.SECTOR} / ${user.EMPLOYEE ? user.EMPLOYEE : '-'}`

                            this.setState(({data}) => {
                                return (
                                    data.accepted.name = name,
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

        this.receiveExtraData()
    }

    // добавление доп свойств к заказу
    addExtraData = (id) => {
        const {extraData, data} = this.state
        let orderExtraData = [],
            extraTime, extraDate

        extraData.map(item => {
            let newExtra

            newExtra = {...item, orderId: id}

            orderExtraData.push(newExtra)
        })

        extraTime = format(new Date(data.date.isoValue), "HH:mm")
        extraDate = format(new Date(data.date.isoValue), "yyyy-MM-dd")

        this.setState(({data}) => {
            return (
                data.order.extraData = orderExtraData,
                data.order.extraTime = extraTime,
                data.order.extraDate = extraDate
            )
        })

        this.setState(({data}) => data.order.extraDataView = true)
    }

    // добавление даты передачи заказа
    addDate = async () => {
        const {date} = this.state.data,
            {serverDate} = this.state

        if (serverDate) {
            const formatServDate = format(new Date(serverDate), "yyyy-MM-dd'T'HH:mm:ss")

            if (new Date(date.value) > serverDate) {
                this.addError('Будущее еще не наступило')

                await this.setState(({data}) => data.date.value = formatServDate)
            }
            else {
                const isoDate = new Date(data.value)

                await this.setState(({data}) => {
                    return (
                        data.date.isoValue = isoDate,
                        data.date.disabled = true
                    )

                })
            }
        }
        else {
            this.setState(({data}) => data.date.disabled = true)
        }
    }

    // Добавление заказа в объект для таблицы
    addOrderToTable = () => {
        const {orders, data} = this.state,
            {order} = data
        let arrOrder = {},
            compare = false

        if (order.idOrder) {
            for (let key in order) {
                if (key === 'idOrder' ||
                    key === 'nameOrder' ||
                    key === 'statusOrder') {
                    arrOrder[key] = order[key]
                }
            }

            arrOrder.comment = ''

            arrOrder.iconChangeComment =
                <i
                    className='bi bi-pencil-square btn text-warning'
                    style={{fontSize: 20}}
                    onClick={() => this.viewModalChangeComment(arrOrder.idOrder)}
                />

            arrOrder.extraData = ''

            arrOrder.iconChangeExtraData =
                <i
                    className='bi bi-pencil-square btn text-warning'
                    style={{fontSize: 20}}
                    onClick={() => this.viewExtraDataOrder(arrOrder.idOrder)}
                />


            arrOrder.delOrder =
                <i
                    className="bi bi-trash-fill btn text-danger"
                    style={{fontSize: 24}}
                    onClick={() => this.deleteOrder(arrOrder.idOrder)}
                />


            if (!orders[0]) {
                this.setState({ordersID: [...this.state.ordersID, +order.idOrder]})
                this.setState({orders: [arrOrder, ...this.state.orders]})
            } else {
                orders.map(item => {
                    if (item.idOrder === arrOrder.idOrder) {
                        this.addError('Данный заказ уже находится в таблице')
                        compare = true
                    }
                })

                if (!compare) {
                    this.setState({ordersID: [...this.state.ordersID, +order.idOrder]})
                    this.setState({orders: [arrOrder, ...this.state.orders]})
                }
                compare = false
            }
        }

        console.log(arrOrder)

        this.clearValue('order')
    }

    // вызов окна изменения комментария заказа
    viewModalChangeComment = (id) => {
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

    // изменение комментария заказа в объекте заказов
    saveCommentOrder = () => {
        const {orderChange} = this.state

        let newOrders = this.state.orders

        newOrders.map(order => {
            if (order.idOrder === orderChange.idOrder) {
                order.comment = orderChange.comment
            }
        })

        this.setState({orders: newOrders})
        this.setState(({orderChange}) => {
            return (
                orderChange.view = false,
                orderChange.idOrder = '',
                orderChange.nameOrder = '',
                orderChange.comment = ''
            )
        })


        this.addHint(3)
    }

    // вызов окна изменения дополнительных свойств заказа
    viewExtraDataOrder = (id) => {
        const {data, serverDate} = this.state
        const {allExtraData} = data

        let newAllExtraData = [],
            orderExtraData = [],
            extraTime, extraDate

        allExtraData.map(data => {
            if (data.orderId === id) {
                orderExtraData.push(data)
            } else {
                newAllExtraData.push(data)
            }
        })

        orderExtraData.map(data => {
            if (data.type === 'date') {
                if (data.data) {
                    extraTime = format(new Date(data.data), "HH:mm")
                    extraDate = format(new Date(data.data), "yyyy-MM-dd")
                } else {
                    extraTime = format(new Date(serverDate), "HH:mm")
                    extraDate = format(new Date(serverDate), "yyyy-MM-dd")
                }
            }
        })

        this.setState(({data}) => {
            return (
                data.allExtraData = newAllExtraData,
                data.order.extraData = orderExtraData,
                data.order.extraTime = extraTime,
                data.order.extraDate = extraDate,
                data.order.extraDataView = true
            )
        })
    }

    // изменение данные допполей
    changeExtraDataOrder = (value) => {
        if (value.includes('-')) {
            this.setState(({data}) => data.order.extraDate = value)
        } else if (value.includes(':')) {
            this.setState(({data}) => data.order.extraTime = value)
        }
    }

    // формирование и отображение допполей
    renderExtraOrderData = (obj, i) => {
        const {order, prevSelectExtra} = this.state.data

        if (obj.type === 'date') {
            return (
                <Row>
                    <Col>
                        <MyInput
                            name='Время'
                            type='time'
                            value={order.extraTime}
                            onChange={async e => {
                                await this.changeExtraDataOrder(e.target.value)
                            }}
                        />
                    </Col>
                    <Col>
                        <MyInput
                            name='Дата'
                            type='date'
                            value={order.extraDate}
                            onChange={async e => {
                                await this.changeExtraDataOrder(e.target.value)
                            }}
                        />
                    </Col>
                </Row>
            )
        }
        else if (obj.type === 'number') {
            return (
                <MyInput
                    name={obj.name}
                    type={obj.type}
                    value={obj.data}
                    onChange={e => {
                        let num = e.target.value.toString()
                        if (num[0] === '0') num = num.slice(1)
                        this.setState(({data}) => data.order.extraData[i].data = num)
                    }}
                />
            )
        }
        else if (obj.type === 'select') {
            let option = []

            option.push(<option key='0' value='' />)

            obj.list.map((item, iL) => {
                option.push(<option key={iL} value={item}>{item}</option>)
            })

            return (
                <Row className='align-items-end'>
                    <Col lg={prevSelectExtra ? 7 : 12}>
                        <MySelect
                            name={obj.name}
                            value={obj.data}
                            onChange={({target}) => {
                                if (target.value !== '') {
                                    this.setState(({data}) => data.order.extraData[i].data = target.value)
                                    this.setState(({data}) => data.prevSelectExtra = target.value)
                                }
                            }}
                            option={option}
                        />
                    </Col>
                    {prevSelectExtra ? (
                        <Col lg={5}>
                            <Button
                                variant='outline-dark'
                                className='w-100 text-center'
                                onClick={() => this.setState(({data}) => data.order.extraData[i].data = prevSelectExtra)}
                            >
                                {prevSelectExtra}
                            </Button>
                        </Col>
                    ) : null}
                </Row>

            )
        }
        else {
            return (
                <MyInput
                    name={obj.name}
                    type='text'
                    value={obj.data}
                    onChange={e => this.setState(({data}) => data.order.extraData[i].data = e.target.value)}
                />
            )
        }
    }

    // сохранение доп свойств в общий объект
    saveAllExtraData = async () => {
        const {data} = this.state
        const {order} = data
        let allExtraData = [...data.allExtraData], i = 0, newDate, serverDate, extraDate, newExtraData = []

        newDate = new Date(`${order.extraDate}T${order.extraTime}`)
        serverDate = new Date(data.date.isoValue)

        if (newDate > serverDate) extraDate = serverDate
        else extraDate = newDate

        order.extraData.map(data => {
            let newExtra

            if (data.type === 'date') {
                newExtra = {...data, data: extraDate}
            } else {
                newExtra = {...data}
            }

            newExtraData.push(newExtra)
        })

        allExtraData = [...allExtraData, ...newExtraData]

        newExtraData.map(item => {
            if (item.data === '0' || item.data === '') {}
            else i++
        })

        if (i === data.order.extraData.length) {
            await this.setState(({data}) => {
                return (
                    data.allExtraData = allExtraData,
                    data.order.extraDataView = false
                )
            })
        }
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

    // функция очистки формы после отправки данных
    clearForm = () => {
        this.setState(({submit}) => submit.data.view = false)
        this.clearValue('all')
    }

    // очистка данных сохраненных в вводе
    clearValue = (area) => {
        if (area === 'transfer') {
            this.setState(({data}) => {
                return (
                    data.transfer.value = '',
                        data.transfer.name = '',
                        data.transfer.disabled = false,
                        data.accepted.disabled = true,
                        data.order.disabled = true
                )
            })
            this.clearValue('allOrders')
            this.addHint(1)
            localStorage.removeItem('transfer')
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
            this.clearValue('allOrders')
            localStorage.removeItem('accepted')
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

        if (area === 'allOrders') {
            this.setState({ordersID: []})
            this.setState({orders: []})
            this.setState({extraData: []})
            this.setState(({data}) => {
                return (
                    data.order.nameOrder = '',
                    data.order.idOrder = '',
                    data.order.statusOrder = '',
                    data.order.value = '',
                    data.order.disabled = true,
                    data.order.extraData = [],
                    data.allExtraData = []
                )
            })
            localStorage.removeItem('orders')
            localStorage.removeItem('extraData')
        }

        if (area === 'all') {
            this.setState({ordersID: []})
            this.setState({orders: []})
            this.setState({extraData: []})
            this.setState({serverDate: null})
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
                        data.order.extraData = [],
                        data.order.disabled = true,
                        data.date.value = '',
                        data.date.isoValue = '',
                        data.allExtraData = []
                )
            })
            localStorage.removeItem('transfer')
            localStorage.removeItem('accepted')
            localStorage.removeItem('date')
            localStorage.removeItem('orders')
            localStorage.removeItem('extraData')
            this.addHint(1)
        }
    }

    // удаление заказа из объекта заказов
    deleteOrder = (id) => {
        const {orders, ordersID, data} = this.state
        let localOrders = ordersID,
            newArr = orders,
            allExtraData = []

        orders.map((item, i) => {
            if (item.idOrder === id) {
                newArr.splice(i, 1)
                this.setState({orders: newArr})
            }
        })

        ordersID.map((item, i) => {
            if (id === item) {
                localOrders.splice(i, 1)
                this.setState({ordersID: localOrders})
                localStorage.setItem('orders', localOrders)
            }
        })

        data.allExtraData.map((data, i) => {
            if (data.orderId !== id) {
                allExtraData.push(data)
            }
        })

        this.setState(({data}) => data.allExtraData = allExtraData)

    }

    // сохранение данных поля ввода в state
    onChangeData = (label, value) => {
        if (label === 'transfer') this.setState(({data}) => data.transfer.value = value)
        if (label === 'accepted') this.setState(({data}) => data.accepted.value = value)
        if (label === 'order') this.setState(({data}) => data.order.value = value)
        if (label === 'date') {
            this.setState(({data}) => data.date.value = value)
        }
    }

    // отправка объекта с данными в базу
    sendForm = async (e) => {
        e.preventDefault()
        const {form, orders, data} = this.state
        let newOrders = []

        this.props.setLoading()

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
                    form.orders = newOrders,
                    form.extraData = data.allExtraData
            )
        })

        await postAtOrders(form)
            .then(res => {
                console.log(res)
                this.setState(({submit}) => {
                    return (
                        submit.data.view = true,
                        submit.data.message = res.data.message,
                        submit.data.orders = res.data.orders
                    )
                })
                this.setState(({submit}) => submit.disable = false)
            })
            .catch(e => {
                this.props.setError(e.response.data)
                this.setState(({submit}) => submit.disable = false)
            })

        this.props.removeLoading()

    }

    // Отображение страницы
    render() {
        const {data, hint, error, orders, orderChange, submit, errorExtra, serverDate} = this.state,
            {accepted, transfer, order, date, allExtraData} = data

        const inputGroup = (label, data, ref, onKeyPress) => {
            let typeInput

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
                        disabled={data.disabled}
                        onChange={(e) => this.onChangeData(label, changeKeyboard(e.target.value))}
                        onKeyPress={e => {
                            if (e.key === 'Enter') onKeyPress(e.target.value)
                        }}
                    />
                </InputGroup>
            )
        }

        return (
            <>
                <h2 className='text-center fw-bold mb-3'>
                    Форма приема-передачи заказа
                </h2>

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

                <Row className='align-items-center'>
                    <Col lg={4} className='mb-3'>
                        {inputGroup('transfer', transfer, this.transferInput, this.addTransfer)}
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
                                onBlur={() => date.disabled || orderChange.view ? null : this.dateInput.current.focus()}
                                autoFocus
                                value={date.value}
                                className='border rounded-0'
                                readOnly={date.disabled}
                                onChange={(e) => this.onChangeData("date", e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={1} className='text-center mb-3'>
                        {serverDate ?
                            date.disabled ? (
                                    <i
                                        className="bi bi-calendar2-plus-fill text-primary btn p-0"
                                        style={{fontSize: 24}}
                                        onClick={() => this.setState(({data}) => data.date.disabled = false)}
                                    />
                                ) : (
                                    <i
                                        className="bi bi-calendar2-check-fill text-success btn p-0"
                                        style={{fontSize: 24}}
                                        onClick={() => this.addDate()}
                                    />
                                )
                         : null}
                    </Col>
                </Row>

                <Row className='align-items-center'>
                    <hr/>
                    <Col lg={4}>
                        {inputGroup('accepted', accepted, this.acceptedInput, this.addAccept)}
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
                            <InputGroup className={`${order.hide ? 'hide-input' : ''}`}>
                                <InputGroup.Text className='text-end d-block' style={{width: `35%`, whiteSpace: 'normal'}}>{order.label}</InputGroup.Text>
                                <Form.Control
                                    type='number'
                                    id={order.id}
                                    ref={this.orderInput}
                                    onBlur={() => order.disabled || orderChange.view || !date.disabled ? null : this.orderInput.current.focus()}
                                    autoFocus
                                    value={order.value}
                                    className={`border rounded-0`}
                                    readOnly={order.disabled}
                                    disabled={order.extraDataView}
                                    onChange={(e) => this.onChangeData('order', e.target.value)}
                                    onKeyPress={e => {
                                        if (e.key === 'Enter') {
                                            this.receiveOrder(e.target.value)
                                        }
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
                                className='p-1 shadow-sm'
                                onClick={() => this.setState(({data}) => data.order.hide = false)}
                            >Ручной ввод заказа</Button>
                        ) : (
                            <Button
                                variant='outline-primary'
                                type='button'
                                style={{fontSize: 12}}
                                className='p-1 shadow-sm'
                                onClick={() => this.setState(({data}) => data.order.hide = true)}
                            >Скрыть поле</Button>
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col className='text-end m-0 p-0 pe-3 text-black-50 fst-italic' style={{fontSize: '12px'}}>
                        Выбрано заказов - {orders.length}
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <Table striped bordered hover responsive="lg" size='sm'>
                            <Thead
                                title={['Наименование заказа', 'Статус заказа', 'Комментарий к заказу', 'Доп. св-ва', '']}
                            />
                            <Tbody
                                params={['nameOrder', 'statusOrder',  ['comment', 'iconChangeComment'], ['extraData', "iconChangeExtraData"], 'delOrder']}
                                orders={orders}
                                allExtraData={allExtraData}
                            />
                        </Table>
                    </Col>
                </Row>

                <Row className='sticky-bottom bg-white my-0 pb-3 align-items-end'>
                    <hr />
                    <Col lg={2} className='text-start'>
                        <Button
                            variant='outline-danger'
                            className='w-100 text-dark shadow'
                            type='button'
                            onClick={() => this.clearValue('all')}
                        >Очистить форму</Button>
                    </Col>
                    <Col />
                    <Col lg={2} className='text-end'>
                        <Button
                            variant='outline-success'
                            className='w-100 text-dark shadow'
                            type='button'
                            disabled={!orders[0] || submit.disable}
                            onClick={e => {
                                this.setState(({submit}) => submit.disable = true)
                                this.sendForm(e)
                            }}
                        >
                            <Row className='align-items-center'>
                                <Col>
                                    Сохранить данные
                                </Col>
                                {submit.disable ? (
                                    <Col lg={2}>
                                        <Spinner animation="border" variant="warning" size='sm'/>
                                    </Col>
                                ) : null}
                            </Row>
                        </Button>
                    </Col>
                </Row>

                <Modal show={order.extraDataView} centered>
                    <Modal.Header className='text-center d-block'>
                        {`Дополнительные парамметры к заказу - ${order.extraData.length > 0 ? order.extraData[0].orderId : null}`}
                    </Modal.Header>
                    <Modal.Body>
                        {order.extraData.map((item, i) => {
                            return (
                                <div key={i}>
                                    {this.renderExtraOrderData(item, i)}
                                </div>
                            )
                        })}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant='outline-success'
                            className='w-100'
                            onClick={async () => {
                                await this.saveAllExtraData(order.extraData)
                                if (data.allExtraData.length > 0) this.addOrderToTable()
                            }}
                        >
                            Сохранить
                        </Button>
                    </Modal.Footer>
                </Modal>

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
                                if (e.key === 'Enter') this.saveCommentOrder()
                            }}
                        />
                    </Modal.Body>
                </Modal>

                <ModalWindow
                    show={submit.data.view}
                    clearData={this.clearForm}
                    message={submit.data.message}
                    orders={submit.data.orders}
                />
            </>
        )
    }
}

export default connect(null, {setError, setLoading, removeLoading})(ComAccTransOrder)