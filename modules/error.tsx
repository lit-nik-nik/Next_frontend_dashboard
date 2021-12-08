import {Button, Modal} from "react-bootstrap";
import React, {Component} from "react";

export default class CustomError extends Component
    <
        {error: {message: string, errors: []}, cleanError?},
        {errorView: boolean, errorMessage: string, verification: number, interval: any}
    >
{

    constructor(props) {
        super(props);
    }

    state = {
        errorView: false,
        errorMessage: null,
        verification: 1,
        interval: null
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

        if (this.state.errorView) {
            if (!this.state.interval) {
                this.setState({
                    interval: setInterval(() => this.setState({verification: this.state.verification - 1}), 1000)
                })
            }
        }

        if (this.state.verification === 0) {
            clearInterval(this.state.interval)
        }
    }

    closeModal = () => {
        this.setState({errorView: false})
        this.setState({verification: 1})
        this.setState({interval: null})
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
                        <Button
                            variant='warning'
                            className='w-100 text-center text-uppercase'
                            disabled={verification !== 0}
                            onClick={() => this.closeModal()}
                        >
                            Я подтверждаю, что ознакомился(ась) с ошибкой
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}