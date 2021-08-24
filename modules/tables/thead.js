export default function Thead ({title}) {

    const tableHead = title.map((name, index) => 
        <th className='' key={index}>
            {name}
        </th>
    )

    return (
        <thead className='align-middle text-center table-secondary'>
            <tr>
                {tableHead}
            </tr>
        </thead>
    )
}
