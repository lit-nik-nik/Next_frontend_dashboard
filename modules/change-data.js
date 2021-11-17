export function changeDate (date, option) {
    const oldDate = new Date(date);

    let year, month, day, hours, minutes

    year = oldDate.getFullYear()

    if (String(oldDate.getMonth()).length === 1) month = `0${oldDate.getMonth() + 1}`
    else month = `${oldDate.getMonth() + 1}`

    if (String(oldDate.getDate()).length === 1)  day = `0${oldDate.getDate()}`
    else day = `${oldDate.getDate()}`

    if (String(oldDate.getHours()).length === 1)  hours = `0${oldDate.getHours()}`
    else hours = `${oldDate.getHours()}`

    if (String(oldDate.getMinutes()).length === 1)  minutes = `0${oldDate.getMinutes()}`
    else minutes = `${oldDate.getMinutes()}`

    if (date) {
        if (option === 'YYYY-MM-DD') {
            return `${year}-${month}-${day}`;
        } else if (option === 'datetime') {
            return `${year}-${month}-${day}T${hours}:${minutes}`
        } else {
            return oldDate.toLocaleDateString();
        }
    }
    else return date;
}