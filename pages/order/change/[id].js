import { Button, Col, Row, Table, Form } from "react-bootstrap"
import { getOrder } from "../../services/packages/get"
import { MainLyout } from "../../components/layout/main"
import { withRouter } from 'next/router'
import {changeDate} from "../../modules/change-data";
import {Component } from 'react'
import {patchOrder} from "../../services/packages/patch";

export default withRouter(class ChangeOrder extends Component {

    state = {
        order: this.props.order,
        status: [
            'Черновик',
            'Заказ посчитан',
            'На проверке (1)',
            'На оформлении',
            'В работе',
            'Упакован частично',
            'Упакован полностью',
            'Отгружен полностью'
        ]
    }

    orderStatus = () => {
        return this.state.status.map((item, i) => <option key={i} value={item}>{item}</option>)
    }

    addPdf = () => {
        const {order} = this.state

        const year = order.PLAN_DATE.match(/\d\d\d\d/)[0];
        const date = order.ITM_ORDERNUM.match(/\d\d\.\d\d/) ? order.ITM_ORDERNUM.match(/\d\d\.\d\d/)[0] : null;
        const numberOrder = order.ORDER_ID;
        const errorLink = <p className='text-center text-muted'>Файл заказа не существует</p>;

        if (date) {
            const monthNum = date.match(/\d\d$/)[0]
            const fullDate = date + '.' + year;
            const monthText = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
            const month = monthText[+monthNum.slice(1)-1];
            const link = `//lk.massiv-yug.ru/order_files/${year}/${month}/${numberOrder}/Документы/Рассчет для Клиента ${order.ITM_ORDERNUM} ${fullDate}.pdf`

            const obj =
                <object>
                    <embed
                        src={link}
                        width="100%"
                        height="750"/>
                </object>

            return obj
        }
        else return errorLink
    }

    changeOrder = async (e) => {
        await this.setState(({order}) => {
            order.STATUS_DESCRIPTION = e.target.value
            return order.STATUS_DESCRIPTION
        })

        const data = {STATUS_DESCRIPTION: this.state.order.STATUS_DESCRIPTION}

        await patchOrder(this.state.order.ORDER_ID, data)
    }

    render () {
        const {order} = this.state

        console.log(this.props)

        return (
            <MainLyout title={`Заказ № ${order.ORDER_ID}`}>
                <div className='text-center mb-3'>
                    <Button variant='dark' onClick={() => this.props.router.back()}>
                        Вернуться назад
                    </Button>
                </div>

                <Row>
                    <Col className='border mx-3 p-0' sm={6}>
                        {this.addPdf()}
                    </Col>
                    <Col className='border p-0'>
                        <h2 className='text-center fw-bold my-3'>Заказ № {order.ORDER_ID}</h2>
                        <hr/>
                        <Table striped hover>
                            <tbody>
                            <tr>
                                <td className='fw-bold w-50'>Наименование заказа:</td>
                                <td>{order.ITM_ORDERNUM}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Дата заказа:</td>
                                <td>{order.ITM_ORDERNUM.match(/\d\d\.\d\d/)}.{order.PLAN_DATE.match(/\d\d\d\d/)}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Стоимость:</td>
                                <td>{order.ORDER_TOTAL_COST} Р</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Долг:</td>
                                <td>{order.ORDER_DEBT} Р</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Статус заказа:</td>
                                <td>
                                    <Form.Select size="sm" value={order.STATUS_DESCRIPTION} onChange={this.changeOrder}>
                                        {this.orderStatus()}
                                    </Form.Select>
                                </td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Дата упаковки заказа:</td>
                                <td>{changeDate(order.DATE_PACK)}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Кол-во упаковок:</td>
                                <td>{order.BOX_COUNT}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Статус упаковки заказа:</td>
                                <td>{order.PACK_TYPE}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Планируемая дата выполнения заказа:</td>
                                <td>{changeDate(order.PLAN_DATE)}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Город доставки:</td>
                                <td>{order.CITY}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Примечание:</td>
                                <td>{order.COMMENT ? order.COMMENT : 'Коментарий отсутствует'}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </MainLyout>
        )
    }
})

export async function getServerSideProps({query}) {

    return await getOrder(query.id);
}