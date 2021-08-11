export function colorDelay (delay) {
    if (delay > 0) {
        return (
            <td className='align-middle text-center table-danger' style={{width: 100}}>
                {delay} дн.
            </td>
        )
    }
    else if (delay < 0 ) {
        return (
            <td className='align-middle text-center table-success'>
                {delay} дн.
            </td>
        )
    }
    else if (delay === 0 ) {
        return (
            <td className='align-middle text-center table-warning'>
                {delay} дн.
            </td>
        )
    }
    else  {
        return (
            <td className='align-middle text-center'>
                
            </td>
        )
    }
}