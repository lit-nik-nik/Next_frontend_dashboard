import {Button, Col, Form, Modal, Row} from "react-bootstrap"
import style from '../styles/modal.module.css'
import {Component} from "react";
import {getOrder} from "../api/packages/get";
import {changeDate} from "./change-data";
import {patchOrder} from "../api/packages/patch";

export default class ModalForm extends Component {

    state = {
        order: {
            id: '',
            date: '',
            time: '',
            name: '',
            packed: '',
            box: '',
            comment: ''
        }
    }

    searchOrder = async (id) => {
        await getOrder(id)
            .then(newOrder => {
                const date = changeDate(newOrder.props.order.DATE_PACK, 'YYYY-MM-DD')

                const packed = newOrder.props.order.PACK_TYPE

                this.setState(({order}) => {
                    return (
                        order.name = newOrder.props.order.ITM_ORDERNUM,
                        order.box = newOrder.props.order.BOX_COUNT,
                        order.packed = packed,
                        order.comment = newOrder.props.order.COMMENT ? newOrder.props.order.COMMENT : '',
                        order.date = date,
                        order.time = '00:00'
                    )
                })
            })
    }

    changeOrderID = async (e) => {
        await this.setState(({order}) => {
            return order.id = e.target.value
        })
    }

    changeOrder = async (name, value) => {
        await this.setState(({order}) => {
            return order[name] = value
        })
    }

    addDate = (attr = 0) => {
        let date

        if (attr === 0) date = new Date(Date.now())
        else date = new Date(Date.now() - 864e5)

        this.setState(({order}) => {
            return order.date = changeDate(date, 'YYYY-MM-DD')
        })
    }

    addTime = () => {
        let time = new Date().toLocaleTimeString().slice(0, -3)

        this.setState(({order}) => {
            return order.time = time
        })
    }

    saveOrder = async () => {
        const {box, comment, date, time, id, packed} = this.state.order

        const data = {
            BOX_COUNT: box,
            DATE_PACK: date + 'T' + time + ':00.000Z',
            COMMENT: comment,
            PACK_TYPE: packed
        }

        await patchOrder(id, data)

        this.props.onHide();
    }

    newForm = async () => {
        await this.setState(({order}) => {
            return (
                order.id = '',
                order.name = '',
                order.box = '',
                order.packed = '',
                order.comment = '',
                order.date = '',
                order.time = ''
            )
        })
    }

    render() {
        const {name, box, comment, date, time, id, packed} = this.state.order

        return (
            <>
                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    dialogClassName={style.modal50w}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            ???????????????????? ???????????? ?? ???????????? ????????????????
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className={'mb-3'}>
                            <Col sm={2}>
                                <p className={'text-center'}>??????????</p>
                            </Col>
                            <Col sm={2}>
                                <Form.Control size='sm' type='text' placeholder='ID' className={`text-center`} value={id} onChange={this.changeOrderID}/>
                            </Col>
                            <Col>
                                <Form.Control size='sm' type='text' placeholder='????????????????????????' className={`text-center`} value={name} readOnly/>
                            </Col>
                        </Row>
                        <Row className={'mb-3'}>
                            <Col sm={3} className={'text-center'}>
                                <Form.Label className='text-secondary'>??????-???? ??????????????</Form.Label>
                                <Form.Control
                                    size='sm'
                                    type='number'
                                    placeholder='??????-????'
                                    className={`text-center`}
                                    value={box}
                                    onChange={e => this.changeOrder('box', e.target.value)}/>
                            </Col>
                            <Col className={'text-center'}>
                                <Form.Label className='text-secondary w-100'>????????????????</Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={packed}
                                    onChange={e => this.changeOrder('packed', e.target.value)}>
                                        <option value='-'>-</option>
                                        <option value='??????????????????'>??????????????????</option>
                                        <option value='????????????????'>????????????????</option>
                                </Form.Select>
                            </Col>
                            <Col sm={3} className={'text-center'}>
                                <Form.Label className='text-secondary'>????????</Form.Label>
                                <Form.Control
                                    size='sm'
                                    type='date'
                                    placeholder='????????'
                                    className={`text-center mb-1`}
                                    value={date}
                                    onChange={e => this.changeOrder('date', e.target.value)}/>
                                <Button  size="sm" variant="outline-warning" className={'mx-1'} onClick={() => this.addDate(-1)}>??????????</Button>
                                <Button  size="sm" variant="outline-success" className={'mx-1'} onClick={() => this.addDate()}>??????????????</Button>
                            </Col>
                            <Col sm={2} className={'text-center'}>
                                <Form.Label className='text-secondary'>??????????</Form.Label>
                                <Form.Control
                                    size='sm'
                                    type='time'
                                    placeholder='??????????'
                                    className={`text-center mb-1`}
                                    value={time}
                                    onChange={e => this.changeOrder('time', e.target.value)}/>
                                <Button  size="sm" variant="outline-success" className={'mx-1'} onClick={() => this.addTime()}>????????????</Button>
                            </Col>
                        </Row>
                        <Row className={'mb-3'}>
                            <Col sm={2}>
                                <p className={'text-center'}>????????????????????</p>
                            </Col>
                            <Col>
                                <Form.Control
                                    size='sm'
                                    type='text'
                                    placeholder='????????????????????'
                                    className={`text-center`}
                                    value={comment}
                                    onChange={e => this.changeOrder('comment', e.target.value)}/>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row style={{width: '100%'}}>
                            <Col>
                                <Button variant={"info"} onClick={() => this.searchOrder(id)}>??????????</Button>
                            </Col>
                            <Col style={{textAlign: "right"}}>
                                <Button onClick={() => this.newForm()} className={'mx-3'}>????????????????</Button>
                                <Button variant={"success"} onClick={() => this.saveOrder()}>??????????????????</Button>
                            </Col>
                        </Row>

                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}