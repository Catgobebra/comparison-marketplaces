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
   * addBySku - запрашивает данные по sku и добавляет товар в список
   * @param {string} sku
   */
  const addBySku = useCallback(
    async (sku) => {
      if (!sku) {
        setSnackbar({ open: true, severity: "error", message: "SKU пустой" });
        throw new Error("SKU empty");
      }

      if (products.some((p) => String(p.article) === String(sku))) {
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
          return await api.getProductBySku(sku);
        };

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
