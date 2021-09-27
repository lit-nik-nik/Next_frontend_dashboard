import React, {Component} from "react";
import {getAdoptedOrderJournal} from "../../services/journals/get";
import {globalState} from "../../data/globalState";
import Thead from "../../modules/tables/thead";
import Tbody from "../../modules/tables/tbody";
import {Table, Row, Col} from "react-bootstrap";
import PaginationTable from "../../modules/pagination";
import Loading from "../../modules/loading";
import CustomError from "../../modules/error";


export default class AllOrdersJournal extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        allOrders: [],
        counts: null,
        pages: null,
        activePage: 1,
        limit: 100,
        headerTable: [],
        paramsTable: [],
        error: null
    }

    async componentDidMount() {
        await this.addData()
        this.renderHeader()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.activePage !== prevState.activePage) {
            await this.addData()
        }
    }

    addData = async () => {
        const {token, id} = this.props
        const {activePage, limit} = this.state

        let data, error

        await getAdoptedOrderJournal(id, token, activePage, limit)
            .then(res => data = res.data)
            .catch(err => error = err.response?.data)

        console.log(error)
        console.log(data)

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
        const {headerTable, paramsTable, allOrders, activePage, pages, error} = this.state

        return (
            <>
                <Row>
                    <Col>
                        <PaginationTable activePage={+activePage} lastPage={pages} onClick={this.changeActivePage}/>
                    </Col>
                    <Col>
                        {allOrders[0] ? null : <Loading/>}
                    </Col>
                    <Col className='text-end'>
                        <p className='text-muted'>Всего заказов - {this.state.counts} на {this.state.pages} страниц</p>
                    </Col>
                </Row>

                <Table hover bordered variant={'dark'}>
                    <Thead title={headerTable}/>
                    <Tbody orders={allOrders} params={paramsTable} color={'table-light'}/>
                </Table>

                <CustomError error={error} />
            </>
        )
    }

}

