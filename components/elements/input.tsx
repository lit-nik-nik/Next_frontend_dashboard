import {Alert, Form} from "react-bootstrap";
import React, {ReactElement} from "react";

type Input = {
    name: string,
    type?: string,
    value: string,
    onChange: any,
    onKeyPress?: any,
    disabled?: boolean
}

type Select = {
    name: string,
    value?: string,
    onChange: any,
    option: Array<ReactElement> | null
}

export const MyInput = ({name, type, value, onChange, onKeyPress, disabled}: Input) => {

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
                disabled={disabled ? disabled : false}
                className='border-0 border-bottom rounded-0 bg-light shadow-sm'
                onChange={e => onChange(e)}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        if (onKeyPress) onKeyPress()
                    }
                }}
            />
        </>
    )
}

export const MySelect = ({name, value, onChange, option}: Select) => {
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