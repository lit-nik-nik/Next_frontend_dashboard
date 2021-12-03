import {Button, Modal, Form} from "react-bootstrap";
import React, {Component} from "react";
import exitApp from "./exit";

export default class CustomError extends Component
    <
        {error: {message: string, errors}, cleanError},
        {errorView: boolean, errorMessage: string, verification: boolean}
    >
{

    constructor(props) {
        super(props);
    }

    state = {
        errorView: false,
        errorMessage: null,
        verification: false
    }

    async componentDidMount() {
        if (this.props.error) {
            this.setState({errorMessage: this.props.error.message})
            this.setState({errorView: true})
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.error !== prevProps.error) {
            this.setState({errorMessage: this.props.error.message})
            this.setState({errorView: true})
        }
    }

    closeModal = () => {
        this.setState({errorView: false})
        this.setState({verification: false})
        if (this.props.cleanError) this.props.cleanError()
    }

    render() {
        const {errorMessage, errorView, verification} = this.state

        return (
            <>
                <Modal
                    show={errorView}
                    backdrop='static'
                    keyboard={false}
                    size='lg'
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title>{errorMessage}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className='p-0 text-center m-3 error'>
                        <ul className='list-group'>
                            {this.props.error ?
                                this.props.error.errors.map((item, i) => {
                                    return (
                                        <li className='list-group-item list-group-item-danger mb-3' key={i}>{item}</li>
                                    )
                                })
                                : null}
                        </ul>
                    </Modal.Body>

                    <Modal.Footer style={{justifyContent: 'start'}} >
                        <Form.Check
                            type="switch"
                            isValid={verification === true}
                            isInvalid={verification === false}
                            checked={verification}
                            label="Я подтверждаю, что ознакомился(ась) с ошибкой"
                            onChange={() => this.setState({verification: !this.state.verification})}
                        />

                        <Button
                            variant='warning'
                            className='w-100 text-center text-uppercase'
                            disabled={!verification}
                            onClick={() => this.closeModal()}
                        >
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}