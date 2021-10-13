import {Component} from "react";
import Link from "next/link";
import {Dropdown, Nav, OverlayTrigger, Tooltip} from "react-bootstrap";

export default class NavbarMini extends Component {

    async componentDidMount() {
    }

    renderTooltip = (item, props) => (
        <Tooltip id="button-tooltip" {...props}>
            {item.label}
        </Tooltip>
    );


    createMenu = () => {
        let newMenu = []
        const {link, menu} = this.props

        if (menu) {
            menu.map((item, i) => {
                newMenu.push(
                    <>
                        {item.submenu ? (

                                <Dropdown drop='end' key={i}>
                                    <OverlayTrigger
                                        placement='right'
                                        delay={{ show: 250, hide: 250 }}
                                        overlay={this.renderTooltip(item)}
                                    >
                                        <Dropdown.Toggle variant='light' className='text-start px-3 w-100' style={{fontSize: 18}}>
                                            <i className={`me-2 bi ${item.icon}`} />
                                        </Dropdown.Toggle>
                                    </OverlayTrigger>

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
                        )}
                    </>
                )
            })
        }

        return newMenu
    }

    render() {

        return (
            <div className={`d-flex flex-column flex-shrink-0 bg-light position-fixed border-end`} style={{height: '95vh', zIndex: 10}}>
                <Nav className="flex-column">
                    {this.createMenu()}
                </Nav>
            </div>
        )
    }
}

