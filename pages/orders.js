import {Component} from "react";
import {MainLyout} from "../components/layout/main";
import Thead from "../modules/tables/thead";
import Tbody from "../modules/tables/tbody";
import {Col, Card, Row, ListGroup, Table} from "react-bootstrap";
import {getAllOrders} from "../services/orders/get";


export default class Orders extends Component {

    state = {
        orders: this.props.data,
        titleTable: [
            'Дата упаковки',
            'Заказ',
            'Упакован',
            'Кол-во упаковок',
            'План',
            'Опоздание',
            'Стоимость',
            'Долг',
            'Примечание',
            'Город',
            'Статус',
            'TS',
            ''
        ]
    }

    CardRender = (arr) => {
        return arr.map((order, index) => {
            let item = [];

            for (let key in order) {
                item.push(<ListGroup.Item><b>{key}:</b> {order[key] ? order[key] : 'Данные отсутствуют'}</ListGroup.Item>)
            }

            return (
                <Col sm={3} key={index}>
                    <Card>
                        <ListGroup variant="flush">
                            {item}
                        </ListGroup>
                    </Card>
                </Col>
            )
        })
    }

    render() {
        const {orders} = this.state
        return (
            <MainLyout title='Журнал заказов'>
                {/*<Table responsive hover size='sm' className='small' style={{fontSize: 14}}>*/}
                {/*    <Thead title={this.state.titleTable} />*/}
                {/*    /!*<Tbody orders={orders}/>*!/*/}
                {/*</Table>*/}
                <Row>
                    {this.CardRender(orders)}
                </Row>
            </MainLyout>
        )
    }
}

export async function getServerSideProps() {

    return getAllOrders()
}
