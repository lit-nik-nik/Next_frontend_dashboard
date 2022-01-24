import React, {Component} from "react";
import {connect} from "react-redux";
import Link from "next/link";
import {Dropdown, Nav, OverlayTrigger, Tooltip} from "react-bootstrap";
import Version from "../modules/version";

class NavbarMini extends Component {

    state = {
        links: null
    }

    componentDidMount() {
        this.addLinks()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user !== prevProps.user) this.addLinks()
    }

    addLinks = () => {
        let links = []

        if (this.props.user) {
            links = this.props.user.links
        }

        this.setState({links})
    }

    renderTooltip = (item, props) => (
        <Tooltip id="button-tooltip" {...props}>
            {item.label}
        </Tooltip>
    );

    createMenu = () => {
        const {link, menu} = this.props
        const {links} = this.state
        let newMenu = []

        if (menu && links) {
            menu.map((item, i) => {
                let menuItem

                if (item.submenu) {
                    let subItem = []

                    item.submenu.map((sub, iS) => {
                        if (item.id === 'journals') {
                            subItem.push(
                                <Link href={`${sub.link}`} key={iS}>
                                    <a className={`nav-link ${link === sub.link ? 'active bg-dark link-light' : 'link-dark'}`} style={{fontSize: 18}}>
                                        <i className={`me-2 bi ${sub.icon}`} />
                                        {sub.label}
                                    </a>
                                </Link>
                            )
                        } else {
                            links.map(perm => {
                                if (perm.link === sub.link) {
                                    subItem.push(
                                        <Link href={`${sub.link}`} key={iS}>
                                            <a className={`nav-link ${link === sub.link ? 'active bg-dark link-light' : 'link-dark'}`} style={{fontSize: 18}}>
                                                <i className={`me-2 bi ${sub.icon}`} />
                                                {sub.label}
                                            </a>
                                        </Link>
                                    )
                                }
                            })
                        }
                    })
                    if (subItem[0]) {
                        menuItem =
                            <Dropdown drop='end' autoClose key={i}>
                                <OverlayTrigger
                                    placement='right'
                                    delay={{ show: 250, hide: 250 }}
                                    overlay={this.renderTooltip(item)}
                                >
                                    <Dropdown.Toggle variant='light' className='text-start px-3 w-100' style={{fontSize: 18}}>
                                        <i className={`me-2 bi ${item.icon}`} />
                                    </Dropdown.Toggle>
                                </OverlayTrigger>

                                <Dropdown.Menu style={{width: '240px'}}>
                                    {subItem}
                                </Dropdown.Menu>
                            </Dropdown>

                        newMenu.push(menuItem)
                    }

                } else {
                    links.map(perm => {
                        if (item.link === perm.link) {
                            menuItem =
                                <OverlayTrigger
                                    placement='right'
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={this.renderTooltip(item)}
                                    key={i}
                                >
                                    <li className="nav-item">
                                        <Link href={item.link}>
                                            <a
                                                className={`nav-link m-1 py-2 px-3 ${link === item.link ? 'active bg-dark link-light' : 'link-dark'}`}
                                                style={{fontSize: 18}}
                                            >
                                                <i className={`bi ${item.icon}`} />
                                            </a>
                                        </Link>
                                    </li>
                                </OverlayTrigger>

                            newMenu.push(menuItem)
                        }
                    })
                }
            })
        }

        return newMenu
    }

    render() {

        return (
            <div className={`d-flex flex-column flex-shrink-0 bg-light position-fixed border-end`} style={this.props.fullscreen ? {height: '100vh', zIndex: 15} : {height: '95vh', zIndex: 15}}>
                <Nav className="flex-column">
                    {this.createMenu()}
                </Nav>

                <Version />
            </div>
        )
    }
}

const mapSTP = state => ({
    user: state.app.user,
    fullscreen: state.app.fullscreen
})

export default connect(mapSTP)(NavbarMini)