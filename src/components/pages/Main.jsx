/* global chrome */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import AddProductForm from "../comps/AddProductForm";
import ProductList from "../views/local/ProductList";
import CartBadge from "../comps/CartBadge";
import LoadingBackdrop from "../comps/LoadingBackdrop";
import SnackbarAlert from "../comps/SnackbarAlert";
import CategoriesList from "../comps/CategoriesList";

import useProducts from "../../hooks/useProducts";
import { MarketplaceParser } from "../../utils/parseMarketplace";

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

function Main() {
  const {
    products,
    loading,
    snackbar,
    setSnackbarState,
    addByUrl,
    remove,
    doCompare,
    loadCompareProducts
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
          const isProduct = MarketplaceParser.isValidUrl(url);
          setShowFab(
            isProduct && !products.some((p) => p.article === MarketplaceParser.parseSku(url))
          );
        });
      }
    } catch (e) {
      console.error("chrome.tabs unavailable", e);
    }
  }, [products]);

  const handleInputChange = (e) => setCurrentLink(e.target.value);

  const handleAdd = async (link) => {
    const sku = MarketplaceParser.parseSku(link);
    if (!sku) {
      setSnackbarState({
        open: true,
        severity: "error",
        message: "Неверная или пустая ссылка",
      });
      return;
    }
    try {
      await addByUrl(link);
    } catch (e) {}
    setCurrentLink("");
  };

  const handleAddFromTab = () => handleAdd(currentUrl);

  const handleDelete = (product) => remove(product);

  const handleOpenCompare = async () => {
    /* try {
      await doCompare();
    } catch (e) {} */
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
      <Box 
        sx={{
          width: '652px',
          backgroundColor: 'background.default',
          color: 'text.primary',
        }}
      >
        <Box 
          component="nav"
          sx={{
            width: '100%',
            height: '76px',
            position : 'relative',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '15px',
            backgroundColor: 'background.paper',
          }}
        >
          <AddProductForm
            value={currentLink}
            onChange={handleInputChange}
            onAdd={handleAdd}
            showFab={showFab}
            onAddFromTab={handleAddFromTab}
          />
        </Box>
        
        <Box sx={{ display: "flex", width: "100%" }}>
          <Box
            sx={{
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)',
              position : 'relative',
              backgroundColor: 'background.paper',
            }}
          >
            <CategoriesList />
          </Box>
          
          <Box
            sx={{
              padding: "10px",
              height: "400px",
              width: "100%",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              gap: '20px',
              backgroundColor: 'background.default',
            }}
          >
            <Box>
              <CartBadge count={products.length} />
              <SnackbarAlert
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={handleSnackbarClose}
              />
            </Box>

            <Box sx={{ height: "80%", width: "100%", overflow: 'auto' }}>
              <ProductList products={products} onDelete={handleDelete} />
            </Box>
            
            <Button 
              variant="contained" 
              onClick={handleOpenCompare}
              sx={{
                width: '234px',
                height: '40px',
                borderRadius: '2px',
                fontSize: '12px',
                textTransform: 'capitalize',
              }}
              endIcon={<ArrowRightAltIcon />}
            >
              Перейти
            </Button>
          </Box>
          <LoadingBackdrop open={loading} />
        </Box>
      </Box>
    </>
  );
}

export default Main;


