import {Modal, Form} from "react-bootstrap";

export default function ModalComment (props) {

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className='p-0'>
                    <Form.Control
                        type='text'
                        ref={props.modalRef}
                        defaultValue={props.data.id ? props.data.id : ''}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}