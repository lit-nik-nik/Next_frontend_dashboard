import React from "react";

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
        trMyTable = print.querySelectorAll('.my-table'),
        bootstrapCss = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">';
    table.style.fontSize = '12px'

    let WinPrint = window.open('','','')
    WinPrint.document.write(bootstrapCss);
    WinPrint.document.write('<div id="print" class="mt-2 mx-3">');
    WinPrint.document.write('<div class="row">');
    WinPrint.document.write(print.innerHTML);
    WinPrint.document.write('</div>');
    WinPrint.document.write('</div>');
    WinPrint.focus();
    table.style.fontSize = '16px'
    setTimeout(printAndClose, 400)
}

export const IconPrint = ({onClickPrint}:Print) => {

    return (
        <div
            className="bi bi-printer-fill print float-end"
            style={{fontSize: '26px'}}
            onClick={() => onClickPrint()}
        />
    )
}