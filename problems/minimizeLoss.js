function minimizeLoss(years, prices) {
  let minLoss = Infinity;
  let buyYear = -1;
  let sellYear = -1;
  let maxPrice = -Infinity;
  let maxPriceYear = -1;

  // Single pass: track max price seen so far and potential sales
  for (let i = 0; i < years; i++) {
    if (prices[i] > maxPrice) {
      maxPrice = prices[i];
      maxPriceYear = i + 1;
    } else if (maxPrice > prices[i]) {
      const loss = maxPrice - prices[i];
      if (loss < minLoss) {
        minLoss = loss;
        buyYear = maxPriceYear;
        sellYear = i + 1;
      }
    }
  }

  return { buyYear, sellYear, loss: minLoss };
}

module.exports = minimizeLoss;