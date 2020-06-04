export function validateEmail(email) {
    if (/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/gi.test(email))
        return true
    return false
}
export function validatePhone(phone) {
    if (/^[0-9]{2}(?:)\s?[0-9]{5}(?:)[0-9]{4}$/mg.test(phone))
        return true
    return false
}