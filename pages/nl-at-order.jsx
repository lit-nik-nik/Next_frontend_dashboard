import React, {Component} from "react";
import {withRouter} from "next/router";
import {getBarcodes} from "../services/at-order/get";
import {NologinLayout} from "../components/layout/nologin";
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
        const {link} = this.state

        const {barcodes, date} = this.props

        return (
            <NologinLayout
                title='Форма приема-передачи заказа'
                link={link}
                error={this.props.error}
            >
                <div className='m-3'>
                    <CompAccTransOrder barcodes={barcodes} />
                </div>

            </NologinLayout>
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