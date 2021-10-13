import {Component} from "react";
import Link from "next/link";
import {Nav, Dropdown} from 'react-bootstrap'

export default class Navbar extends Component {


    createMenu = () => {
        const {link, menu} = this.props
        let newMenu = []

        if (menu) {
            menu.map((item, i) => {
                newMenu.push(
                    <>
                        {item.submenu ? (
                            <Dropdown drop='end' key={i}>
                                <Dropdown.Toggle variant='light' className='text-start px-3 w-100' style={{fontSize: 18}}>
                                    <i className={`me-2 bi ${item.icon}`} />
                                    {item.label}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {item.submenu.map((sub, iS) => {
                                        return (
                                            <Link href={`${sub.link}`} key={iS}>
                                                <a className={`nav-link ${link === sub.link ? 'active bg-dark link-light' : 'link-dark'}`} style={{fontSize: 18}}>
                                                    <i className={`me-2 bi ${sub.icon}`} />
                                                    {sub.label}
                                                </a>
                                            </Link>
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                                <Link href={`${item.link}`} key={i}>
                                    <a className={`nav-link my-1 ${link === item.link ? 'active bg-dark link-light' : 'link-dark'}`} style={{fontSize: 18}}>
                                        {item.submenu ? <i className="bi bi-chevron-right me-3" /> : null}
                                        <i className={`me-2 bi ${item.icon}`} />
                                        {item.label}
                                    </a>
                                </Link>
                            )}
                    </>
                )
            })
        }

        return newMenu
    }

    render() {

        return (
            <div className={`d-flex flex-column flex-shrink-0 p-3 bg-light position-fixed col-lg-2 border-end`} style={{height: '95vh', zIndex: 10}}>
                <Nav className="flex-column">
                    {this.createMenu()}
                </Nav>
            </div>
        )
    }
}

