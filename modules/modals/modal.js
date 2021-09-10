import {Modal} from "react-bootstrap";

export default function ModalWindow (props) {

    const ordersDescription = props.orders.map((order, i) => {
        return (
            <div className={`${order.completed ? 'text-success' : 'text-danger'}`} key={i}>
                Заказ № {order.idOrder} {order.completed ? 'принят -' : 'не принят. Причина:'} {order.description}
            </div>
        )
    })

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className='p-0 text-center m-5'>
                    <h2 className='fw-bold'>{props.message ? `${props.message}` : null}</h2>
                    <hr/>
                    {props.orders[0] ? ordersDescription : null}
                </Modal.Body>
            </Modal>
        </>
    )
}