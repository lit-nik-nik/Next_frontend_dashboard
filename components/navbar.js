import {Component} from "react";
import Link from "next/link";

export default class Navbar extends Component {

    state = {
        menu: []
    }

    async componentDidMount() {
        if(this.props.menu) await this.setState({menu: this.props.menu})
    }

    createMenu = () => {
        let menu = []
        const {link} = this.props

        this.state.menu.map((item, i) => {
            menu.push(
                <li className="nav-item" key={i}>
                    <Link href={item.link}>
                        <a className={`nav-link link-dark my-1 ${link === item.link ? 'active' : ''}`} style={{fontSize: 18}}>
                            <i className={`me-2 bi ${item.icon}`} />
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
            <div className={`d-flex flex-column flex-shrink-0 p-3 bg-light position-fixed col-lg-2 border-end`} style={{height: '95vh'}}>
                <ul className="nav nav-pills flex-column mb-auto">
                    {this.createMenu()}
                </ul>
            </div>
        )
    }
}

