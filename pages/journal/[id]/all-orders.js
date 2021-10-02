import React, {Component} from "react";
import {getAdoptedOrderJournal} from "../../../services/journals/get";
import {globalState} from "../../../data/globalState";
import Thead from "../../../modules/tables/thead";
import Tbody from "../../../modules/tables/tbody";
import {Table, Row, Col, Alert, InputGroup, FormControl} from "react-bootstrap";
import PaginationTable from "../../../modules/pagination";
import Loading from "../../../modules/loading";
import CustomError from "../../../modules/error";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../../modules/cookie";
import {MainLayout} from "../../../components/layout/main";
import JournalLayout from "../../../components/layout/journals";

class AllOrdersJournal extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        title: 'Выполненные заказы',
        filters: [],
        allOrders: [],
        counts: null,
        pages: null,
        activePage: 1,
        limit: 100,
        headerTable: [],
        paramsTable: [],
        error: null,
        link: null,
        journalID: null
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        this.setState({journalID: this.props.router.query.id})
        await this.addData()
        this.renderHeader()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.state.activePage !== prevState.activePage
        ) {
            await this.changeData()
        }
    }

    addData = () => {
        const {data} = this.props

        if (data) {
            this.setState({allOrders: data.orders})
            this.setState({counts: data.count})
            this.setState({pages: data.pages})
        }
    }

    changeData = async () => {
        const {token, id} = this.props
        const {activePage, limit} = this.state

        let data, error

        await getAdoptedOrderJournal(id, token, activePage, limit)
            .then(res => data = res.data)
            .catch(err => error = err.response?.data)

        if (data) {
            this.setState({allOrders: data.orders})
            this.setState({counts: data.count})
            this.setState({pages: data.pages})
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
        const {headerTable, paramsTable, allOrders, activePage, pages, error, journalID, link, limit, title} = this.state

        return (
            <MainLayout title={title} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={journalID}
                    activePage={'all-orders'}
                >
                    <Row>
                        <Col className='mb-3 text-center text-uppercase fw-bold'>
                            <h3>{title}</h3>
                        </Col>
                    </Row>

                    <hr/>

                    <Row className='mb-3'>
                        <Col lg={12} className='text-center fw-bold h4 text-uppercase'>Фильтры</Col>

                        <Col lg={4}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Кол-во заказов на странице</InputGroup.Text>
                                <FormControl
                                    placeholder="Заказы"
                                    value={limit}
                                    onChange={(e) => this.setState({limit: e.target.value})}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') this.changeData()
                                    }}
                                />
                            </InputGroup>
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

                    <Table hover bordered variant={'dark'}>
                        <Thead title={headerTable}/>
                        <Tbody orders={allOrders} params={paramsTable} color={'table-light'}/>
                    </Table>

                    <CustomError error={error} />
                </JournalLayout>
            </MainLayout>
        )
    }

}

export default withRouter(AllOrdersJournal)

export async function getServerSideProps({req,query}) {

    const token = getTokenCookies(req.headers.cookie)
    const id = query.id

    let data, error

    await getAdoptedOrderJournal(id, token, 1, 100)
        .then(res  => data = res.data)
        .catch(err => error = err.response?.data)


    if (data) {
        return {
            props: {
                data
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