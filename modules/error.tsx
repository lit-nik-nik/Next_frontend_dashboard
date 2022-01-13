import {Button, Modal} from "react-bootstrap";
import React, {useState} from "react";
import { connect } from "react-redux";
import {removeError} from '../redux/actions/actionsApp'

function CustomError (props: {error: {errors: [], message: string}, removeError: any}) {
    const [disabled, setDisabled] = useState(true)

    if (props.error) {
        setTimeout(() => setDisabled(false), 2000)

        return (
            <Modal
                show={!!props.error}
                backdrop='static'
                keyboard={false}
                size='lg'
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{props.error.message}</Modal.Title>
                </Modal.Header>

                <Modal.Body className='p-0 text-center m-3 error'>
                    <ul className='list-group'>
                        {props.error ?
                            props.error.errors.map((item, i) => {
                                return (
                                    <li className='list-group-item list-group-item-danger mb-3' key={i}>{item}</li>
                                )
                            })
                            : null}
                    </ul>
                </Modal.Body>

                <Modal.Footer style={{justifyContent: 'start'}} >
                    <Button
                        variant='warning'
                        className='w-100 text-center text-uppercase'
                        disabled={disabled}
                        onClick={() => {
                            props.removeError()
                            setDisabled(true)
                        }}
                    >
                        Я подтверждаю, что ознакомился(ась) с ошибкой
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    } else {
        return <> </>
    }


}

const mapSTP = state => {
    return {
        error: state.app.app_error
    }
}

export default connect(mapSTP,{removeError})(CustomError)

