import Link from "next/link"
import {Button, Col, Row} from "react-bootstrap";
import { format } from 'date-fns'
import React, {useState} from "react";

function Tbody (props) {
    const [hideComment, setHideComment] = useState(true)

    let orders = props.orders ? props.orders : []

    const renderToTime = (time) => {
        const year = (365 * 24 * 60 * 60 * 1000);
        const month = (30 * 24 * 60 * 60 * 1000);
        const week = (7 * 24 * 60 * 60 * 1000);
        const day = (24 * 60 * 60 * 1000);
        const hour = (60 * 60 * 1000);
        const minute = (60 * 1000);
        const years = Math.floor(time / year);
        const months = Math.floor(time % year / month);
        const weeks = Math.floor(time % month / week);
        const days = Math.floor(time % week / day);
        const hours = Math.floor(time % day / hour);
        const minutes = Math.floor(time % hour / minute);
        let str;

        str = `${years ? years + 'г.' : ''} ${months ? months + 'м.' : ''} ${weeks ? weeks + 'н.' : ''} ` +
            `${days ? days + 'д.' : ''} ${hours ? (String(hours).length === 1 ? '0' + String(hours) : hours) : '00'}:` +
            `${minutes ? (String(minutes).length === 1 ? '0' + String(minutes) : minutes) : '00'}`;

        return str.trim();
    };

    const addOrderLine = () => {
        // console.time('tables')

        const {params, color} = props
        let line = []

        orders.map((order, i) => {
            let cell = []

            params.map((param, index) => {
                if(param === 'FACT_DATE_FIRSTSAVE') {
                    cell.push(
                        <td className='align-middle text-center' style={{width: '10%', backgroundColor: 'transparent'}} key={index}>
                            {order[param]}
                        </td>
                    )
                }
                else if (
                    param === 'ITM_ORDERNUM' ||
                    param === 'itmOrderNum' ||
                    param === 'ORDER_NAME' ||
                    param === 'NAME') {
                    cell.push(
                        <td className='align-middle text-start' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                            {order.id ? (
                                <Link href={`/order/${order.id}`}>
                                    <a className='text-decoration-none text-dark ps-3'>
                                        {order[param]}
                                    </a>
                                </Link>
                            ) : (
                                <Link href={`/order/${order.ID}`}>
                                    <a className='text-decoration-none text-dark ps-3'>
                                        {order[param]}
                                    </a>
                                </Link>
                            )}
                        </td>
                    )
                }
                else if (typeof(param) === 'object') {
                    if (param[0] === 'extraData') {
                        cell.push(
                            <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                                <Row>
                                    <Col lg={10}>
                                        {props.allExtraData.map((data, edi) => {
                                            if (data.orderId === order.idOrder) {
                                                if (data.type === 'date') {
                                                    return <p className='mb-1' key={`${data.orderId}-${edi}`}>{data.name}: {format(new Date(data.data), 'HH:mm dd.MM.yy')}</p>
                                                } else {
                                                    return <p className='mb-1' key={`${data.orderId}-${edi}`}>{data.name}: {data.data}</p>
                                                }
                                            }
                                        })}
                                    </Col>
                                    <Col lg={2}>
                                        {props.allExtraData.length > 0 ? (
                                            order[param[1]]
                                        ) : null}
                                    </Col>
                                </Row>
                            </td>
                        )
                    } else {
                        cell.push(
                            <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                                {order[param[0]]} {order[param[1]]}
                            </td>
                        )
                    }
                }
                else if (param === 'datePlan' ||
                    param === 'PLAN_DATE' ||
                    param === 'TS' ||
                    param === 'DATE_ADDED' ||
                    param === 'TRANSFER_DATE' ||
                    param === 'dateSave' ||
                    param === 'dateFirstStage' ||
                    param === 'datePlanPack' ||
                    param === 'date' ) {
                    cell.push(
                        <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                            {new Date(order[param]).toLocaleString().slice(0,10)}
                        </td>
                    )
                }
                else if (param === 'extraData') {
                    cell.push(
                        <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                            <Row>
                                <Col lg={12}>
                                    {order.data.extraData.map((data, edi) => {
                                        if (data.type === 'date') {
                                            return <p className='text-start mb-1 p-0 fst-italic' style={{fontSize: '12px'}} key={`${data.orderId}-${edi}`}>{data.name}: <strong>{format(new Date(data.data), 'HH:mm dd.MM.yy')}</strong></p>
                                        } else {
                                            return <p className='text-start mb-1 p-0 fst-italic' style={{fontSize: '12px'}} key={`${data.orderId}-${edi}`}>{data.name}: <strong>{data.data}</strong></p>
                                        }

                                    })}
                                </Col>
                            </Row>
                        </td>
                    )
                }
                else if (
                    param === 'nameSectorInOrder' ||
                    param === 'status'
                ) {
                    cell.push(
                        <td className='align-middle text-center' style={{width: '14%', backgroundColor: 'transparent'}} key={index}>
                            <Row>
                                <Col>
                                    {order[param]}
                                </Col>
                            </Row>
                        </td>
                    )
                }
                else if (
                    param === 'ORDER_SQUARE' ||
                    param === 'fasadSquare' ||
                    param === 'generalSquare' ||
                    param === 'ORDER_FASADSQ') {
                    cell.push(
                        <td className='align-middle text-center' style={{width: '8%', backgroundColor: 'transparent'}} key={index}>
                            {Math.round(order[param] * 1000) / 1000}
                        </td>
                    )
                }
                else if (param === 'comments') {
                    if (order.data?.comments[0]) {
                        cell.push(
                            <td className='align-middle text-center' style={{width: '18%', backgroundColor: 'transparent'}} key={index}>
                                <Row className='w-100 align-items-center'>
                                    <Col lg={order.data.edit ? 10 : 12} className='p-0'>
                                        <div className='m-0' style={{fontSize: '12px'}}>
                                            <b>
                                                {order.data.comments[order.data.comments.length - 1].userName} </b>
                                            <i className='text-muted'>
                                                ({order.data.comments[order.data.comments.length - 1].sector}): </i>
                                            <i className='text-decoration-underline'>
                                                {order.data.comments[order.data.comments.length - 1].data ?
                                                    order.data.comments[order.data.comments.length - 1].data.length > 13 ?
                                                        `${order.data.comments[order.data.comments.length - 1].data.slice(0, 13)}...` :
                                                        `${order.data.comments[order.data.comments.length - 1].data}`
                                                    : null
                                                }
                                            </i>
                                        </div>
                                    </Col>
                                    {order.data.edit ? (
                                        <Col lg={2} className='p-0'>
                                            {order.data.edit}
                                        </Col>
                                    ) : null}
                                </Row>
                            </td>
                        )
                    } else {
                        cell.push(
                            <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                                <Row className='w-100 align-items-center'>
                                    <Col lg={10} className='p-0' />
                                    <Col lg={2} className='p-0'>
                                        {order.data.edit}
                                    </Col>
                                </Row>
                            </td>
                        )
                    }
                }
                else if (
                    param === 'COMMENT_PLAN' ||
                    param === 'NOTE'
                ) {
                    cell.push(
                        <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                            <Row>
                                <Col>
                                    {order[param]}
                                </Col>
                            </Row>
                        </td>
                    )
                }
                else if (param === 'workingTime' || param === 'workTime') {
                    if (order[param]) {
                        cell.push(
                            <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                                {renderToTime(order[param])}
                            </td>
                        )
                    } else {
                        cell.push(
                            <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index} />
                        )
                    }

                }
                else {
                    cell.push(
                        <td className='align-middle text-center' style={{width: 'auto', backgroundColor: 'transparent'}} key={index}>
                            {order[param]}
                        </td>
                    )
                }

            })

            line.push(
                <tr key={i} className='table-light my-table' style={{boxShadow: `inset 15px 0px 30px -15px ${color}`, color: 'black'}}>
                    {cell}
                </tr>
            )
        })

        // console.timeEnd('tables')

        return line
    }

    return (
            <tbody>
                {addOrderLine()}
            </tbody>
        )
}

export default Tbody