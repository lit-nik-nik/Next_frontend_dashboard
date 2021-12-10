import { MainLayout } from '../components/layout/main'
import React, {Component} from "react";
import {withRouter} from "next/router";
import {getBarcodes} from "../services/at-order/get";
import CompAccTransOrder from "../components/at-order/com-at-order";

class AccTransOrder extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        link: null
    }

    async componentDidMount() {
        this.setState({link: this.props.router.pathname})
    }

    // Отображение страницы
    render() {
        const {barcodes} = this.props

        return (
            <MainLayout
                title='Форма приема-передачи заказа'
                link={this.state.link}
                token={this.props.token}
                error={this.props.error}>

                <CompAccTransOrder barcodes={barcodes} />

            </MainLayout>
        )
    }
}

export default withRouter(AccTransOrder)

export async function getServerSideProps() {

    let barcodes, error

    await getBarcodes()
        .then(res  => barcodes = res.data.barcodes)
        .catch(err => error = err.response?.data)

    if (barcodes) {
        return {
            props: {
                barcodes
            }
        }
    }

    if (error) {
        return {
            props: {
                error
            }
        }
    }
}