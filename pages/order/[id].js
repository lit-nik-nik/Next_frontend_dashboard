import {Button, Col, Row, Alert, Table, ListGroup} from "react-bootstrap"
import {getImageOrder, getOrder} from "../../services/order/get"
import { MainLayout } from "../../components/layout/main"
import { withRouter } from 'next/router'
import {Component } from 'react'
import Thead from "../../modules/tables/thead";
import ModalImage from "../../modules/modals/modal-images";
import {getTokenCookies} from "../../modules/cookie";

class Order extends Component {

    state = {
        order: null,
        image: null,
        bodyTitle: [],
        headTitle: [
            {
                id: 1,
                label: '№ заказа на производстве',
                params: ['itmOrderNum']
            },
            {
                id: 2,
                label: 'Массив',
                params: ['fasadMaterial']
            },
            {
                id: 3,
                label: 'Цвет',
                params: ['color', 'colorType']
            },
            // {
            //     id: 4,
            //     label: 'Площадь сборки',
            //     params: ['squareFasad']
            // },
            // {
            //     id: 5,
            //     label: 'Площадь покраски',
            //     params: ['square']
            // },
            {
                id: 6,
                label: 'Модель профиля',
                params: ['fasadModel', 'profileWidth']
            },
            {
                id: 7,
                label: 'Патина',
                params: ['colorPatina', 'colorPatinaComment']
            },
            {
                id: 8,
                label: 'Филенка',
                params: ['filenkaModel', 'filenkaMaterial']
            },
            {
                id: 9,
                label: 'Лак',
                params: ['colorLak']
            },
            {
                id: 10,
                label: 'Материал филенки',
                params: ['filenkaMaterial']
            },
            {
                id: 11,
                label: 'Присадка',
                params: ['prisad']
            },
            {
                id: 12,
                label: 'Текстура',
                params: ['texture']
            },
            {
                id: 13,
                label: 'Термошов',
                params: ['termoshov']
            },
            {
                id: 14,
                label: 'Комментарий к заказу',
                params: ['comment']
            }
        ],
        modalView: false,
        idPage: null,
    }

    async componentDidMount() {
        if (this.props.order) await this.setState({order: this.props.order})
        if (this.props.image) await this.setState({image: this.props.image})

        if(this.state.order) this.filterBodyHeader()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            if (this.props.order) this.setState({order: this.props.order})
            else this.setState({order: null})

            if (this.props.image) this.setState({image: this.props.image})
            else this.setState({image: null})
        }
    }

    filterBodyHeader = async () => {
        let bodyHeader = ['№']

        for (let key in this.state.order.body[0]) {
            if (key === 'name') bodyHeader.push('Номенклатура')
            if (key === 'height') bodyHeader.push('Длина')
            if (key === 'width') bodyHeader.push('Ширина')
            if (key === 'amount') bodyHeader.push('Кол-во')
            if (key === 'square') bodyHeader.push('S')
            if (key === 'priceCost') bodyHeader.push('Цена')
            if (key === 'cost') bodyHeader.push('Стоимость')
            if (key === 'comment') bodyHeader.push('Примечание')
        }

        await this.setState({bodyTitle: bodyHeader})
    }

    headerRender = (obj) => {

        let header = []

        const {headTitle} = this.state

        headTitle.map(item => {
            const dataOne = obj[`${item.params[0]}`] ? obj[`${item.params[0]}`] : '',
                dataTwo = obj[`${item.params[1]}`] ? ' (' + obj[`${item.params[1]}`] + ')' : '',
                dataAll = item.params[1] ? dataOne + dataTwo : dataOne

            if (obj[`${item.params[0]}`]) {
                if (item.params.includes('itmOrderNum') || item.params.includes('comment')) {
                    header.push(
                        <>
                            <Col lg={2} className='text-end fw-bold'>
                                {item.label}:
                            </Col>
                            <Col lg={10} className='border-bottom text-start'>
                                {dataAll}
                            </Col>
                        </>
                    )
                }
                else if (item.params.includes('squareFasad') || item.params.includes('square')) {
                    header.push(
                        <>
                            <Col lg={2} className='text-end fw-bold'>
                                {item.label}:
                            </Col>
                            <Col lg={4} className='border-bottom text-start'>
                                {Math.round(dataAll * 1000) / 1000} м2
                            </Col>
                        </>
                    )
                }
                else {
                    header.push(
                        <>
                            <Col lg={2} className='text-end fw-bold'>
                                {item.label}:
                            </Col>
                            <Col lg={4} className='border-bottom text-start'>
                                {dataAll}
                            </Col>
                        </>
                    )
                }
            } else header.push(<Col lg={6}/>)
        })

        return (
            <Row className='mb-3' style={{fontSize: 16}}>
                {header}
            </Row>
        )
    }

    addLineBody = (obj, lineNumber, prevName) => {
        let cells = []

        cells.push(<td>{lineNumber}</td>)

        for (let key in obj) {
            if (key === 'name') {
                if (obj[key] === prevName) {
                    cells.push(<td className='text-start ps-3'/>)
                } else {
                    cells.push(<td className='text-start ps-3'>{obj[key]}</td>)
                }

            }

            if (
                key === 'height' ||
                key === 'width'
            ) cells.push(<td>{obj[key]}</td>)

            if (
                key === 'amount'
            ) cells.push(<td style={{width: '6%'}}>{obj[key]}</td>)
        }

        for (let key in obj) {
            if (key === 'square') {
                const MEASURE_UNIT = obj.unit ? obj.unit : ''
                let SQUARE

                if (obj.square === 0) SQUARE = ''
                else SQUARE = Math.round(obj[key] * 1000) / 1000

                cells.push(<td style={{width: '8%'}}>{`${SQUARE} ${MEASURE_UNIT}`}</td>)
            }
        }

        for (let key in obj) {
            if (
                key === 'priceCost' ||
                key === 'cost'
            ) cells.push(<td>{Math.round(+obj[key] * 100) / 100}</td>)

            if (key === 'comment') cells.push(<td className='text-start ps-3'>{obj[key]}</td>)
        }

        return cells
    }

    bodyRender = (obj) => {
        let bodyLines = [],
            prevName

        obj.map((item, i) => {
            if (item.name !== prevName) {
                bodyLines.push(
                    <tr key={i} className='table-light'>
                        {this.addLineBody(item, i+1, prevName)}
                    </tr>
                )
                prevName = item.name
            } else {
                bodyLines.push(
                    <tr key={i} className='table-light'>
                        {this.addLineBody(item, i+1, prevName)}
                    </tr>
                )
            }



        })

        return (
            <Table variant={'dark'} responsive bordered hover size='sm' className='small text-center' style={{fontSize: 16}}>
                <Thead title={this.state.bodyTitle} />
                <tbody>
                    {bodyLines}
                </tbody>
            </Table>
        )
    }

    planRender = (obj) => {
        let listItems = []

        obj.map(item => {
            listItems.push(
                <ListGroup.Item action variant="light" className='text-dark' key={item.id}>
                    <Row>
                        <Col className='fw-bold'>
                            {item.dateSector}:
                        </Col>
                        <Col lg={3} className='text-end fst-italic me-2'>
                            {new Date(item.date).toLocaleDateString()}
                        </Col>
                    </Row>
                </ListGroup.Item>
            )
        })

        return (
            <ListGroup>
                {listItems}
            </ListGroup>
        )
    }

    render () {
        const {order, image} = this.state

        let header, body, plans

        if (order) {
            header = order.header
            body = order.body
            plans = order.plans
        }

        return (
            <MainLayout title={`Заказ № ${order ? header[0].id : '_'}`} token={this.props.token} error={this.props.error}>
                <Row className='my-2'>
                    <Col lg={9}>
                        <Row>
                            <Col lg={2}>
                                <Button variant='outline-dark' onClick={() => this.props.router.back()}>
                                    Вернуться назад
                                </Button>
                            </Col>
                            <Col lg={8} className='mt-2'>
                                <h4 className='text-center fw-bold text-uppercase fst-italic m-0'>
                                    Заказ № {order ? header[0].id : '_'}
                                </h4>
                            </Col>
                            <Col lg={2}>
                                <Alert variant='light' className='p-2 text-end m-0'>
                                    <b>Менеджер: </b>{order ? header[0].manager : '_'}
                                </Alert>
                            </Col>
                        </Row>

                        <hr/>

                        <Row>
                            <Col>
                                {order ? this.headerRender(header[0]) : null}
                                {order ? this.bodyRender(body) : null}
                            </Col>
                        </Row>
                    </Col>

                    <Col lg={3}>
                        {order ? (
                            <Row className='text-center'>
                                <Col lg={6}>
                                    <Alert variant='secondary' className='p-0 py-2'>
                                        <p className='mb-1' style={{fontSize: '14px'}}>Площадь сборки</p>
                                        <b>{Math.round(header[0].squareFasad * 1000) / 1000} м2</b>
                                    </Alert>
                                </Col>
                                <Col lg={6}>
                                    <Alert variant='secondary' className='p-0 py-2'>
                                        <p className='mb-1' style={{fontSize: '14px'}}>Площадь покраски</p>
                                        <b>{Math.round(header[0].square * 1000) / 1000} м2</b>
                                    </Alert>
                                </Col>
                            </Row>
                        ) : null}
                        <h4 className='text-center fw-bold'>План изготовления заказа:</h4>
                        {order ? this.planRender(plans) : null}
                        {image ? (
                            <div className='text-center'>
                                <h4 className='fw-bold my-3'>Приложение к заказу:</h4>
                                <img
                                    src={`data:image/jpeg;base64,${image}`}
                                    alt="test"
                                    width={300}
                                    className='rounded-3 shadow'
                                    onClick={() => this.setState({modalView: true})}
                                />
                            </div>
                        ) : null}
                    </Col>
                </Row>




                <ModalImage
                    show={this.state.modalView}
                    onHide={()=> this.setState({modalView: false})}
                    data={this.state.image}
                />
            </MainLayout>
        )
    }
}

export default withRouter(Order)

export async function getServerSideProps({req, query}) {

    const token = getTokenCookies(req.headers.cookie),
        id = query.id

    let order, image, error

    await getOrder(id, token)
        .then(res  =>  order = res.data.order)
        .catch(err => {
            if (err.response) error = err.response.data
            else error = err.code
        })

    await getImageOrder(id, token)
        .then(res => image = res)
        .catch(err => err)

    if (order) {
        return {
            props: {
                order,
                image
            }
        }
    } else if (error) {
        return {
            props: {
                error
            }
        }
    }
}