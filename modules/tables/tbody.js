import Link from "next/link"
import {changeDate} from "../change-data";
import {colorDelay} from "../color-delay";
import {Component} from "react";

export default class Tbody extends Component {

    state = {
        orders: [],
    }

    async componentDidMount() {
        await this.setState({orders: this.props.orders})
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) await this.setState({orders: this.props.orders})
    }

    delOrder = async (id) => {
        let newArr = []

        this.state.orders.map((order, i) => {
            if (order.ORDER_ID !== id) {
                newArr.push(order)
            }
        })

        await this.setState({orders: newArr})
    }

    orderLine = (arr) => {

        return arr.map((order, index) => {
            return (
                <tr key={index}>
                    <td className='align-middle text-center'>
                        {changeDate(order.DATE_PACK)}
                    </td>
                    <td className='align-middle text-center' style={{width: 200}}>
                        <Link href={`/order/change/${order.ORDER_ID}`}>
                            <a>
                                {order.ITM_ORDERNUM}
                            </a>
                        </Link>

                    </td>
                    <td className='align-middle text-center' style={{width: 150}}>
                        {order.PACK_TYPE}
                    </td>
                    <td className='align-middle text-center' style={{width: 100}}>
                        {order.BOX_COUNT}
                    </td>
                    <td className='align-middle text-center'>
                        {changeDate(order.PLAN_DATE)}
                    </td>
                    {colorDelay(order.DELAY)}
                    <td className='align-middle text-center' style={{width: 100}}>
                        {order.ORDER_TOTAL_COST} Р
                    </td>
                    <td className='align-middle text-center' style={{width: 100}}>
                        {order.ORDER_DEBT} Р
                    </td>
                    <td className='align-middle text-center' style={{width: 350}}>
                        {order.COMMENT}
                    </td>
                    <td className='align-middle text-center' style={{width: 100}}>
                        {order.CITY}
                    </td>
                    <td className='align-middle text-center' style={{width: 150}}>
                        {order.STATUS_DESCRIPTION}
                    </td>
                    <td className='align-middle text-center'>
                        {changeDate(order.TS)}
                    </td>
                    <td className='align-middle text-center'>
                        <a onClick={() => this.delOrder(order.ORDER_ID)}>
                            <i className="bi bi-x-octagon text-danger" style={{fontSize: 16}}/>
                        </a>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <tbody>
                {this.orderLine(this.state.orders)}
            </tbody>
        );
    }
}