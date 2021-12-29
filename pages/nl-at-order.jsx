import React, {Component} from "react";
import {withRouter} from "next/router";
import {NologinLayout} from "../components/layout/nologin";
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
            <NologinLayout
                title='Форма приема-передачи заказа'
                link={this.state.link}
            >
                <div className='m-3'>
                    <ComAccTransOrder />
                </div>

            </NologinLayout>
        )
    }
}

export default withRouter(AccTransOrder)
