/* global chrome */
import { useState, useEffect } from "react";
import { MarketplaceParser } from "../utils/parseMarketplace";

export function useCurrentTab(products) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    try {
      if (typeof chrome !== "undefined" && chrome.tabs?.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const url = tabs[0]?.url;
          if (!url) return;
          setCurrentUrl(url);
          const isProduct = MarketplaceParser.isValidUrl(url);
          const sku = MarketplaceParser.parseSku(url);
          setShowFab(
            isProduct && !products.some((p) => p.productItem.article === sku)
          );
        });
      }
    } catch (e) {
      console.error("chrome.tabs unavailable", e);
    }
  }, [products]);

  return { currentUrl, showFab };
}