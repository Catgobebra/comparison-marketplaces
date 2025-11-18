/* global chrome */
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeFilterProducts } from "../redux-state/reducers/filterProducts";

const RESERVED_CATEGORIES = ["Всё", "Избранное"];

export default function useCategories() {
  const dispatch = useDispatch();
  const productFilters = useSelector((state) => 
    state.filterProducts?.filterProducts || {}
  );
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.storage?.local?.get) {
          const result = await chrome.storage.local.get(["myStoredFiltersDict"]);
          
          if (result.myStoredFiltersDict) {
            const { "Всё": all = [], "Избранное": favorites = [], ...otherCategories } = 
              result.myStoredFiltersDict;
            
            dispatch(changeFilterProducts({ 
              "Всё": all, 
              "Избранное": favorites, 
              ...otherCategories 
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [dispatch]);

  const saveToStorage = useCallback(async (filters) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local?.set) {
        await chrome.storage.local.set({ 
          myStoredFiltersDict: filters
        });
      }
    } catch (error) {
      console.error("Failed to save categories:", error);
    }
  }, []);

  const addProductToCategory = useCallback(async (productId, categoryName) => {
    if (!productFilters[categoryName]) {
      console.error(`Category "${categoryName}" does not exist`);
      return false;
    }

    const currentProducts = productFilters[categoryName] || [];
    
    if (currentProducts.includes(productId)) {
      return false;
    }

    const updatedFilters = {
      ...productFilters,
      [categoryName]: [...currentProducts, productId]
    };
    
    dispatch(changeFilterProducts(updatedFilters));
    await saveToStorage(updatedFilters);
    return true;
  }, [productFilters, dispatch, saveToStorage]); 

    const isProductInCategory = useCallback((productId, categoryName) => {
    return (productFilters[categoryName] || []).includes(productId);
  }, [productFilters]);

  const removeProductFromCategory = useCallback(async (productId, categoryName) => {
    if (!productFilters[categoryName]) {
      return false;
    }

    const currentProducts = productFilters[categoryName] || [];
    const updatedFilters = {
      ...productFilters,
      [categoryName]: currentProducts.filter(id => id !== productId)
    };
    
    dispatch(changeFilterProducts(updatedFilters));
    await saveToStorage(updatedFilters);
    return true;
  }, [productFilters, dispatch, saveToStorage]);

  const removeProductFromAll = useCallback(async (productId) => {
  const updatedCategories = Object.keys(productFilters).reduce((acc, categoryName) => {
    acc[categoryName] = productFilters[categoryName].filter(id => id !== productId);
    return acc;
  }, {});
  
  dispatch(changeFilterProducts(updatedCategories));
  await saveToStorage(updatedCategories);
  }, [productFilters, dispatch, saveToStorage]);

  const addCategory = useCallback(async (categoryName) => {
    const trimmedName = categoryName.trim();
    
    if (!trimmedName || 
        productFilters[trimmedName] || 
        RESERVED_CATEGORIES.includes(trimmedName) ||
        !isNaN(trimmedName)) {
      return false;
    }

    const newCategories = {
      ...productFilters,
      [trimmedName]: []
    };
    
    dispatch(changeFilterProducts(newCategories));
    await saveToStorage(newCategories);
    return true;
  }, [productFilters, dispatch, saveToStorage]);

  const removeCategory = useCallback(async (categoryName) => {
    if (RESERVED_CATEGORIES.includes(categoryName)) return;

    const { [categoryName]: removed, ...newCategories } = productFilters;
    dispatch(changeFilterProducts(newCategories));
    await saveToStorage(newCategories);
  }, [productFilters, dispatch, saveToStorage]);

  return {
    categories: productFilters,
    isLoading,
    addCategory,
    removeCategory,
    addProductToCategory,
    removeProductFromCategory,
    isProductInCategory,
    reservedCategories: RESERVED_CATEGORIES
  };
}