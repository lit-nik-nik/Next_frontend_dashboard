import {Button} from "react-bootstrap";
import React from "react";

export const MyButton = (variant, onClick) => {

    return (
        <Button
            variant={`outline-${variant}`}
            className='me-3 shadow'
            onClick={() => onClick()}
        >
            Текущая неделя
        </Button>
    )
}