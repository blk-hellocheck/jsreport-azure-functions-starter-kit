function stringPrice(price) {
  const doublePrice = price / 100;
  return doublePrice.toFixed(2);
}

function padInvoiceNumber(number) {
  return number.toString().padStart(5, '0')
}