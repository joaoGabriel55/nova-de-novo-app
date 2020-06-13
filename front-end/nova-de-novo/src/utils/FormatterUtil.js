import moment from 'moment'

export const formatDate = (date, withHoursAndMinutes) => {
    return moment(date).format(`DD/MM/YYYY ${withHoursAndMinutes ? 'hh:mm' : ''}`)
}

export const stringToDate = (string) => {
    const parts = string.split("/");
    const dt = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    return dt
}

export const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
}

export const removeMaskPhoneNumber = (phoneNumberString) => {
    let phoneOnlyNumbers = phoneNumberString
    return phoneOnlyNumbers.replace("(", "").replace(")", "").replace("-", "").replace(" ", "")
}