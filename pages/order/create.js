import {MainLyout} from "../../components/layout/main";
import {Form, Row, Col, Button, Table, InputGroup} from 'react-bootstrap'
import {Component} from "react";
import {getListsOrder} from "../../services/order/get";

export default class CreateOrder extends Component {

    state = {
        typeOrder: {
            label: 'Тип заказа',
            id: 'type-order',
            type: 'select',
            list: ['Стандарт', 'Фасады', 'Лестницы', 'Профиль', 'Фасады без отделки'],
            value: 'Стандарт'
        },
        header: [
            {
                label: 'Контрагент',
                id: 'client',
                type: 'select',
                list: {
                    name: 'clients',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Название заказа',
                id: 'name',
                type: 'text',
                active: true
            },
            {
                label: 'Массив',
                id: 'massiv',
                type: 'select',
                list: {
                    name: 'material',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Модель профиля',
                id: 'model',
                type: 'text',
                active: true
            },
            {
                label: 'Филенка',
                id: 'fil',
                type: 'select',
                list: {
                    name: 'filenki',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Материал филенки',
                id: 'materialFil',
                type: 'select',
                list: {
                    name: 'materialFilenki',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Текстура',
                id: 'texture',
                type: 'select',
                list: {
                    name: 'texture',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Цвет',
                id: 'color',
                type: 'text',
                active: true
            },
            {
                label: 'Патина',
                id: 'patina',
                type: 'select',
                list: {
                    name: 'patina',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Лак',
                id: 'lak',
                type: 'select',
                list: {
                    name: 'lack',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Присадка',
                id: 'prisadka',
                type: 'select',
                list: {
                    name: 'prisadka',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Термошов',
                id: 'termoshov',
                type: 'select',
                list: {
                    name: 'termoshov',
                    data: ['']
                },
                active: true
            },
            {
                label: 'Комментарий',
                id: 'comment',
                type: 'text',
                active: true
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
        indexData: 0
    }

    async componentDidMount() {
        const token = localStorage.getItem('token')
        let lists

        await getListsOrder(token)
            .then(res => lists = res)

        this.addList(lists)
    }

    addList = (lists) => {
        const {header, body} = this.state,
            arr = ['clients', 'material', 'filenki', 'materialFilenki', 'texture', 'patina', 'lack', 'prisadka', 'termoshov'],
            arr2 = 'nomenclature'

        header.map((head, index) => {
            arr.map(item => {
                if (head.list) {
                    if (head.list.name === item) {
                        this.setState(({header}) => header[index].list.data = ['', ...lists[item]])
                    }
                }
            })
        })

        body.fields.map((field, i) => {
            if (field.list) {
                this.setState(({body}) =>  body.fields[i].list.data = ['', ...lists[arr2]])
            }
        })


    }

    changeTypeOrder = (value) => {
        this.setState(({typeOrder}) => typeOrder.value = value)
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

    ControlInput = (item) => {
        const {order} = this.state

        return (
            <Form.Control
                required
                isValid={order[item.id]}
                isInvalid={!order[item.id]}
                value={order[item.id]}
                onChange={e => this.changeOrderValue(item.id, e.target.value)}
                type={item.type}
                id={item.id}
                className='border-0 border-bottom border-end border-start rounded-0'
            />
        )
    }

    SelectInput = (item) => {
        const {order} = this.state

        return (
            <Form.Select
                required
                isValid={order[item.id]}
                isInvalid={!order[item.id]}
                value={order[item.id]}
                onChange={e => this.changeOrderValue(item.id, e.target.value)}
                id={item.id}
                className='border-0 border-bottom border-end border-start rounded-0'
            >
                {this.renderDatalist(item.list.data)}
            </Form.Select>
        )
    }

    renderInputHeader = () => {
        let list = []

        const {header} = this.state

        header.map((item, i) => {
            if (item.id === 'comment') {
                list.push(
                    <>
                        <Col lg={2} className='mb-3 text-end'>
                            <Form.Label>
                                {item.label}
                            </Form.Label>
                        </Col>
                        <Col lg={10} className='mb-3'>
                            {this.ControlInput(item)}
                        </Col>
                    </>
                )
            } else if (
                item.id === 'color' ||
                item.id === 'model' ||
                item.id === 'fil' ||
                item.id === 'patina'
            ) {
                if (item.list) {
                    list.push(
                        <>
                            <Col lg={2} className='mb-3 text-end'>
                                <Form.Label>
                                    {item.label}
                                </Form.Label>
                            </Col>
                            <Col lg={4} className='mb-3'>
                                <InputGroup>
                                    {this.SelectInput(item)}
                                    <Form.Control
                                        required
                                        className='border-0 border-bottom rounded-0'
                                    />
                                </InputGroup>
                            </Col>
                        </>
                    )
                } else {
                    list.push(
                        <>
                            <Col lg={2} className='mb-3 text-end'>
                                <Form.Label>
                                    {item.label}
                                </Form.Label>
                            </Col>
                            <Col lg={4} className='mb-3'>
                                <InputGroup>
                                    {this.ControlInput(item)}
                                    <Form.Control
                                        required
                                        className='border-0 border-bottom rounded-0'
                                    />
                                </InputGroup>
                            </Col>
                        </>
                    )
                }
            } else {
                if (item.list) {
                    list.push(
                        <>
                            <Col lg={2} className='mb-3 text-end'>
                                <Form.Label>
                                    {item.label}
                                </Form.Label>
                            </Col>
                            <Col lg={4} className='mb-3'>
                                {this.SelectInput(item)}
                            </Col>
                        </>
                    )
                } else {
                    list.push(
                        <>
                            <Col lg={2} className='mb-3 text-end'>
                                <Form.Label>
                                    {item.label}
                                </Form.Label>
                            </Col>
                            <Col lg={4} className='mb-3'>
                                {this.ControlInput(item)}
                            </Col>
                        </>
                    )
                }
            }
        })

        return (
            <Row className="mb-3" style={{fontSize: 18}}>
                {list}
            </Row>
        )
    }

    // renderInputBody = () => {
    //     let list = []
    //
    //     this.state.body.fields.map((item, i) => {
    //         if (item.id === 'nomenklatura') {
    //             list.push(
    //                 <Col lg={3} key={i}>
    //                     <Form.Control
    //                         isValid={item.value}
    //                         value={item.value}
    //                         type="text"
    //                         id={item.id}
    //                         onChange={(e) => this.changeBodyValue(i, e.target.value)}
    //                         list={item.list.name}
    //                         placeholder={item.label}
    //                         className='border-0 border-bottom rounded-0'
    //                     />
    //                     <datalist id={item.list.name}>
    //                         {this.renderDatalist(item.list.data)}
    //                     </datalist>
    //                 </Col>
    //             )
    //         } else {
    //             list.push(
    //                 <Col lg={3} key={i}>
    //                     <Form.Control
    //                         isValid={item.value}
    //                         value={item.value}
    //                         type="text"
    //                         onChange={(e) => this.changeBodyValue(i, e.target.value)}
    //                         id={item.id}
    //                         placeholder={item.label}
    //                         className='border-0 border-bottom rounded-0'
    //                     />
    //                 </Col>
    //             )
    //         }
    //     })
    //
    //     return (
    //         <Row className={`mb-3`}>
    //             {list}
    //         </Row>
    //     )
    // }

    addOrderData = () => {
        let dataLine = {}

        const {indexData} = this.state

        this.setState(({body}) => body.fields.map(item => dataLine[item.id] = item.value))

        this.setState(({order}) => order.data[indexData] = dataLine)

        this.setState(({body}) => body.fields.map(item => item.value = ''))

        this.setState({indexData: indexData+1})
    }

    render() {
        const {typeOrder} = this.state
        return (
            <MainLyout title={`Форма создания заказа`}>
                <h2 className='text-center fw-bold mb-3'>Форма создания заказ</h2>
                <Form onSubmit={e => {
                    e.preventDefault()
                    console.log(this.state.order)
                }} autoComplete="off">
                    <Row>

                        <hr/>

                        <Col lg={1}/>
                        <Col lg={2} className='mb-3 text-end'>
                            <Form.Label style={{fontSize: 18}}>
                                {typeOrder.label}
                            </Form.Label>
                        </Col>
                        <Col lg={8} className='mb-4'>
                            <Form.Select
                                value={typeOrder.value}
                                onChange={e => this.changeTypeOrder(e.target.value)}
                                id={typeOrder.id}
                                className='border-0 border-bottom border-end border-start rounded-0'
                            >
                                {this.renderDatalist(typeOrder.list)}
                            </Form.Select>
                        </Col>
                        <Col lg={1}/>

                        <hr/>

                        <Col lg={1}/>
                        <Col lg={10}>
                            {this.renderInputHeader()}
                        </Col>
                        <Col lg={1}/>

                        <hr/>

                        <Col lg={12}>
                            {/*{this.renderInputBody()}*/}
                            <Col lg={12} className='text-center my-3'>
                                <Button
                                    variant='outline-dark'
                                    type='button'
                                    className='w-25'
                                    onClick={() => this.addOrderData()}
                                >Добавить строку</Button>
                            </Col>
                        </Col>

                        <hr/>

                        <Col lg={12} className='text-end me-5'>
                            <Button variant='outline-success' type="submit" className='w-25'>Сохранить данные</Button>
                        </Col>

                    </Row>
                </Form>
            </MainLyout>
        )
    }
}

// export async function getServerSideProps() {
//
//     return {
//         props: {
//             lists: await getListsOrder()
//         }
//     }
//
// }