import {Button, Col, Row, InputGroup, FormControl, Table, ListGroup} from "react-bootstrap"
import {getImageOrder, getOrder} from "../../services/order/get"
import { MainLyout } from "../../components/layout/main"
import { withRouter } from 'next/router'
import {Component } from 'react'
import Thead from "../../modules/tables/thead";
import ModalImage from "../../modules/modals/modal-images";

export default withRouter(class Order extends Component {

    state = {
        order: this.props.data.order,
        image: this.props.data.image,
        bodyTitle: [],
        headTitle: [
            {
                id: 1,
                label: '№ заказа на производстве',
                params: ['ITM_ORDERNUM']
            },
            {
                id: 2,
                label: 'Массив',
                params: ['FASAD_MAT']
            },
            {
                id: 3,
                label: 'Цвет',
                params: ['COLOR', 'COLOR_TYPE']
            },
            {
                id: 4,
                label: 'Модель профиля',
                params: ['FASAD_MODEL', 'FASAD_PG_WIDTH']
            },
            {
                id: 5,
                label: 'Патина',
                params: ['COLOR_PATINA', 'COLOR_PATINA_COMMENT']
            },
            {
                id: 6,
                label: 'Филенка',
                params: ['FIL_MODEL', 'FIL_MAT']
            },
            {
                id: 7,
                label: 'Лак',
                params: ['COLOR_LAK']
            },
            {
                id: 8,
                label: 'Материал филенки',
                params: ['FIL_MAT']
            },
            {
                id: 9,
                label: 'Присадка',
                params: ['PRISAD']
            },
            {
                id: 10,
                label: 'Текстура',
                params: ['TEXTURE']
            },
            {
                id: 11,
                label: 'Термошов',
                params: ['TERMOSHOV']
            },
            {
                id: 12,
                label: 'Комментарий к заказу',
                params: ['PRIMECH']
            }
        ],
        modalView: false
    }

    componentDidMount() {
        this.filterBodyHeader()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({
                order: this.props.data.order,
                image: this.props.data.image
            })
        }
    }

    filterBodyHeader = () => {
        let bodyHeader = ['№']

        for (let key in this.state.order.body[0]) {
            if (key === 'NAME') bodyHeader.push('Номенклатура')
            if (key === 'HEIGHT') bodyHeader.push('Длина')
            if (key === 'WIDTH') bodyHeader.push('Ширина')
            if (key === 'EL_COUNT') bodyHeader.push('Кол-во')
            if (key === 'SQUARE') bodyHeader.push('S')
            if (key === 'PRICE_COST') bodyHeader.push('Цена')
            if (key === 'COST') bodyHeader.push('Стоимость')
            if (key === 'CALC_COMMENT') bodyHeader.push('Примечание')
        }

        this.setState({bodyTitle: bodyHeader})
    }

    headerRender = (obj) => {
        let header = []

        const {headTitle} = this.state

        headTitle.map(item => {
            const dataOne = obj[`${item.params[0]}`] ? obj[`${item.params[0]}`] : '',
                dataTwo = obj[`${item.params[1]}`] ? ' (' + obj[`${item.params[1]}`] + ')' : '',
                dataAll = item.params[1] ? dataOne + dataTwo : dataOne

            if (obj[`${item.params[0]}`]) {
                if (item.id === 1 || item.id === 12) {
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
                } else {
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
            <Row className='mb-3' style={{fontSize: 18}}>
                {header}
            </Row>
        )
    }

    addLineBody = (obj, lineNumber) => {
        let cells = []

        cells.push(<td>{lineNumber}</td>)

        for (let key in obj) {
            if (key === 'NAME') cells.push(<td className='text-start ps-3'>{obj[key]}</td>)

            if (
                key === 'HEIGHT' ||
                key === 'WIDTH' ||
                key === 'EL_COUNT'
            ) cells.push(<td>{obj[key]}</td>)
        }

        for (let key in obj) {
            if (key === 'SQUARE') {
                const MEASURE_UNIT = obj.MEASURE_UNIT ? obj.MEASURE_UNIT : ''
                let SQUARE

                if (obj.SQUARE === 0) SQUARE = ''
                else SQUARE = Math.round(obj[key] * 1000) / 1000

                cells.push(<td>{`${SQUARE} ${MEASURE_UNIT}`}</td>)
            }
        }

        for (let key in obj) {
            if (
                key === 'PRICE_COST' ||
                key === 'COST'
            ) cells.push(<td>{Math.round(+obj[key] * 100) / 100}</td>)

            if (key === 'CALC_COMMENT') cells.push(<td className='text-start ps-3'>{obj[key]}</td>)
        }

        return cells
    }

    bodyRender = (obj) => {
        let bodyLines = []

        obj.map((item, i) => {
            bodyLines.push(
                <tr key={i}>
                    {this.addLineBody(item, i+1)}
                </tr>
            )
        })

        return (
            <Table responsive hover size='sm' className='small text-center' style={{fontSize: 20}}>
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
                <ListGroup.Item action variant="light" className='text-dark' key={item.ID}>
                    <Row>
                        <Col className='fw-bold'>
                            {item.DATE_SECTOR}:
                        </Col>
                        <Col lg={3} className='text-end fst-italic'>
                            {item.PLAN_DATE}
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

        const {header, body, plans} = order

        return (
            <MainLyout title={`Заказ № ${header[0].ID}`}>
                <Row>
                    <Col lg={2}>
                        <Button variant='outline-dark' onClick={() => this.props.router.back()}>
                            Вернуться назад
                        </Button>
                    </Col>
                    <Col lg={5} className='mb-4'>
                        <h4 className='text-center fw-bold text-uppercase fst-italic'>
                            Заказ № {header[0].ID}
                        </h4>
                    </Col>
                    <Col lg={2}>
                        <p className='text-end mb-4 text-muted'><b>Менеджер:</b> {header[0].MANAGER}</p>
                    </Col>
                    <Col lg={3}/>


                    <Col lg={9}>
                        {this.headerRender(header[0])}
                        {this.bodyRender(body)}
                    </Col>
                    <Col lg={3}>
                        <h4 className='text-center fw-bold'>План изготовления заказа:</h4>
                        {this.planRender(plans)}
                        <div className='text-center'>
                            <h4 className='fw-bold my-3'>Изображение товара</h4>
                            <img
                                src={`data:image/jpeg;base64,${image}`}
                                alt="test"
                                width={300}
                                className='rounded-3 shadow'
                                onClick={() => this.setState({modalView: true})}
                            />
                        </div>
                    </Col>
                </Row>

                <ModalImage
                    show={this.state.modalView}
                    onHide={()=> this.setState({modalView: false})}
                    data={this.state.image}
                />
            </MainLyout>
        )
    }
})

export async function getServerSideProps({query}) {
    let data;

    const order = await getOrder(query.id)
    const image = await getImageOrder(query.id)

    data = {
        order: order,
        image: image
    }

    return {
        props: { data }
    }
}