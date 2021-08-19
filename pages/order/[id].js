import {Button, Col, Row, InputGroup, FormControl, Table, ListGroup} from "react-bootstrap"
import { getOrder } from "../../services/orders/get"
import { MainLyout } from "../../components/layout/main"
import { withRouter } from 'next/router'
import {Component } from 'react'
import Thead from "../../modules/tables/thead";

export default withRouter(class ChangeOrder extends Component {

    state = {
        order: this.props.order,
        nameHead: [
            '№',
            'Номенклатура',
            'Длина',
            'Ширина',
            'Кол-во',
            'Ед.изм.',
            'Цена',
            'Стоимость',
            'Примечание'
        ],
    }

    headerRender = (obj) => {

        const header =
            <Row>
                <Col lg={12}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>№ заказа на производстве:</b></InputGroup.Text>
                        <FormControl value={obj.ITM_ORDERNUM} readOnly className='text-center' />
                    </InputGroup>
                </Col>

                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Массив:</b></InputGroup.Text>
                        <FormControl value={obj.FASAD_MAT} readOnly className='text-center' />
                    </InputGroup>
                </Col>

                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Цвет:</b></InputGroup.Text>
                        <FormControl value={`${obj.COLOR} (${obj.COLOR_TYPE})`} readOnly className='text-center' />
                    </InputGroup>
                </Col>
                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Модель профиля:</b></InputGroup.Text>
                        <FormControl value={`${obj.FASAD_MODEL} (${obj.FASAD_PG_WIDTH} мм)`} readOnly className='text-center' />
                    </InputGroup>
                </Col>

                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Патина:</b></InputGroup.Text>
                        <FormControl value={`${obj.COLOR_PATINA} (${obj.COLOR_PATINA_COMMENT})`} readOnly className='text-center' />
                    </InputGroup>
                </Col>
                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Филенка:</b></InputGroup.Text>
                        <FormControl value={`${obj.FIL_MODEL} (${obj.FIL_MAT})`} readOnly className='text-center' />
                    </InputGroup>
                </Col>

                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Лак:</b></InputGroup.Text>
                        <FormControl value={`${obj.COLOR_LAK}`} readOnly className='text-center' />
                    </InputGroup>
                </Col>
                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Материал филенки:</b></InputGroup.Text>
                        <FormControl value={`${obj.FIL_MAT}`} readOnly className='text-center' />
                    </InputGroup>
                </Col>

                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Присадка:</b></InputGroup.Text>
                        <FormControl value={`${obj.PRISAD}`} readOnly className='text-center' />
                    </InputGroup>
                </Col>

                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Текстура:</b></InputGroup.Text>
                        <FormControl value={`${obj.TEXTURE}`} readOnly className='text-center' />
                    </InputGroup>
                </Col>

                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Термошов:</b></InputGroup.Text>
                        <FormControl value={`${obj.TERMOSHOV}`} readOnly className='text-center' />
                    </InputGroup>
                </Col>

                <Col lg={12}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><b>Комментарий к заказу:</b></InputGroup.Text>
                        <FormControl as="textarea" value={obj.PRIMECH} readOnly className='text-center' />
                    </InputGroup>
                </Col>
            </Row>

        return header
    }

    addLineBody = (obj, lineNumber) => {

        let cells = []

        cells.push(<td key={Math.floor(Math.random() * 101)}>{lineNumber}</td>)

        for (let key in obj) {
            if (
                key === 'NAME' ||
                key === 'HEIGHT' ||
                key === 'WIDTH' ||
                key === 'EL_COUNT'
            ) cells.push(<td key={Math.floor(Math.random() * 101)}>{obj[key]}</td>)

        }

        cells.push(<td key={Math.floor(Math.random() * 101)}>...</td>)

        for (let key in obj) {
            if (
                key === 'PRICE_COST' ||
                key === 'COST' ||
                key === 'CALC_COMMENT'
            ) cells.push(<td key={Math.floor(Math.random() * 101)}>{obj[key]}</td>)
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
            <Table responsive hover size='sm' className='small text-center' style={{fontSize: 14}}>
                <Thead title={this.state.nameHead} />
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
        const {header, body, plans} = this.state.order

        return (
            <MainLyout title={`Заказ № ${header[0].ID}`}>
                <Row>
                    <Col lg={2}>
                        <Button variant='outline-dark' onClick={() => this.props.router.back()}>
                            Вернуться назад
                        </Button>
                    </Col>
                    <Col lg={10} className='mb-4'>
                        <h4 className='text-center fw-bold text-uppercase fst-italic'>
                            Заказ № {header[0].ID}
                        </h4>
                    </Col>


                    <Col lg={8}>
                        {this.headerRender(header[0])}
                        {this.bodyRender(body)}
                    </Col>
                    <Col lg={4}>
                        <h3 className='text-center fw-bold'>План изготовления заказа:</h3>
                        {this.planRender(plans)}
                    </Col>
                </Row>
            </MainLyout>
        )
    }
})

export async function getServerSideProps({query}) {

    return await getOrder(query.id);
}