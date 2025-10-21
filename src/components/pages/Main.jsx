/* global chrome */
import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import AddProductForm from "../comps/AddProductForm";
import ProductList from "../views/local/ProductList";
import CartBadge from "../comps/CartBadge";
import LoadingBackdrop from "../comps/LoadingBackdrop";
import SnackbarAlert from "../comps/SnackbarAlert";

import useProducts from "../../hooks/useProducts";
import { isValidOzonUrl, parseSku } from "../../utils/ozon";

function Main() {
  const {
    products,
    loading,
    snackbar,
    setSnackbarState,
    addBySku,
    remove,
    doCompare,
  } = useProducts();
  const [currentLink, setCurrentLink] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    try {
      if (typeof chrome !== "undefined" && chrome.tabs?.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const url = tabs[0]?.url;
          if (!url) return;
          setCurrentUrl(url);
          const isProduct = isValidOzonUrl(url);
          setShowFab(
            isProduct && !products.some((p) => p.article === parseSku(url))
          );
        });
      }
    } catch (e) {
      console.error("chrome.tabs unavailable", e);
    }
  }, [products]);

  const handleInputChange = (e) => setCurrentLink(e.target.value);

  const handleAdd = async (link) => {
    const sku = parseSku(link);
    if (!sku) {
      setSnackbarState({
        open: true,
        severity: "error",
        message: "Неверная или пустая ссылка",
      });
      return;
    }
    try {
      await addBySku(sku);
    } catch (e) {
    }
    setCurrentLink("");
  };

  const handleAddFromTab = () => handleAdd(currentUrl);

  const handleDelete = (product) => remove(product);

  const handleOpenCompare = async () => {
    try {
      await doCompare();
    } catch (e) {
    }
    try {
      if (typeof chrome !== "undefined" && chrome.tabs?.create) {
        chrome.tabs.create({
          url: chrome.runtime.getURL("index.html#/comparison"),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSnackbarClose = (e, reason) => {
    if (reason === "clickaway") return;
    setSnackbarState({ open: false });
  };

  return (
    <>
      <Container
        maxWidth="lg"
        style={{
          minWidth: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box style={{ padding: "10px" }}>
          <Box
            style={{
              display: "flex",
              gap: 20,
              position: "relative",
              marginTop: "50px",
            }}
          >
            <CartBadge count={products.length} />
            <AddProductForm
              value={currentLink}
              onChange={handleInputChange}
              onAdd={handleAdd}
              showFab={showFab}
              onAddFromTab={handleAddFromTab}
            />
            <SnackbarAlert
              open={snackbar.open}
              severity={snackbar.severity}
              message={snackbar.message}
              onClose={handleSnackbarClose}
            />
          </Box>

          <Box>
            <ProductList products={products} onDelete={handleDelete} />
          </Box>

          <Button variant="contained" onClick={handleOpenCompare}>
            Перейти
          </Button>
        </Box>
      </Container>

      <LoadingBackdrop open={loading} />
    </>
  );
}

export default Main;
