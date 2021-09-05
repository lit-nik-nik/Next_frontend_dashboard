import {Component} from "react";
import Link from "next/link";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export default class NavbarMini extends Component {

    state = {
        menu: [
            {
                label: 'Панель управления',
                link: '/',
                icon: 'bi-house-door-fill'
            },
            {
                label: 'Журнал заказов',
                link: '/orders/1',
                icon: 'bi-table'
            },
            {
                label: 'Прием-передача заказа',
                link: '/at-order',
                icon: 'bi-grid'
            },
            {
                label: 'Добавить заказ',
                link: '/order/create',
                icon: 'bi-plus-circle-fill'
            }
        ]
    }

    renderTooltip = (item, props) => (
        <Tooltip id="button-tooltip" {...props}>
            {item.label}
        </Tooltip>
    );


    createMenu = () => {
        let menu = []
        const {link} = this.props

        this.state.menu.map((item, i) => {
            menu.push(
                <OverlayTrigger
                    placement='right'
                    delay={{ show: 250, hide: 400 }}
                    overlay={this.renderTooltip(item)}
                >
                    <li className="nav-item" key={i}>
                        <Link href={item.link}>
                            <a
                                className={`nav-link link-dark m-1 py-2 px-3 ${link === item.link ? 'active' : ''}`}
                                style={{fontSize: 18}}
                            >
                                <i className={`bi ${item.icon}`} />
                            </a>
                        </Link>
                    </li>
                </OverlayTrigger>
            )
        })

        return menu
    }

    render() {

        return (
            <div className={`d-flex flex-column flex-shrink-0 bg-light position-fixed border-end`} style={{height: '95vh'}}>
                <ul className="nav nav-pills flex-column mb-auto">
                    {this.createMenu()}
                </ul>
            </div>
        )
    }
}

