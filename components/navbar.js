import React, {Component} from "react";
import {connect} from "react-redux";
import Link from "next/link";
import {Nav, Dropdown} from 'react-bootstrap'
import Version from "../modules/version";

class Navbar extends Component {

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
                                    <a className={`nav-link py-1 ${link === sub.link ? 'active bg-dark link-light' : 'link-dark'}`} style={{fontSize: 18}}>
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
                                            <a className={`nav-link py-1 ${link === sub.link ? 'active bg-dark link-light' : 'link-dark'}`} style={{fontSize: 18}}>
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
                                <Dropdown.Toggle variant='light' className='text-start px-3 w-100' style={{fontSize: 18}}>
                                    <i className={`me-2 bi ${item.icon}`} />
                                    {item.label}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {subItem}
                                </Dropdown.Menu>
                            </Dropdown>

                        newMenu.push(menuItem)
                    }

                } else {
                    links.map(perm => {
                        if (item.link === perm.link) {
                            menuItem =
                                <Link href={`${item.link}`} key={i}>
                                    <a className={`nav-link my-1 ${link === item.link ? 'active bg-dark link-light' : 'link-dark'}`} style={{fontSize: 18}}>
                                        {item.submenu ? <i className="bi bi-chevron-right me-3" /> : null}
                                        <i className={`me-2 bi ${item.icon}`} />
                                        {item.label}
                                    </a>
                                </Link>

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
            <div className={`d-flex flex-column flex-shrink-0 p-3 bg-light position-fixed col-lg-2 border-end`} style={{height: '95vh', zIndex: 15}}>
                <Nav className="flex-column">
                    {this.createMenu()}
                </Nav>

                <Version />
            </div>
        )
    }
}

const mapSTP = state => ({
    user: state.app.user
})

export default connect(mapSTP)(Navbar)
