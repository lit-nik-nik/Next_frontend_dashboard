import Link from "next/link"
import {Component} from "react";
import {Button, Col, Row} from "react-bootstrap";

export default class Tbody extends Component {

    state = {
        orders: [],
        params: [],
        hideComments: true
    }

    async componentDidMount() {
        await this.setState({
            orders: this.props.orders ? this.props.orders : [],
            params: this.props.params ? this.props.params : []
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) await this.setState({
            orders: this.props.orders ? this.props.orders : [],
            params: this.props.params ? this.props.params : []
        })
    }

    delOrder = async (id) => {
        let newArr = []

        this.state.orders.map((order, i) => {
            if (order.ID !== id) {
                newArr.push(order)
            }
        })

        await this.setState({orders: newArr})
    }

    addOrderLine = () => {
        const {orders, params} = this.state,
            {color} = this.props
        let line = []

        orders.map((order, i) => {
            let cell = []

            params.map((param, index) => {

                if(param === 'FACT_DATE_FIRSTSAVE') cell.push(
                        <td className='align-middle text-center' style={{width: '10%'}} key={index}>
                            {order[param]}
                        </td>
                    )
                else if (param === 'ITM_ORDERNUM' || param === 'itmOrderNum' || param === 'ORDER_NAME' || param === 'NAME') cell.push(
                    <td className='align-middle text-start' style={{width: 'auto'}} key={index}>
                        {order.id ? (
                            <Link href={`/order/${order.id}`}>
                                <a className='text-decoration-none text-dark ps-3'>
                                    {order[param]}
                                </a>
                            </Link>
                        ) : (
                            <Link href={`/order/${order.ID}`}>
                                <a className='text-decoration-none text-dark ps-3'>
                                    {order[param]}
                                </a>
                            </Link>
                        )}
                    </td>
                )
                else if (typeof(param) === 'object') cell.push(
                    <td className='align-middle text-center' key={index}>
                        {order[param[0]]} {order[param[1]]}
                    </td>
                )
                else if (param === 'datePlan' || param === 'PLAN_DATE' || param === 'TS' || param === 'DATE_ADDED' || param === 'TRANSFER_DATE') cell.push(
                    <td className='align-middle text-center' style={{width: '8%'}} key={index}>
                        {new Date(order[param]).toLocaleString().slice(0,10)}
                    </td>
                )
                else if (param === 'nameSectorInOrder') cell.push(
                    <td className='align-middle text-center' style={{width: '18%'}} key={index}>
                        <Row>
                            <Col>
                                {order[param]}
                            </Col>
                        </Row>
                    </td>
                )
                else if (param === 'ORDER_SQUARE' || param === 'fasadSquare' || param === 'ORDER_FASADSQ') cell.push(
                    <td className='align-middle text-center' style={{width: '8%'}} key={index}>
                        {Math.round(order[param] * 1000) / 1000}
                    </td>
                )
                else if (param === 'comments') {
                    if (order.data?.comments[0]) {
                        cell.push(
                            <td className='align-middle text-center' style={{width: 'auto'}} key={index}>
                                <Row className='w-100'>
                                    <Col>
                                        {order.data.comments.length > 1 ? (
                                            order.data.comments.map((comment, i) => {
                                                if (i === 0) {
                                                    return <div key={i} className='m-0'>
                                                        {comment.sector} ({comment.userName}) - {comment.text}
                                                        {this.state.hideComments ? ' ...' : null}
                                                    </div>
                                                } else {
                                                    return <div key={i} className='m-0' hidden={this.state.hideComments}>
                                                        {comment.sector} ({comment.userName}) - {comment.text}
                                                    </div>
                                                }
                                            })
                                        ) : (
                                            <div className='m-0'>{order.data.comments[0].sector} ({order.data.comments[0].userName}) - {order.data.comments[0].text}</div>
                                        )}
                                    </Col>
                                    <Col lg={3} className='text-end'>
                                        <Button
                                            variant='link'
                                            className='text-decoration-none text-dark p-0 m-0 ms-3'
                                            onClick={() => this.setState({hideComments: !this.state.hideComments})}
                                        >
                                            {this.state.hideComments ? 'Развернуть' : 'Скрыть'}
                                        </Button>
                                    </Col>
                                    <Col lg={1}>
                                        {order.data.edit}
                                    </Col>
                                </Row>
                            </td>
                        )
                    } else {
                        cell.push(
                            <td className='align-middle text-center' style={{width: 'auto'}} key={index}>
                                <Row  className='w-100'>
                                    <Col />
                                    <Col lg={1}>
                                        {order.data.edit}
                                    </Col>
                                </Row>
                            </td>
                        )
                    }
                }
                else if (param === 'COMMENT_PLAN' || param === 'NOTE') {
                    cell.push(
                        <td className='align-middle text-center' style={{width: 'auto'}} key={index}>
                            <Row>
                                <Col>
                                    {order[param]}
                                </Col>
                            </Row>
                        </td>
                    )
                }
                else cell.push(
                    <td className='align-middle text-center' style={{width: '12%'}} key={index}>
                        {order[param]}
                    </td>
                )

            })

            line.push(
                <tr key={i} className={color ? color : null}>
                    {cell}
                </tr>
            )
        })

        return line;
    }

    render() {
        return (
            <tbody>
                {this.addOrderLine()}
            </tbody>
        );
    }
}