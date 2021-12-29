
export default function Thead ({title}) {

    const tableHead = title.map((name, index) => 
        <th key={index} style={{position: "sticky", top: 0, border: 0, zIndex: 10}}>
            {name}
        </th>
    )

    return (
        <thead className='align-middle text-center bg-dark text-white' style={{fontSize: '14px'}}>
            <tr style={{border: 0}}>
                {tableHead}
            </tr>
        </thead>
    )
}
