function formatIndianCurrency(number) {
  const numStr = number.toString();
  const [integerPart, decimalPart] = numStr.split('.');

  // Process integer part
  let formatted = '';
  const digits = integerPart.split('');
  const len = digits.length;

  // Insert commas: first three digits from right, then every two
  for (let i = 0; i < len; i++) {
    const posFromRight = len - 1 - i;
    formatted = digits[i] + formatted;
    if (posFromRight > 0 && posFromRight % 2 === 0 && posFromRight !== 2) {
      formatted = ',' + formatted;
    } else if (posFromRight === 2) {
      formatted = ',' + formatted;
    }
  }

  // Handle negative numbers
  if (integerPart.startsWith('-')) {
    formatted = '-' + formatted.slice(1);
  }

  // Append decimal part if exists
  return decimalPart ? `${formatted}.${decimalPart}` : formatted;
}

module.exports = formatIndianCurrency;