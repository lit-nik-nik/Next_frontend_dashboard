import MainLayout from '../components/layout/main'
import React, {Component} from "react";
import {withRouter} from "next/router";
import ComAccTransOrder from "../components/at-order/com-at-order";

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
        return (
            <MainLayout
                title='Форма приема-передачи заказа'
                link={this.state.link}
                token={this.props.token}
            >

                <ComAccTransOrder />

            </MainLayout>
        )
    }
}

export default withRouter(AccTransOrder)