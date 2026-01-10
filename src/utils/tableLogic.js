export const excludedCharacteristics = [
  "Артикул",
  "Бренд",
  "Продавец",
  "Ссылка на товар",
];

export const getCostWeight = (
  name,
  len_,
  position,
  selectedChars,
  manualWeight = 1
  ) =>
  {
    const newLength = selectedChars.length
    const isSelect = selectedChars.includes(name);
    const baseWeight = isSelect ? Math.ceil((newLength - position) / newLength * 10) : 1;
    const selectionMultiplier = isSelect ? 2 : 1;
    const rawWeight = baseWeight * manualWeight * selectionMultiplier;
    return Math.min(20, Math.max(0, Math.ceil(rawWeight)));
  };

export const getPriceInfo = (product) => {
  const prices = [
    product.currentPrice || 0,
    product.cardPrice || 0,
    product.originalPrice || 0,
  ].filter((p) => p > 0);
  if (prices.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export const ratingConfidenceInterval = (
  avg_rating,
  num_reviews,
  confidence = 0.95
) => {
  if (num_reviews === 0) return [0, 0];
  if (num_reviews === 1) return [0, 5];
  const assumed_std = 1.2;
  const standard_error = assumed_std / Math.sqrt(num_reviews);
  const z_values = { 0.9: 1.645, 0.95: 1.96, 0.99: 2.576 };
  const z_value = z_values[confidence] || 1.96;
  const margin = z_value * standard_error;
  const lower = Math.max(0, avg_rating - margin);
  const upper = Math.min(5, avg_rating + margin);
  return [lower, upper];
};

export const getStatusRank = (low, high) => {
  const width = high - low;
  if (width === 0) return "не определена";
  if (width < 0.5) return "высокая";
  if (width < 1.0) return "средняя";
  return "низкая";
};
