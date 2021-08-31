import { Component } from "react";
import {Row, Col, Table, Button} from "react-bootstrap";
import PaginationTable from "../../modules/pagination";
import Thead from "../../modules/tables/thead";
import Tbody from "../../modules/tables/tbody";
import { MainLyout } from "../../components/layout/main";
import {getOrders} from "../../services/orders/get";

export default class PageOrder extends Component {

    state = {
        orders: this.props.data.orders,
        table: [
            {
                title: 'Дата упаковки',
                params: 'FACT_DATE_FIRSTSAVE'
            },
            {
                title: 'Заказ',
                params: 'ITM_ORDERNUM'
            },
            {
                title: 'Стоимость',
                params: 'ORDER_COST'
            },
            {
                title: 'Долг',
                params: 'ORDER_DEBT'
            },
            {
                title: 'Примечание',
                params: 'PRIMECH'
            },
            {
                title: 'Город',
                params: 'CITY'
            },
            {
                title: 'Статус',
                params: 'STATUS_DESCRIPTION'
            },
            {
                title: '',
                params: ''
            },
        ],
        tableHeader: [],
        tableParams: [],
        activePage: this.props.data.acitvePage,
        countOrders: this.props.data.count,
        lastPage: this.props.data.pages,
        pagesCount: [],
        modalView: false
    }

    async componentDidMount() {
        this.changeStatePage()
        this.filterTableHeader()
    }

    async componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            await this.setState({
                orders: this.props.data.orders,
                activePage: this.props.data.acitvePage
            })
        }

    }

    filterTableHeader = () => {
        let tableHeader = [],
            tableParams = []

        this.state.table.map((item, i) => {
            tableHeader.push(item.title)
            tableParams.push(item.params)
        })

        this.setState({tableHeader, tableParams})
    }

    changeStatePage() {
        let pages = []

        for (let i = 1; i <= this.state.lastPage; i++) pages.push(i)

        this.setState({pagesCount: pages})
    }

    render() {
        const {countOrders, orders, pagesCount, lastPage, activePage, tableHeader, tableParams} = this.state

        return (
            <MainLyout title={`Журнал упаковки - страница ${activePage}`}>
                <Row className=''>
                    <Col>
                        <p className='text-muted m-0'><small>Всего заказов - {countOrders}</small></p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <PaginationTable pagesCount={pagesCount} activePage={+activePage} lastPage={lastPage}/>
                    </Col>
                    <Col sm={1}>
                        <p className='text-muted text-center m-0'><small>страница № {activePage}</small></p>
                    </Col>
                </Row>

                <Table responsive hover size='sm' className='small' style={{fontSize: 14}}>
                    <Thead title={tableHeader} />
                    <Tbody orders={orders} params={tableParams}/>
                </Table>

                <Row>
                    <Col>
                        <PaginationTable pagesCount={pagesCount} activePage={+activePage} lastPage={lastPage}/>
                    </Col>
                    <Col sm={1}>
                        <p className='text-muted text-center m-0'><small>страница № {activePage}</small></p>
                    </Col>
                </Row>
            </MainLyout>
        )
    }
}

export async function getServerSideProps({query}) {

    return {
        props: {
            data: await getOrders(query.page)
        }
    }

}