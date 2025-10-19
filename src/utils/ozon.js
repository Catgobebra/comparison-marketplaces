export const isOzonProduct = (url) =>
  /https:\/\/www\.ozon\.ru\/product\/.+/i.test(url);
export const parseSku = (url) => {
  const m = url?.match(/\/product\/[^\/]+\-(\d{9,})(?:\/|\?|$)/i);
  return m ? m[1] : null;
};
export const isValidOzonUrl = (url) => isOzonProduct(url) && !!parseSku(url);
