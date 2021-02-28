export function validateEmail(email) {
  if (/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/gi.test(email))
    return true;
  return false;
}
export function validatePhone(phone) {
  if (/^[0-9]{2}(?:)\s?[0-9]{5}(?:)[0-9]{4}$/gm.test(phone)) return true;
  return false;
}

export const validateDateOneLessOrEqualThanDateTwo = (dateOne, dateTwo) => {
  const dateOneWithoutTime = getDateWithoutTime(dateOne);
  const dateTwoWithoutTime = getDateWithoutTime(dateTwo);
  console.log(dateOneWithoutTime, dateTwoWithoutTime);
  if (dateOneWithoutTime.toISOString() === dateTwoWithoutTime.toISOString())
    return true;
  if (dateOneWithoutTime.getTime() < dateTwoWithoutTime.getTime()) return true;
  return false;
};

const getDateWithoutTime = (date) => {
  const dateNew = date.toISOString();
  const dateNewSplitted = dateNew.split("T");

  dateNewSplitted[1] = "00:00:00.000Z";

  const timeDate = dateNewSplitted[0];
  const timeZero = dateNewSplitted[1];

  const dateNewWithoutTime = new Date(`${timeDate}T${timeZero}`);
  return dateNewWithoutTime;
};
