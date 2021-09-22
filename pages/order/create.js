import {MainLayout} from "../../components/layout/main";
import {Form, Row, Col, Button, InputGroup} from 'react-bootstrap'
import {Component} from "react";
import {getListsOrder} from "../../services/order/create/get";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../modules/cookie";

class CreateOrder extends Component {

    state = {
        typeOrder: {
            label: 'Тип заказа',
            id: 'type-order',
            type: 'select',
            list: ['', 'Стандарт', 'Фасады', 'Лестницы', 'Профиль', 'Фасады без отделки'],
            role: [
                {
                    id: 1,
                    name: 'Стандарт',
                    activeHeader: ['client', 'name', 'massiv', 'model', 'fil', 'materialFil', 'texture', 'color', 'patina', 'lak', 'prisadka', 'termoshov', 'comment']
                }, {
                    id: 2,
                    name: 'Фасады',
                    activeHeader: ['client', 'name', 'massiv', 'model', 'fil', 'materialFil', 'texture', 'color', 'patina', 'lak', 'prisadka', 'termoshov', 'comment']
                }, {
                    id: 3,
                    name: 'Лестницы',
                    activeHeader: ['client', 'name', 'massiv', 'texture', 'color', 'patina', 'lak', 'comment']
                }, {
                    id: 4,
                    name: 'Профиль',
                    activeHeader: ['client', 'name', 'massiv', 'comment']
                }, {
                    id: 5,
                    name: 'Фасады без отделки',
                    activeHeader: ['client', 'name', 'massiv', 'model', 'fil', 'materialFil', 'texture', 'prisadka', 'termoshov', 'comment']
                }
            ],
            value: '',
            required: true
        },
        nameOrder: [
            {
                label: 'Клиент',
                id: 'client',
                type: 'select',
                list: {
                    name: 'clients',
                    data: ['']
                },
                active: true,
                required: true
            },{
                label: 'Название заказа',
                id: 'name',
                type: 'text',
                active: true,
                required: true
            },
            {
                label: 'Комментарий',
                id: 'comment',
                type: 'text',
                active: true,
                required: false
            }

        ],
        header: [
            {
                label: 'Массив',
                id: 'massiv',
                type: 'select',
                list: {
                    name: 'material',
                    data: ['']
                },
                active: false,
                required: false
            },
            {
                label: 'Модель профиля',
                id: 'model',
                type: 'text',
                active: false,
                required: false
            },
            {
                label: 'Термошов',
                id: 'termoshov',
                type: 'select',
                list: {
                    name: 'termoshov',
                    data: ['']
                },
                active: false,
                required: false
            },
            {
                label: 'Филенка',
                id: 'fil',
                type: 'select',
                list: {
                    name: 'filenki',
                    data: ['']
                },
                active: false,
                required: false
            },
            {
                label: 'Материал филенки',
                id: 'materialFil',
                type: 'select',
                list: {
                    name: 'materialFilenki',
                    data: ['']
                },
                active: false,
                required: false
            },
            {
                label: 'Текстура',
                id: 'texture',
                type: 'select',
                list: {
                    name: 'texture',
                    data: ['']
                },
                active: false,
                required: false
            },
            {
                label: 'Цвет',
                id: 'color',
                type: 'text',
                active: false,
                required: false
            },
            {
                label: 'Патина',
                id: 'patina',
                type: 'select',
                list: {
                    name: 'patina',
                    data: ['']
                },
                active: false,
                required: false
            },
            {
                label: 'Лак',
                id: 'lak',
                type: 'select',
                list: {
                    name: 'lack',
                    data: ['']
                },
                active: false,
                required: false
            },
            {
                label: 'Присадка',
                id: 'prisadka',
                type: 'select',
                list: {
                    name: 'prisadka',
                    data: ['']
                },
                active: false,
                required: false
            }
        ],
        body: {
            active: false,
            fields: [
                {
                    label: 'Номенклатура',
                    id: 'nomenklatura',
                    list: {
                        name: 'nomenclature',
                        data: ['']
                    }
                },
                {
                    label: 'Длина',
                    id: 'width',
                },
                {
                    label: 'Ширина',
                    id: 'height',
                },
                {
                    label: 'Кол-во',
                    id: 'kolVo',
                }
            ]
        },
        order: {
            client: '',
            name: '',
            massiv: '',
            model: '',
            fil: '',
            materialFil: '',
            texture: '',
            color: '',
            patina: '',
            lak: '',
            prisadka: '',
            termoshov: '',
            comment: '',
            data: [
                {
                nomenklatura: '',
                width: '',
                height: '',
                kolVo: ''
                }
            ]
        },
        indexData: 0,
        link: this.props.router.asPath
    }

    async componentDidMount() {
        this.viewHeader(this.state.typeOrder.value)

        if (this.props.lists) this.addList(this.props.lists)
    }

    viewHeader = (value) => {
        const {typeOrder, header} = this.state

        this.setState(({typeOrder}) => typeOrder.value = value)

        header.map((head, i) => {
            this.setState(({header}) => {
                header[i].required = false
                header[i].active = false
            })
        })

        typeOrder.role.map(type => {
            if (type.name === value) {
                header.map((head, i) => {
                    type.activeHeader.map(active => {
                        if (active === head.id) {
                            this.setState(({header}) => {
                                header[i].required = true
                                header[i].active = true
                            })
                        }
                    })
                })
            }
        })
    }

    addList = (lists) => {
        const {header, body, nameOrder} = this.state,
            arr = ['material', 'filenki', 'materialFilenki', 'texture', 'patina', 'lack', 'prisadka', 'termoshov'],
            arr2 = 'nomenclature',
            arr3 = 'clients'

        header.map((head, index) => {
            arr.map(item => {
                if (head.list) {
                    if (head.list.name === item) {
                        this.setState(({header}) => header[index].list.data = ['', ...lists[item]])
                    }
                }
            })
        })

        nameOrder.map((name, i) => {
            if (name.list) this.setState(({nameOrder}) =>  nameOrder[i].list.data = ['', ...lists[arr3]])
        })

        body.fields.map((field, i) => {
            if (field.list) this.setState(({body}) =>  body.fields[i].list.data = ['', ...lists[arr2]])
        })
    }

    changeOrderValue = (id, value) => {
        this.setState(({order}) => order[id] = value)
    }

    changeBodyValue = (id, value) => {
        this.setState(({body}) => body.fields[id].value = value)
    }

    renderDatalist = (arr) => {
        return arr.map((item, i) => {
            return (
                <option key={i} value={item}>{item}</option>
            )
        })
    }

    renderInputHeader = () => {
        let list = [],
            list2 = [],
            list3 = [],
            orderList = []

        const {header, order, nameOrder} = this.state,
            classInput = 'border rounded-0'

        const input = (item) => {
            if (item.id === 'color' ||
                item.id === 'model' ||
                item.id === 'fil' ||
                item.id === 'patina') {
                return <Form.Control className={classInput} />
            }
        }

        const comment = (item, index, col = 12) => {
            return (
                <Row className={`${item.active ? '' : 'd-none'}`} key={index}>
                    <Col lg={col} className='mb-3'>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `180px`}}>{item.label}</InputGroup.Text>
                            <Form.Control
                                value={order[item.id]}
                                onChange={e => this.changeOrderValue(item.id, e.target.value)}
                                type={item.type}
                                id={item.id}
                                className={classInput}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            )
        }

        const select = (item, index, col = 12) => {
            if (item.id === 'client') {
                return (
                    <Col lg={col} key={index} className='mb-3'>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `180px`}}>{item.label}</InputGroup.Text>
                            <Form.Control
                                required={item.required}
                                isValid={order[item.id]}
                                isInvalid={!order[item.id]}
                                value={order[item.id]}
                                onChange={e => this.changeOrderValue(item.id, e.target.value)}
                                id={item.id}
                                list={item.list.name}
                                className={classInput} />
                            <datalist id={item.list.name}>
                                {this.renderDatalist(item.list.data)}
                            </datalist>
                        </InputGroup>
                    </Col>
                )
            } else {
                return (
                    <Row className={`${item.active ? '' : 'd-none'}`} key={index}>
                        <Col lg={col} className='mb-3'>
                            <InputGroup>
                                <InputGroup.Text className='text-end d-block' style={{width: `180px`}}>{item.label}</InputGroup.Text>
                                <Form.Control
                                    required={item.required}
                                    isValid={order[item.id]}
                                    isInvalid={!order[item.id]}
                                    value={order[item.id]}
                                    onChange={e => this.changeOrderValue(item.id, e.target.value)}
                                    id={item.id}
                                    list={item.list.name}
                                    className={classInput} />
                                <datalist id={item.list.name}>
                                    {this.renderDatalist(item.list.data)}
                                </datalist>
                                {input(item)}
                            </InputGroup>
                        </Col>
                    </Row>
                )
            }
        }

        const text = (item, index, col = 12) => {
            if (item.id === 'name') {
                return (
                    <Col lg={col} key={index} className='mb-3'>
                        <InputGroup>
                            <InputGroup.Text className='text-end d-block' style={{width: `180px`}}>{item.label}</InputGroup.Text>
                            <Form.Control
                                required={item.required}
                                isValid={order[item.id]}
                                isInvalid={!order[item.id]}
                                value={order[item.id]}
                                onChange={e => this.changeOrderValue(item.id, e.target.value)}
                                type={item.type}
                                id={item.id}
                                className={classInput}
                            />
                        </InputGroup>
                    </Col>
                )
            } else {
                return (
                    <Row className={`${item.active ? '' : 'd-none'}`} key={index}>
                        <Col lg={col} className='mb-3'>
                            <InputGroup>
                                <InputGroup.Text className='text-end d-block' style={{width: `180px`}}>{item.label}</InputGroup.Text>
                                <Form.Control
                                    required={item.required}
                                    isValid={order[item.id]}
                                    isInvalid={!order[item.id]}
                                    value={order[item.id]}
                                    onChange={e => this.changeOrderValue(item.id, e.target.value)}
                                    type={item.type}
                                    id={item.id}
                                    className={classInput}
                                />
                                {input(item)}
                            </InputGroup>
                        </Col>
                    </Row>
                )
            }
        }

        nameOrder.map((item, i)=> {
            if (item.list) {
                orderList.push(select(item, i,6))
            } else if (item.id === 'comment') {
                list3.push(comment(item, i))
            } else {
                orderList.push(text(item, i, 6))
            }

        })

        header.map((item, i) => {
            if (i < 5) {
                if (item.list) {
                    list.push(select(item, i,))
                } else {
                    list.push(text(item, i))
                }
            } else if (i > 4 && i < 10) {
                if (item.list) {
                    list2.push(select(item, i))
                } else {
                    list2.push(text(item, i))
                }
            }
        })

        return (
            <Row className="mb-3" style={{fontSize: 18}}>
                <Col lg={12}>
                    <Row className='mb-2'>
                        {orderList}
                    </Row>
                </Col>
                <Col lg={6}>
                    {list}
                </Col>
                <Col lg={6}>
                    {list2}
                </Col>
                <Col lg={12}>
                    {list3}
                </Col>
            </Row>
        )
    }

    addOrderData = () => {
        let dataLine = {}

        const {indexData} = this.state

        this.setState(({body}) => body.fields.map(item => dataLine[item.id] = item.value))

        this.setState(({order}) => order.data[indexData] = dataLine)

        this.setState(({body}) => body.fields.map(item => item.value = ''))

        this.setState({indexData: indexData+1})
    }

    render() {
        const {typeOrder, link} = this.state

        return (
            <MainLayout title={`Форма создания заказа`} link={link} token={this.props.token} error={this.props.error}>
                <h2 className='text-center fw-bold mb-3'>Форма создания заказ</h2>
                <Form onSubmit={e => {
                    e.preventDefault()
                }} autoComplete="off">
                    <Row>

                        <hr/>

                        <Col lg={1}/>
                        <Col lg={10} className='mb-3'>
                            <InputGroup>
                                <InputGroup.Text className='text-end d-block' style={{width: `180px`}}>{typeOrder.label}</InputGroup.Text>
                                <Form.Select
                                    required={typeOrder.required}
                                    isInvalid={!typeOrder.value}
                                    isValid={typeOrder.value}
                                    value={typeOrder.value}
                                    onChange={e => this.viewHeader(e.target.value)}
                                    id={typeOrder.id}
                                    className='border rounded-0'
                                >
                                    {this.renderDatalist(typeOrder.list)}
                                </Form.Select>
                            </InputGroup>

                        </Col>
                        <Col lg={1}/>

                        <Col lg={1}/>
                        <Col lg={10}>
                            {this.renderInputHeader()}
                        </Col>
                        <Col lg={1}/>

                        <hr/>

                        <Col lg={12} className='text-end me-5'>
                            <Button variant='outline-success' type="submit" className='w-25'>Сохранить данные</Button>
                        </Col>
                    </Row>
                </Form>
            </MainLayout>
        )
    }
}

export default withRouter(CreateOrder)

export async function getServerSideProps({req}) {

    const token = getTokenCookies(req.headers.cookie)

    let lists, error

    await getListsOrder(token)
        .then(res => lists = res)
        .catch(err => error = err.response.data)


    if (lists) {
        return {
            props: {
                lists
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