import {Modal} from "react-bootstrap";

export default function ModalWindow (props) {

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className='p-0'>
                </Modal.Body>
            </Modal>
        </>
    )
}