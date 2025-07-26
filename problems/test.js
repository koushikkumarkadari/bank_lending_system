const { encode, decode } = require('./caesarCipher');
const formatIndianCurrency = require('./indianCurrency');
const combineLists = require('./combineLists');
const minimizeLoss = require('./minimizeLoss');

// Caesar Cipher
console.log(encode("Hello, World!", 3)); // "Khoor, Zruog!"
console.log(decode("Khoor, Zruog!", 3)); // "Hello, World!"

// Indian Currency
console.log(formatIndianCurrency(123456.7891)); // "1,23,456.7891"
console.log(formatIndianCurrency(-123456)); // "-1,23,456"
console.log(formatIndianCurrency(1000.5)); // "1,000.5"

// Combine Lists
const list1 = [{ positions: [1, 4], values: [1] }];
const list2 = [{ positions: [2, 5], values: [2] }];
console.log(combineLists(list1, list2)); // [{ positions: [1, 4], values: [1, 2] }]

// Minimize Loss
console.log(minimizeLoss(5, [20, 15, 7, 2, 13])); // { buyYear: 2, sellYear: 5, loss: 2 }