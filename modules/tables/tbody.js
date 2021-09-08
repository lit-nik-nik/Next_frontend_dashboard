import Link from "next/link"
import {Component} from "react";
import {Row, Col} from 'react-bootstrap'

export default class Tbody extends Component {

    state = {
        orders: [],
        tableParams: []
    }

    async componentDidMount() {
        await this.setState({
            orders: this.props.orders ? this.props.orders : [],
            tableParams: this.props.params ? this.props.params : []
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) await this.setState({
            orders: this.props.orders ? this.props.orders : [],
            tableParams: this.props.params ? this.props.params : []
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
        const {orders, tableParams} = this.state
        let line = []

        orders.map((order, i) => {
            let cell = []

            tableParams.map((param, index) => {

                if(param === 'FACT_DATE_FIRSTSAVE') cell.push(
                        <td className='align-middle text-center' style={{width: '10%'}} key={index}>
                            {order[param]}
                        </td>
                    )
                else if (param === 'ITM_ORDERNUM') cell.push(
                    <td className='align-middle text-center' style={{width: '16%'}} key={index}>
                        <Link href={`/order/${order.ID}`}>
                            <a>
                                {order[param]}
                            </a>
                        </Link>
                    </td>
                )
                else if (typeof(param) === 'object') cell.push(
                    <td className='align-middle text-center' key={index}>
                        {order[param[0]]} {order[param[1]]}
                    </td>
                )
                else {
                    cell.push(
                        <td className='align-middle text-center' style={{width: 'auto'}} key={index}>
                            {order[param]}
                        </td>
                    )
                }

            })

            line.push(
                <tr key={i}>
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