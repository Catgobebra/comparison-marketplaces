export const MarketplaceParser = {
  detectMarketplace(url) {
    if (/https:\/\/www\.ozon\.ru\/product\/.+/i.test(url)) return 'ozon';
    if (/https:\/\/www\.wildberries\.ru\/catalog\/.+/i.test(url)) return 'wb';
    if (/https?:\/\/(www\.)?market\.yandex\.ru\/card\//i.test(url)) return 'ya-market';
    return null;
  },

  getMarketplace(url) {
    return this.detectMarketplace(url)
  },

  parseSku(url) {
    const marketplace = this.detectMarketplace(url);
    
    switch (marketplace) {
      case 'ozon':
        const ozonMatch = url?.match(/\/product\/[^\/]+\-(\d{9,})(?:\/|\?|$)/i);
        return ozonMatch ? ozonMatch[1] : null;
        
      case 'wb':
        const wbMatch = url?.match(/\/catalog\/(\d+)\/detail/i);
        return wbMatch ? wbMatch[1] : null;
      case 'ya-market':
        const yaMatch = url?.match(/\/(\d{7,12})(?:\?|$)/);
        return yaMatch ? yaMatch[1] : null;  
      default:
        return null;
    }
  },

  isValidUrl(url) {
    return this.detectMarketplace(url) && this.parseSku(url);
  }
};