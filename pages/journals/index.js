import { Component } from "react";
import {Row, Col, Table, Button} from "react-bootstrap";
import PaginationTable from "../../modules/pagination";
import Thead from "../../modules/tables/thead";
import Tbody from "../../modules/tables/tbody";
import { MainLyout } from "../../components/layout/main";
import Router, {withRouter} from "next/router";
import ModalError from "../../modules/modals/modal-error";
import {getJournals, getOrderJournal} from "../../services/journals/get";

class PageJournals extends Component {

    state = {
        listJournals: [],
        activeJournal: null,
        orderList: [],
        token: null,
        link: this.props.router.asPath,
        error: {
            view: false,
            message: ''
        }
    }

    async componentDidMount() {
        if (localStorage.getItem('token')) await this.setState({token: localStorage.getItem('token')})
        else this.routeAuth()

        this.getListJournals()
    }

    routeAuth = () => Router.push('/auth')

    getListJournals = async () => {
        const {token} = this.state

        await getJournals(token)
            .then(res => this.setState({listJournals: res.data.journals}))
            .catch(err => {
                this.setState(({error}) => {
                    return (
                        error.view = true,
                        error.message = err.response.data.message
                    )
                })

                localStorage.removeItem('token')
                localStorage.removeItem('userId')

                setTimeout(this.routeAuth, 2000)
            })
    }

    getOrderJournal = async (id) => {
        const {token} = this.state

        await getOrderJournal(id, token)
            .then(res => this.setState({orderList: res.data.journal}))
            .catch(err => {
                this.setState(({error}) => {
                    return (
                        error.view = true,
                        error.message = err.response.data.message
                    )
                })
            })
    }

    render() {
        const {link, listJournals, error, orderList} = this.state

        const list = listJournals.map(item => {
            return (
                <Button
                    variant='outline-dark'
                    type='button'
                    className='me-3'
                    key={item.id}
                    onClick={() => {
                        this.setState({activeJournal: item.id})
                        this.getOrderJournal(item.id)
                    }}
                >
                    {item.name}
                </Button>)
        })

        return (
            <MainLyout title={'Журналы'} link={link}>
                <Row>
                    <Col className='text-center mb-3'>
                        {list}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {JSON.stringify(orderList)}
                    </Col>
                </Row>

                <ModalError
                    show={error.view}
                    onHide={()=> this.setState(({error}) => error.view = false)}
                    error={error.message}
                />
            </MainLyout>
        );
    }
}

export default withRouter(PageJournals)