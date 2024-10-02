const sumReducer = (value) => (accumulator, currentValue) => {
  const numValue = Number(currentValue[value]);
  return isNaN(numValue) ? accumulator : accumulator + numValue
}
export const calculateTotalDebt = (debtors, propertyName) => {
  const reducer = sumReducer(propertyName);
  return debtors.reduce(reducer, 0)
}

export function thousandSeperator(num) {
  if (typeof num !== 'number') {
    console.error('input is not a valid number');
    return '';
  }
  let numStr = num.toString();
  numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return numStr
}
export const baseUrl = "https://newledger-f7b180e5a9de.herokuapp.com"
// export const baseUrl = "http://localhost:8080"  //this is for local