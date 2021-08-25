import {MainLyout} from "../../components/layout/main";
import {Form, Row, Col, Button, Table} from 'react-bootstrap'
import {Component} from "react";
import {getListsOrder} from "../../services/order/get";
import Thead from "../../modules/tables/thead";
import Tbody from "../../modules/tables/tbody";

export default class CreateOrder extends Component {

    state = {
        header: [
            {
                label: 'Контрагент',
                id: 'client',
                value: '',
                list: {
                    name: 'clients',
                    data: this.props.lists.clients ? this.props.lists.clients : []
                }
            },
            {
                label: 'Название заказа',
                id: 'name',
                value: ''
            },
            {
                label: 'Массив',
                id: 'massiv',
                value: '',
                list: {
                    name: 'materials',
                    data: this.props.lists.material ? this.props.lists.material : []
                }
            },
            {
                label: 'Модель профиля',
                id: 'model',
                value: ''
            },
            {
                label: 'Филенка',
                id: 'fil',
                value: '',
                list: {
                    name: 'filenki',
                    data: this.props.lists.filenki ? this.props.lists.filenki : []
                }
            },
            {
                label: 'Материал филенки',
                id: 'materialFil',
                value: '',
                list: {
                    name: 'materialsFilenki',
                    data: this.props.lists.materialFilenki ? this.props.lists.materialFilenki : []
                }
            },
            {
                label: 'Текстура',
                id: 'texture',
                value: '',
                list: {
                    name: 'textures',
                    data: this.props.lists.texture ? this.props.lists.texture : []
                }
            },
            {
                label: 'Цвет',
                id: 'color',
                value: ''
            },
            {
                label: 'Патина',
                id: 'patina',
                value: '',
                list: {
                    name: 'patiny',
                    data: this.props.lists.patina ? this.props.lists.patina : []
                }
            },
            {
                label: 'Лак',
                id: 'lak',
                value: '',
                list: {
                    name: 'lacks',
                    data: this.props.lists.lack ? this.props.lists.lack : []
                }
            },
            {
                label: 'Присадка',
                id: 'prisadka',
                value: '',
                list: {
                    name: 'prisadki',
                    data: this.props.lists.prisadka ? this.props.lists.prisadka : []
                }
            },
            {
                label: 'Термошов',
                id: 'termoshov',
                value: '',
                list: {
                    name: 'termoshvi',
                    data: this.props.lists.termoshov ? this.props.lists.termoshov : []
                }
            },
            {
                label: 'Комментарий',
                id: 'comment',
                value: ''
            }
        ],
        body: {
            active: false,
            fields: [
                {
                    label: 'Номенклатура',
                    id: 'nomenklatura',
                    value: '',
                    list: {
                        name: 'nomenclature',
                        data: this.props.lists.nomenclature ? this.props.lists.nomenclature : []
                    }
                },
                {
                    label: 'Длина',
                    id: 'width',
                    value: ''
                },
                {
                    label: 'Ширина',
                    id: 'height',
                    value: ''
                },
                {
                    label: 'Кол-во',
                    id: 'kolVo',
                    value: ''
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
            data: []
        }
    }

    componentDidMount() {}

    componentDidUpdate(prevState) {
        if (this.state !== prevState) {
            this.renderTable()
            this.renderInputBody()
        }
    }

    changeState = (id, value) => {
        this.setState(({order}) => {
            return order[id] = value
        })
    }

    renderDatalist = (arr) => {
        return arr.map((user, i) => {
            return (
                <option key={i}>{user}</option>
            )
        })
    }

    renderInputHeader = () => {
        let list = []

        const {header, order} = this.state

        header.map(item => {
            if (item.id === 'comment') {
                list.push(
                    <>
                        <Col lg={2} className='mb-3 text-end'>
                            <Form.Label>
                                {item.label}
                            </Form.Label>
                        </Col>
                        <Col lg={10} className='mb-3'>
                            <Form.Control
                                value={order[item.id]}
                                onChange={e => this.changeState(item.id, e.target.value)}
                                type="text"
                                id={item.id}
                                placeholder={item.label}
                                list={item.list}
                                className='border-0 border-bottom rounded-0'
                            />
                        </Col>
                    </>
                )
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
                                <Form.Control
                                    required
                                    isValid={order[item.id]}
                                    isInvalid={!order[item.id]}
                                    value={order[item.id]}
                                    onChange={e => this.changeState(item.id, e.target.value)}
                                    type="text"
                                    id={item.id}
                                    placeholder={item.label}
                                    list={item.list.name}
                                    className='border-0 border-bottom rounded-0'
                                />
                                <datalist id={item.list.name}>
                                    {this.renderDatalist(item.list.data)}
                                </datalist>
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
                                <Form.Control
                                    required
                                    isValid={order[item.id]}
                                    isInvalid={!order[item.id]}
                                    value={order[item.id]}
                                    onChange={e => this.changeState(item.id, e.target.value)}
                                    type="text"
                                    id={item.id}
                                    placeholder={item.label}
                                    className='border-0 border-bottom rounded-0'
                                />
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

    renderTable = () => {
        let head = [],
            params = []

        this.state.body.fields.map((item) => {
            head.push(item.label)
            params.push(item.id)
        })

        return (
            <>
                <Thead title={head}/>
                <Tbody orders={this.state.order.data} params={params}/>
            </>
        )
    }

    renderInputBody = () => {
        let list = []

        this.state.body.fields.map((item, i) => {
            if (item.id === 'nomenklatura') {
                list.push(
                    <Col lg={3} key={i}>
                        <Form.Control
                            required
                            isValid={item.value}
                            value={item.value}
                            type="text"
                            id={item.id}
                            onChange={(e) => this.changeBodyValue(i, e.target.value)}
                            list={item.list.name}
                            placeholder={item.label}
                            className='border-0 border-bottom rounded-0'
                        />
                        <datalist id={item.list.name}>
                            {this.renderDatalist(item.list.data)}
                        </datalist>
                    </Col>
                )
            } else {
                list.push(
                    <Col lg={3} key={i}>
                        <Form.Control
                            required
                            isValid={item.value}
                            value={item.value}
                            type="text"
                            onChange={(e) => this.changeBodyValue(i, e.target.value)}
                            id={item.id}
                            placeholder={item.label}
                            className='border-0 border-bottom rounded-0'
                        />
                    </Col>
                )
            }
        })

        return (
            <Row className={`mb-3`}>
                {list}
            </Row>
        )
    }

    changeBodyValue = (id, value) => {
        this.setState(({body}) => body.fields[id].value = value)
    }

    addOrderData = () => {
        this.setState(({body, order}) => {
            let dataLine = {}

            body.fields.map(item => dataLine[item.id] = item.value)

            body.fields.map(item => item.value = '')

            return order.data.push(dataLine)
        })
    }

    render() {

        return (
            <MainLyout>
                <h2 className='text-center fw-bold mb-3'>Форма создания заказ</h2>
                <hr/>
                <Form>
                    <Row>
                        <Col lg={1}/>
                        <Col lg={10}>
                            {this.renderInputHeader()}
                        </Col>
                        <Col lg={1}/>

                        <hr/>

                        <Table>
                            {this.renderTable()}
                        </Table>

                        <hr/>

                        <Col lg={12}>
                            {this.renderInputBody()}
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

export async function getServerSideProps() {

    return {
        props: {
            lists: await getListsOrder()
        }
    }

}