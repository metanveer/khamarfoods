export function decimalWithCommas(x) {
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  const y = addDecimals(x);
  return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
