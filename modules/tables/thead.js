export default function Thead ({title}) {

    const tableHead = title.map((name, index) => 
        <th key={index} className='align-middle text-center table-dark'>
            {name}
        </th>
    )

    return (
        <thead>
            <tr>
                {tableHead}
            </tr>
        </thead>
    )
}
