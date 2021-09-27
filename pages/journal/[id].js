import React, { Component } from "react";
import {Row, Col, Button} from "react-bootstrap";
import { MainLayout } from "../../components/layout/main";
import {withRouter} from "next/router";
import {getOrderJournal, getAdoptedOrderJournal} from "../../services/journals/get";
import {getTokenCookies} from "../../modules/cookie";
import AllOrdersJournal from "../../components/journals/all-orders";
import PlansJournal from "../../components/journals/plans";


class PageJournals extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        disabledButton: false,
        page: [
            {
                type: 'plans',
                name: 'Планы',
                button: 'dark'
            },
            {
                type: 'all-orders',
                name: 'Выполненные заказы',
                button: 'dark'
            }
        ],
        activePage: 'plans',
        filter: [
            {
                type: 'all',
                name: 'Все',
                button: 'info'
            },
            {
                type: 'overdue',
                name: 'Просроченные',
                button: 'danger'
            },
            {
                type: 'forToday',
                name: 'Текущие заказы',
                button: 'primary'
            },
            {
                type: 'forFuture',
                name: 'Будущие заказы',
                button: 'success'
            }
        ],
        activeFilter: 'all',
        link: null,
        pageID: this.props.id
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({link: this.props.router.asPath})
        }
    }
    
    renderPage = () => {
    }

    changeActive  = (value, type) => {
        if (value === 'filter') this.setState({activeFilter: type})
        if (value === 'page') this.setState({activePage: type})
    }

    renderButton = (arr, active, value) => {
        const {disabledButton} = this.state

        return arr.map((item, i) => {
            return (
                <Button
                    type='button'
                    variant={`outline-${item.button}`}
                    className='me-3'
                    active={active === item.type}
                    key={i}
                    disabled={disabledButton}
                    onClick={async () => await this.changeActive(value, item.type)}
                >
                    {item.name}
                </Button>
            )
        })
    }

    render() {
        const {link, pageID, page, activePage, filter, activeFilter} = this.state

        return (
            <MainLayout title={'Журналы'} link={link} token={this.props.token} error={this.props.error}>
                <Row>
                    <Col className='text-start mb-3'>
                        {this.renderButton(page, activePage, 'page')}
                    </Col>
                    <Col className='text-end mb-3'>
                        {activePage === 'plans'
                            ? this.renderButton(filter, activeFilter, 'filter')
                            : null
                        }
                    </Col>
                </Row>

                {activePage === 'plans'
                    ? <PlansJournal token={this.props.token} id={pageID} activeFilter={activeFilter} />
                    : <AllOrdersJournal token={this.props.token} id={pageID} />
                }

            </MainLayout>
        )
    }
}

export default withRouter(PageJournals)

export async function getServerSideProps({req,query}) {

    // const token = getTokenCookies(req.headers.cookie)
    const id = query.id

    let plan, allOrders, error

    // await getOrderJournal(id, token)
    //     .then(res  => plan = res.data.journal)
    //     .catch(err => error = err.response?.data)
    //
    // await getAdoptedOrderJournal(id, token)
    //     .then(res  => allOrders = res.data)
    //     .catch(err => error = err.response?.data)


        return {
            props: {
                id
            }
        }


}
