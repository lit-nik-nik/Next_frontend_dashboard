export default function Thead ({title}) {

    const tableHead = title.map((name, index) => 
        <th key={index}>
            {name}
        </th>
    )

    return (
        <thead className='align-middle text-center table-dark'>
            <tr>
                {tableHead}
            </tr>
        </thead>
    )
}
