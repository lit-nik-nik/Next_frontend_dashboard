import React, {Component} from "react";
import {globalState} from "../data/globalState";
import Thead from "../modules/tables/thead";
import Tbody from "../modules/tables/tbody";
import {Table, Row, Col, Alert, InputGroup, FormControl, Button} from "react-bootstrap";
import PaginationTable from "../modules/pagination";
import CustomError from "../modules/error";
import Router, {withRouter} from "next/router";
import MainLayout from "../components/layout/main";
import {getOrders} from "../services/orders/get";
import {connect} from "react-redux";
import {setLoading, removeLoading} from "../redux/actions/actionsApp";
import {IconPrint, printPage} from "../modules/print";

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
        const {token, filter, loading, unLoading} = this.props
        const {activePage} = this.state

        let error, data

        loading()

        await getOrders(token, activePage, filter)
            .then(res => {
                if (res.data.count === 0) {
                    this.setState({noSearch: 'Данные находятся за гранью доступного'})
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

        unLoading()

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
        const {headerTable, paramsTable, allOrders, activePage, pages, link, title, noSearch} = this.state

        return (
            <MainLayout title={title} link={link} token={this.props.token} error={this.props.error} search={this.props.filter}>
                <Row className='align-items-center me-2'>
                    <Col lg={1} />
                    <Col lg={10} className='mt-3 text-center text-uppercase fw-bold'>
                        <h3>{title}</h3>
                    </Col>
                    <Col lg={1}>
                        <IconPrint onClickPrint={() => printPage('doc-print')} />
                    </Col>

                    <hr/>

                    <Col lg={6}>
                        <PaginationTable activePage={+activePage} lastPage={pages} onClick={this.changeActivePage}/>
                    </Col>
                    <Col lg={6} className='text-end'>
                        <Alert variant='light p-2'>
                            Всего заказов - {this.state.counts} на {this.state.pages} страниц
                        </Alert>
                    </Col>

                    {noSearch ? (
                        <Col lg={12} className='text-center text-muted'>{noSearch}</Col>
                    ) : (
                        <Col id='doc-print' lg={12} className='me-3' style={{height: '75vh', overflow: "scroll"}}>
                            <Table hover bordered variant={'dark'} size='sm'>
                                <Thead title={headerTable}/>
                                <Tbody orders={allOrders} params={paramsTable} color={'table-light'}/>
                            </Table>
                        </Col>
                    )}
                </Row>
            </MainLayout>
        )
    }

}

export default connect(null, {loading: setLoading, unLoading: removeLoading})(withRouter(AllOrders))

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