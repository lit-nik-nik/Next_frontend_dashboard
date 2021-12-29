import {ToastContainer, Toast} from "react-bootstrap";
import React from "react";

const MyToast = (props) => {

    return (
        <ToastContainer className="p-3" position='bottom-end'>
            <Toast bg='success'>
                <Toast.Header closeButton={false}>
                    <strong className="me-auto" style={{fontSize: '10px'}}>{props.data.message}</strong>
                </Toast.Header>
                <Toast.Body>
                    {props.data.progress.map((item, i) => (
                        <div key={i}>
                            <small className='text-white'>
                                {item.name} - {item.complited ? 'Успешно' : 'Ошибка'}
                            </small>
                        </div>
                    ))}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default MyToast