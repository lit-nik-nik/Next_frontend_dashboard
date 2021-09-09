import {Modal} from "react-bootstrap";

export default function ModalWindow (props) {

    return (
        <>
            <Modal
                {...props}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className='p-0 text-success text-center m-5'>
                    {props.data}
                </Modal.Body>
            </Modal>
        </>
    )
}