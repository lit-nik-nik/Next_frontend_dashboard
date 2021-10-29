
export default function Thead ({title}) {

    const tableHead = title.map((name, index) => 
        <th key={index} style={{position: "sticky", top: 0}}>
            {name}
        </th>
    )

    return (
        <thead className='align-middle text-center' style={{fontSize: '14px'}}>
            <tr>
                {tableHead}
            </tr>
        </thead>
    )
}
