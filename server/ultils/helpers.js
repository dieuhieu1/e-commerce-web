const formatMoney = (priceInUSD) => {
  const USD_TO_VND_RATE = 26330;

  const priceNumber = Number(priceInUSD);
  if (isNaN(priceNumber)) {
    console.error("formatMoney: Input is not a valid number", priceInUSD);
    return "Giá không hợp lệ";
  }

  const priceInVND = priceNumber * USD_TO_VND_RATE;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(priceInVND);
};

module.exports = { formatMoney };
