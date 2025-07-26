function encode(message, shift) {
  return message.replace(/[a-zA-Z]/g, (char) => {
    const isUpperCase = char === char.toUpperCase();
    const base = isUpperCase ? 65 : 97; // ASCII: A=65, a=97
    const code = char.charCodeAt(0) - base;
    const shifted = (code + shift) % 26;
    const finalCode = (shifted < 0 ? shifted + 26 : shifted) + base;
    return String.fromCharCode(finalCode);
  });
}

function decode(message, shift) {
  return encode(message, -shift); // Decoding is encoding with negative shift
}

module.exports = { encode, decode };