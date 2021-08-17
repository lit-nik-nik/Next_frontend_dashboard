import { Component } from "react";
import {Row, Col, Table, Button} from "react-bootstrap";
import PaginationTable from "../../modules/pagination";
import Thead from "../../modules/tables/thead";
import Tbody from "../../modules/tables/tbody";
import { MainLyout } from "../../components/layout/main";
import {getPageOrder} from "../../services/packages/get-services";
import ModalWindow from "../../components/modal";

export default class PageOrder extends Component {

    state = {
        orders: this.props.data.orders,
        titleTable: [
            'Дата упаковки', 
            'Заказ', 
            'Упакован',
            'Кол-во упаковок',
            'План',
            'Опоздание',
            'Стоимость',
            'Долг',
            'Примечание',
            'Город',
            'Статус',
            'TS',
            ''
          ],
        lastPage: '',
        pagesCount: [],
        modalView: false
    }

    async componentDidMount() {
        this.changeStatePage()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            await this.setState({orders: this.props.data.orders})
        }

    }

    changeStatePage() {
        let pages = []
        let lastPage = Math.round(this.props.data.totalCount / 100)

        for (let i = 1; i <= lastPage; i++) {
            pages.push(i)
        }

        this.setState({lastPage, pagesCount: pages})

    }

    render() {
        const {totalCount, acitvePage} = this.props.data

        const {orders, pagesCount, lastPage} = this.state

        return (
            <MainLyout title='Журнал упаковки'>
                <Row className='mb-3'>
                    <Col>
                        <p className='text-muted m-0'><small>Всего заказов - {totalCount}</small></p>
                    </Col>
                    <Col sm={1}>
                        <Button
                            variant='dark'
                            onClick={() => this.setState({modalView: true})}>
                            Добавить
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <PaginationTable pagesCount={pagesCount} acitvePage={+acitvePage} lastPage={lastPage}/>
                    </Col>
                    <Col sm={1}>
                        <p className='text-muted text-center m-0'><small>страница № {acitvePage}</small></p>
                    </Col>
                </Row>

                <Table responsive hover size='sm' className='small' style={{fontSize: 14}}>
                    <Thead title={this.state.titleTable} />
                    <Tbody orders={orders}/>
                </Table>

                <Row>
                    <Col>
                        <PaginationTable pagesCount={pagesCount} acitvePage={+acitvePage} lastPage={lastPage}/>
                    </Col>
                    <Col sm={1}>
                        <p className='text-muted text-center m-0'><small>страница № {acitvePage}</small></p>
                    </Col>
                </Row>

                <ModalWindow
                    show={this.state.modalView}
                    onHide={()=> this.setState({modalView: false})}
                />

            </MainLyout>
        )
    }
}

export async function getServerSideProps({query}) {

    const data = getPageOrder(query.page, 100);

    return data

}