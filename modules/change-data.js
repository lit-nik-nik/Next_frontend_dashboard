export function changeDate (date, option) {
    const oldDate = new Date(date);

    let newDate;

    if (date) {
        if (option === 'YYYY-MM-DD') {
            let year, month, date

            year = oldDate.getFullYear()

            if (String(oldDate.getMonth()).length === 1) month = `0${oldDate.getMonth()+1}`
            else month = `${oldDate.getMonth()+1}`

            if (String(oldDate.getDate()).length === 1)  date = `0${oldDate.getDate()}`
            else date = `${oldDate.getDate()}`

            newDate = `${year}-${month}-${date}`;

            return newDate;
        } else {
            return oldDate.toLocaleDateString();
        }
    }
    else return date;
}