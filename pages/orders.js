import React, {Component} from "react";
import {getAdoptedOrderJournal} from "../services/journals/get";
import {globalState} from "../data/globalState";
import Thead from "../modules/tables/thead";
import Tbody from "../modules/tables/tbody";
import {Table, Row, Col, Alert, InputGroup, FormControl, Button} from "react-bootstrap";
import PaginationTable from "../modules/pagination";
import Loading from "../modules/loading";
import CustomError from "../modules/error";
import Router, {withRouter} from "next/router";
import {MainLayout} from "../components/layout/main";
import {getOrders} from "../services/orders/get";

class AllOrders extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        title: 'Все заказы',
        allOrders: [],
        counts: null,
        pages: null,
        activePage: 1,
        limit: 100,
        headerTable: [],
        paramsTable: [],
        loading: true,
        noSearch: '',
        error: null,
        link: null
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        await this.getData()
        this.renderHeader()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({ allOrders: []})
            this.setState({ headerTable: []})
            this.setState({ paramsTable: []})
            this.setState({ counts: null})
            this.setState({ pages: null})
        }

        if (this.props.data !== prevProps.data) {
            await this.addData(this.props.data)
            this.renderHeader()
        }

        if (this.state.activePage !== prevState.activePage || this.props.filter !== prevProps.filter) {
            this.setState({loading: true})
            this.setState({noSearch: ''})
            await this.getData()
            this.renderHeader()
        }
    }

    addData = (data) => {
        if (data) {
            this.setState({allOrders: data.orders})
            this.setState({counts: data.count})
            this.setState({pages: data.pages})
            this.setState({loading: false})
            this.setState({noSearch: ''})
        }
    }

    getData = async () => {
        const {token, filter} = this.props
        const {activePage} = this.state

        let error, data

        await getOrders(token, activePage, filter)
            .then(res => {
                if (res.data.count === 0) {
                    this.setState({noSearch: 'Данные находятся за гранью доступного'})
                    this.setState({loading: false})
                } else if (res.data.count === 1) {
                    let id

                    res.data.orders.map(order => {
                        id = order.id
                    })

                    Router.push(`/order/${id}`)
                } else {
                    data = res.data
                }
            })
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
        const {headerTable, paramsTable, allOrders, activePage, pages, error, link, title, loading, noSearch} = this.state

        return (
            <MainLayout title={title} link={link} token={this.props.token} error={this.props.error} search={this.props.filter}>
                <Row>
                    <Col className='my-3 text-center text-uppercase fw-bold'>
                        <h3>{title}</h3>
                    </Col>
                </Row>

                <hr/>

                {loading ? (
                    <>
                        <Row>
                            <Col>
                                <PaginationTable activePage={+activePage} lastPage={pages} onClick={this.changeActivePage}/>
                            </Col>
                            <Col className='text-end'>
                                <Alert variant='light p-2'>
                                    Всего заказов - {this.state.counts} на {this.state.pages} страниц
                                </Alert>
                            </Col>
                        </Row>

                        <Loading/>
                    </>
                    ) :
                    noSearch ? (
                        <Col className='text-center text-muted'>{noSearch}</Col>
                    ) : (
                        <>
                            <Row>
                                <Col>
                                    <PaginationTable activePage={+activePage} lastPage={pages} onClick={this.changeActivePage}/>
                                </Col>
                                <Col className='text-end'>
                                    <Alert variant='light p-2'>
                                        Всего заказов - {this.state.counts} на {this.state.pages} страниц
                                    </Alert>
                                </Col>
                            </Row>

                            <Row>
                                <Col className='me-3' style={{height: '75vh', overflow: "scroll"}}>
                                    <Table hover bordered variant={'dark'} size='sm'>
                                        <Thead title={headerTable}/>
                                        <Tbody orders={allOrders} params={paramsTable} color={'table-light'}/>
                                    </Table>
                                </Col>
                            </Row>
                        </>
                )}

                <CustomError error={error} />
            </MainLayout>
        )
    }

}

export default withRouter(AllOrders)

export async function getServerSideProps({query}) {

    let filter

    if (query.filter) filter = query.filter

    if (filter) {
        return {
            props: {
                filter
            }
        }
    } else {
        return {
            props: {}
        }
    }
}