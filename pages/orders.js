import React, {Component} from "react";
import {getAdoptedOrderJournal} from "../services/journals/get";
import {globalState} from "../data/globalState";
import Thead from "../modules/tables/thead";
import Tbody from "../modules/tables/tbody";
import {Table, Row, Col, Alert, InputGroup, FormControl, Button} from "react-bootstrap";
import PaginationTable from "../modules/pagination";
import Loading from "../modules/loading";
import CustomError from "../modules/error";
import {withRouter} from "next/router";
import {getTokenCookies} from "../modules/cookie";
import {MainLayout} from "../components/layout/main";
import JournalLayout from "../components/layout/journals";
import {getOrders} from "../services/orders/get";

class AllOrders extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        title: 'Все заказы',
        filters: [],
        allOrders: [],
        counts: null,
        pages: null,
        activePage: 1,
        limit: 100,
        headerTable: [],
        paramsTable: [],
        error: null,
        link: null
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        await this.addData(this.props.data)
        this.renderHeader()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data !== prevProps.data) {
            await this.addData(this.props.data)
            this.renderHeader()
        }

        if (this.state.activePage !== prevState.activePage) {
            await this.changeData()
        }
    }

    addData = (data) => {
        if (data) {
            this.setState({allOrders: data.orders})
            this.setState({counts: data.count})
            this.setState({pages: data.pages})
        }
    }

    changeData = async () => {
        const {token} = this.props
        const {activePage} = this.state

        let error, data

        await getOrders(token, activePage)
            .then(res => data = res.data)
            .catch(err => error = err.response?.data)

        if (data) {
            await this.addData(data)
        }
        else if (error) {
            this.setState({error})
        }
    }

    renderHeader = () => {
        const {allOrders} = this.state,
            {headersTables} = globalState
        let header = [],
            params = []

        if (allOrders) {
            for (let key in allOrders[0]) {
                headersTables.map(item => {
                    item.label.map(label => {
                        if(label === key) {
                            params.push(key)
                            header.push(item.name)
                        }
                    })
                })
            }
        }

        this.setState({headerTable: header})
        this.setState({paramsTable: params})
    }

    changeActivePage = (page) => {
        this.setState({activePage: page})
        this.setState({allOrders: []})
    }

    render() {
        const {headerTable, paramsTable, allOrders, activePage, pages, error, link, title} = this.state

        return (
            <MainLayout title={title} link={link} token={this.props.token} error={this.props.error}>
                    <Row>
                        <Col className='my-3 text-center text-uppercase fw-bold'>
                            <h3>{title}</h3>
                        </Col>
                    </Row>

                    <hr/>

                    <Row>
                        <Col>
                            <PaginationTable activePage={+activePage} lastPage={pages} onClick={this.changeActivePage}/>
                        </Col>
                        <Col>
                            {allOrders[0] ? null : <Loading/>}
                        </Col>
                        <Col className='text-end'>
                            <Alert variant='light p-2'>
                                Всего заказов - {this.state.counts} на {this.state.pages} страниц
                            </Alert>
                        </Col>
                    </Row>

                    <Table hover bordered variant={'dark'} size='sm'>
                        <Thead title={headerTable}/>
                        <Tbody orders={allOrders} params={paramsTable} color={'table-light'}/>
                    </Table>

                    <CustomError error={error} />
            </MainLayout>
        )
    }

}

export default withRouter(AllOrders)

export async function getServerSideProps({req, query}) {

    const token = getTokenCookies(req.headers.cookie)
    const page = 1
    let filter = query.filter

    let data, error

    await getOrders(token, page, filter)
        .then(res  => data = res.data)
        .catch(err => error = err.response?.data)


    if (data) {
        return {
            props: {
                data,
                query
            }
        }
    } else if (error) {
        return {
            props: {
                error
            }
        }
    } else {
        return {
            props: {}
        }
    }
}