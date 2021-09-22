import {Component} from "react";
import Link from "next/link";

export default class Navbar extends Component {

    async componentDidMount() {
    }

    createMenu = () => {
        const {link, menu} = this.props
        let newMenu = []

        if (menu) {
            menu.map((item, i) => {
                newMenu.push(
                    <li className="nav-item" key={i}>
                        <Link href={item.link}>
                            <a className={`nav-link link-dark my-1 ${link === item.link ? 'active bg-dark' : ''}`} style={{fontSize: 18}}>
                                <i className={`me-2 bi ${item.icon}`} />
                                {item.label}
                            </a>
                        </Link>
                    </li>
                )
            })
        }

        return newMenu
    }

    render() {
        return (
            <div className={`d-flex flex-column flex-shrink-0 p-3 bg-light position-fixed col-lg-2 border-end`} style={{height: '95vh'}}>
                <ul className="nav nav-pills flex-column mb-auto">
                    {this.createMenu()}
                </ul>
            </div>
        )
    }
}

