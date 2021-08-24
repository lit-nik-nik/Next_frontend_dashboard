import {Component} from "react";
import Link from "next/link";

export default class Navbar extends Component {

    state = {
        menu: [
            {
                label: 'Панель управления',
                link: '/'
            },
            {
                label: 'Журнал заказов',
                link: '/orders/1'
            },
            {
                label: 'Добавить заказ',
                link: '/order/create'
            },
            {
                label: 'Авторизация',
                link: '/auth'
            },
        ]
    }

    createMenu = () => {
        let menu = []

        this.state.menu.map((item, i) => {
            menu.push(
                <li className="nav-item" key={i}>
                    <Link href={item.link}>
                        <a className="nav-link link-dark">
                            {item.label}
                        </a>
                    </Link>
                </li>
            )
        })

        return menu
    }

    render() {
        return (
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-light position-fixed col-lg-2 border-end" style={{height: '95vh'}}>
                <ul className="nav nav-pills flex-column mb-auto">
                    {this.createMenu()}
                </ul>
            </div>
        )
    }
}

