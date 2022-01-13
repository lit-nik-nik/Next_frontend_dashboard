import React from "react";
import {Button} from "react-bootstrap";

type Print = {
    onClickPrint: any
}

export const printPage = (id: string) => {
    const printAndClose = () => {
        WinPrint.print();
        WinPrint.close();
    }

    const print = document.querySelector(`#${id}`),
        table = print.querySelector('.table'),
        bootstrapCss = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">';
    // @ts-ignore
    table.style.fontSize = '12px'

    let WinPrint = window.open('','','')
    WinPrint.document.write(bootstrapCss);
    WinPrint.document.write('<div id="print" class="mt-2 mx-3">');
    WinPrint.document.write('<div class="row">');
    WinPrint.document.write(print.innerHTML);
    WinPrint.document.write('</div>');
    WinPrint.document.write('</div>');
    WinPrint.focus();
    // @ts-ignore
    table.style.fontSize = '16px'
    setTimeout(printAndClose, 400)
}

export const IconPrint = ({onClickPrint}:Print) => {

    return (
        <Button
            variant='outline-dark'
            type='button'
            className="bi bi-printer-fill border-0 me-3 shadow float-end"
            onClick={() => onClickPrint()}
        />
    )
}