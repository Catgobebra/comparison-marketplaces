/* global chrome */
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeProducts } from "../redux-state/reducers/products";
import { changeCompareProducts } from "../redux-state/reducers/compareProduct";
import { changeSelectedProducts } from "../redux-state/reducers/selectedProducts";
import useCategories  from './useCategories';
import * as api from "../api/products";

export default function useProducts({ retries = 1, retryDelay = 500 } = {}) {
  const dispatch = useDispatch();
  const products = useSelector((s) => (s.products && s.products.products) || []);
  const selectedProducts = useSelector((s) => s.selectedProduct?.selectedProducts || []);
  const compareProducts = useSelector((s) => (s.compareProducts && s.compareProducts.compare_products) || []);

  const { addProductToCategory,removeProductFromCategory } = useCategories();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  /* console.log("Products:", products);
  console.log("Selected Products:", selectedProducts);
  console.log("Compare Products:", compareProducts); */

  const abortRef = useRef(null);

  const persist = useCallback((newProducts) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local?.set) {
        chrome.storage.local
          .set({ myStoredArray: newProducts })
          .catch(console.error);
      }
    } catch (e) {
      console.error("chrome.storage.set failed", e);
    }
  }, []);

  const persistSelected = useCallback((newSelectedProducts) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local?.set) {
        chrome.storage.local
          .set({ myStoredSelectedArray: newSelectedProducts })
          .catch(console.error);
      }
    } catch (e) {
      console.error("chrome.storage.set failed", e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local?.get) {
        chrome.storage.local
          .get(["myStoredArray"])
          .then((result) => {
            if (!mounted) return;
            if (result?.myStoredArray?.length) {
              dispatch(changeProducts(result.myStoredArray));
            }
          })
          .catch((e) => {
            console.error("chrome.storage.get failed", e);
          });
      }
    } catch (e) {
      console.error("chrome.storage unavailable", e);
    }
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local?.get) {
        chrome.storage.local
          .get(["myStoredSelectedArray"])
          .then((result) => {
            if (!mounted) return;
            if (result?.myStoredSelectedArray?.length) {
              dispatch(changeSelectedProducts(result.myStoredSelectedArray));
            }
          })
          .catch((e) => {
            console.error("chrome.storage.get failed", e);
          });
      }
    } catch (e) {
      console.error("chrome.storage unavailable", e);
    }
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const setSnackbarState = useCallback((state) => {
    setSnackbar((prev) => ({ ...prev, ...state }));
  }, []);

  const withRetry = useCallback(
    async (fn, attempts = retries, delay = retryDelay) => {
      let lastErr;
      for (let i = 0; i <= attempts; i++) {
        try {
          return await fn();
        } catch (err) {
          lastErr = err;
          if (err.name === "AbortError") throw err;
          if (i < attempts) {
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      }
      throw lastErr;
    },
    [retries, retryDelay]
  );

  /**
   * addByUrl - запрашивает данные по url и добавляет товар в список
   * @param {string} url
   */
  const addByUrl = useCallback(
    async (url) => {
      if (!url) {
        setSnackbar({ open: true, severity: "error", message: "url пустой" });
        throw new Error("url empty");
      }

      if (products.some((p) => String(p.productUrl) === String(url))) {
        setSnackbar({
          open: true,
          severity: "info",
          message: "Товар уже добавлен",
        });
        return null;
      }

      setLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const signal = controller.signal;

      try {
        const fetchFn = async () => {
          return await api.getProductByUrl(url);
        };

        const info = await withRetry(fetchFn);

        if (!info || info.productName == null) {
          throw new Error("product is null");
        }

        const newProducts = [...products, info];
        dispatch(changeProducts(newProducts));
        persist(newProducts);
        await addProductToCategory(info.article, "Всё");

        setSnackbar({
          open: true,
          severity: "success",
          message: "Товар успешно добавлен",
        });

        return info;
      } catch (e) {
        if (e.name === "AbortError") {
          console.warn("addByUrl aborted");
          setSnackbar({
            open: true,
            severity: "info",
            message: "Операция прервана",
          });
          throw e;
        }
        console.error("addByUrl error", e);
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Ошибка при получении данных о товарах",
        });
        throw e;
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setLoading(false);
      }
    },
    [dispatch, persist, products, withRetry]
  );

  const addToSelected = useCallback((product) => {
    if (selectedProducts.some(p => p.article === product.article)) {
      setSnackbar({
        open: true,
        severity: 'info',
        message: 'Товар уже выбран для сравнения'
      });
      return;
    }

    const newSelected = [...selectedProducts, product];
    dispatch(changeSelectedProducts(newSelected));
    persistSelected(newSelected);

    console.log("Added to selected:", newSelected);
    
    setSnackbar({
      open: true,
      severity: 'success',
      message: 'Товар добавлен для сравнения'
    });
  }, [dispatch, selectedProducts, persistSelected]);

  const removeFromSelected = useCallback((product) => {
    const newSelected = selectedProducts.filter(p => p.article !== product.article);
    dispatch(changeSelectedProducts(newSelected));
    persistSelected(newSelected);
    
    console.log('Removed from selected, new array:', newSelected);
    
    setSnackbar({
      open: true,
      severity: 'info',
      message: 'Товар удален из выбранных'
    });
  }, [dispatch, selectedProducts, persistSelected]);

  /**
   * remove - удаляет товар из списка
   * @param {object} product
   */
  const remove = useCallback(
    (product) => {
      const newProducts = products.filter((p) => p !== product);
      dispatch(changeProducts(newProducts));
      persist(newProducts);
      
      const newSelected = selectedProducts.filter(p => p.article !== product.article);
      dispatch(changeSelectedProducts(newSelected));
      persistSelected(newSelected);
      removeProductFromCategory(product.article, "Всё")//!

      
      setSnackbar({ open: true, severity: "info", message: "Товар удалён" });
    },
    [dispatch, persist, products, selectedProducts, persistSelected]
  );

  /**
   * doCompare - отправляет выбранные продукты на сервер для сравнения
   */
  const doCompare = useCallback(async () => {
    if (!selectedProducts || selectedProducts.length === 0) {
      setSnackbar({
        open: true,
        severity: "info",
        message: "Нет выбранных товаров для сравнения",
      });
      return null;
    }

    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const fetchFn = async () => {
        return await api.compareProducts(selectedProducts);
      };

      const result = await withRetry(fetchFn);

      const newCompareProducts = Array.isArray(result.result) ? result.result : [];
      dispatch(changeCompareProducts(newCompareProducts));

      try {
        if (typeof chrome !== "undefined" && chrome.storage?.local?.set) {
          await chrome.storage.local.set({ 
            myStoredCompareArray: newCompareProducts
          });
        }
      } catch (e) {
        console.error("chrome.storage.set failed", e);
      }

      setSnackbar({
        open: true,
        severity: "success",
        message: "Сравнение выполнено",
      });

      return result;
    } catch (e) {
      if (e.name === "AbortError") {
        console.warn("doCompare aborted");
        setSnackbar({
          open: true,
          severity: "info",
          message: "Операция прервана",
        });
        throw e;
      }
      console.error("doCompare error", e);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Ошибка при отправке данных",
      });
      throw e;
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }, [dispatch, selectedProducts, withRetry]);

  const loadCompareProducts = useCallback(() => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local?.get) {
        chrome.storage.local
          .get(["myStoredCompareArray"])
          .then((result) => {
            if (result?.myStoredCompareArray?.length) {
              dispatch(changeCompareProducts(result.myStoredCompareArray));
            }
          })
          .catch(console.error);
      }
    } catch (e) {
      console.error("chrome.storage unavailable", e);
    }
  }, [dispatch]);

  return {
    products,
    selectedProducts,
    compareProducts,
    loading,
    snackbar,
    setSnackbarState,
    addByUrl,
    remove,
    doCompare,
    loadCompareProducts,
    addToSelected,
    removeFromSelected 
  };
}