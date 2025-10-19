/* global chrome */
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeProducts } from "../redux-state/reducers/products";
import * as api from "../api/products";
import { parseSku } from "../utils/ozon";

export default function useProducts({ retries = 1, retryDelay = 500 } = {}) {
  const dispatch = useDispatch();
  const products = useSelector(
    (s) => (s.products && s.products.products) || []
  );

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // ref to current AbortController so we can cancel ongoing network ops on unmount
  const abortRef = useRef(null);

  // utility: persist products to chrome.storage if available
  const persist = useCallback((newProducts) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local?.set) {
        chrome.storage.local
          .set({ myStoredArray: newProducts })
          .catch(console.error);
      }
    } catch (e) {
      // not fatal in environments without chrome
      console.error("chrome.storage.set failed", e);
    }
  }, []);

  // load initial products from chrome.storage
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

  // cleanup: abort on unmount
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

  // helper: retry wrapper for async function that accepts AbortSignal
  const withRetry = useCallback(
    async (fn, attempts = retries, delay = retryDelay) => {
      let lastErr;
      for (let i = 0; i <= attempts; i++) {
        try {
          return await fn();
        } catch (err) {
          lastErr = err;
          // if aborted - throw immediately
          if (err.name === "AbortError") throw err;
          if (i < attempts) {
            // wait before next try
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      }
      throw lastErr;
    },
    [retries, retryDelay]
  );

  /**
   * addBySku - запрашивает данные по sku и добавляет товар в список
   * @param {string} sku
   */
  const addBySku = useCallback(
    async (sku) => {
      if (!sku) {
        setSnackbar({ open: true, severity: "error", message: "SKU пустой" });
        throw new Error("SKU empty");
      }

      // prevent adding duplicate article
      if (products.some((p) => String(p.article) === String(sku))) {
        setSnackbar({
          open: true,
          severity: "info",
          message: "Товар уже добавлен",
        });
        return null;
      }

      setLoading(true);

      // create a new AbortController per operation and store ref (so we can abort on unmount)
      const controller = new AbortController();
      abortRef.current = controller;
      const signal = controller.signal;

      try {
        const fetchFn = async () => {
          // api.getProductBySku can be enhanced to accept signal; if not, create your own fetch wrapper here
          // we'll call api.getProductBySku(sku) and assume it doesn't accept signal; to support cancellation,
          // you can implement a helper fetchWithSignal in api layer.
          return await api.getProductBySku(sku);
        };

        // withRetry wraps fetchFn and will try again on transient failures
        const info = await withRetry(fetchFn);

        if (!info || info.productName == null) {
          throw new Error("product is null");
        }

        const newProducts = [...products, info];
        dispatch(changeProducts(newProducts));
        persist(newProducts);

        setSnackbar({
          open: true,
          severity: "success",
          message: "Товар успешно добавлен",
        });

        return info;
      } catch (e) {
        // if aborted - keep behavior minimal
        if (e.name === "AbortError") {
          console.warn("addBySku aborted");
          setSnackbar({
            open: true,
            severity: "info",
            message: "Операция прервана",
          });
          throw e;
        }
        console.error("addBySku error", e);
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Ошибка при получении данных о товарах",
        });
        throw e;
      } finally {
        // clear controller reference if it's ours
        if (abortRef.current === controller) abortRef.current = null;
        setLoading(false);
      }
    },
    [dispatch, persist, products, withRetry]
  );

  /**
   * remove - удаляет товар из списка
   * @param {object} product
   */
  const remove = useCallback(
    (product) => {
      const newProducts = products.filter((p) => p !== product);
      dispatch(changeProducts(newProducts));
      persist(newProducts);
      setSnackbar({ open: true, severity: "info", message: "Товар удалён" });
      // if current tab has same SKU, UI outside hook can decide to show Fab again using parseSku(currentUrl)
    },
    [dispatch, persist, products]
  );

  /**
   * doCompare - отправляет текущие продукты на сервер для сравнения
   */
  const doCompare = useCallback(async () => {
    if (!products || products.length === 0) {
      setSnackbar({
        open: true,
        severity: "info",
        message: "Нет товаров для сравнения",
      });
      return null;
    }

    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const fetchFn = async () => {
        return await api.compareProducts(products);
      };

      const result = await withRetry(fetchFn);

      const newProducts = Array.isArray(result.result) ? result.result : [];
      dispatch(changeProducts(newProducts));
      persist(newProducts);

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
  }, [dispatch, persist, products, withRetry]);

  return {
    products,
    loading,
    snackbar,
    setSnackbarState,
    addBySku,
    remove,
    doCompare,
  };
}
