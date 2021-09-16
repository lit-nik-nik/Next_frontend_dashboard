import {Component} from "react";
import Link from "next/link";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {globalState} from "../data/globalState";

export default class NavbarMini extends Component {

    state = {
        menu: []
    }

    componentDidMount() {
        this.setState({menu: globalState.menu})
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
                    key={i}
                >
                    <li className="nav-item">
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

