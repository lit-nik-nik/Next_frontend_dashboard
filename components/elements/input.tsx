import {Alert, Form} from "react-bootstrap";
import React from "react";

export const MyInput = ({name, type, value, onChange}) => {

    return (
        <>
            <Alert
                variant='light'
                className='text-start m-0 mt-2 p-0 text-black-50 fst-italic'
                style={{fontSize: '12px'}}
            >
                {name}
            </Alert>
            <Form.Control
                type={type ? type : 'text'}
                value={value}
                className='border-0 border-bottom rounded-0 bg-light shadow-sm'
                onChange={e => onChange(e)}
            />
        </>
    )
}

export const MySelect = ({name, value, onChange, option}) => {
    return (
        <>
            <Alert
                variant='light'
                className='text-start m-0 mt-2 p-0 text-black-50 fst-italic'
                style={{fontSize: '12px'}}
            >
                {name}
            </Alert>

            <Form.Select
                value={value}
                className='border-0 border-bottom rounded-0 bg-light shadow-sm'
                onChange={e => onChange(e)}
            >
                {option}
            </Form.Select>
        </>

    )
}