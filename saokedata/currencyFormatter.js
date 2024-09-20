function formatCurrency(value) {
  let number = parseFloat(value);
  if (isNaN(number)) return value;
  return number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  // .replace("₫", "");
}

module.exports = formatCurrency;
