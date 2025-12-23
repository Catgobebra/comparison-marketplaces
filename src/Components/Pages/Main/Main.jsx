import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import AddProductForm from "../../Widgets/AddProductForm/AddProductForm";
import ProductList from "../../Dummies/ProductList/ProductList";
import CartBadge from "../../UI/CartBadge/CartBadge";
import LoadingBackdrop from "../../UI/LoadingBackdrop/LoadingBackdrop";
import SnackbarAlert from "../../UI/SnackbarAlert/SnackbarAlert";
import CategoriesList from "../../Widgets/CategoriesList/CategoriesList";

import { useSnackbar } from "../../../Hooks/useSnackbar";
import { useProducts } from "../../../Hooks/useProducts";
import { useCategories } from "../../../Hooks/useCategories";
import { useCurrentTab } from "../../../Hooks/useCurrentTab";
import { useFilteredProducts } from "../../../Hooks/useFilteredProducts";
import { useChrome } from "../../../Hooks/useChrome";
import { useProductAddition } from "../../../Hooks/useProductAddition";

import { useLazyGetProductByUrlQuery } from '../../../redux/api';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import * as styles from './styles'

function MainContent() {
  const [getProduct, { data, isLoading,isFetching, error }] = useLazyGetProductByUrlQuery();
  const {snackbar, setSnackbarState } = useSnackbar();
  const {products} = useProducts(data);
  const { categories, currentCategory, setCurrentCategory, addToCategory,resetToAll } = useCategories();
  const { currentUrl, showFab } = useCurrentTab(products);
  const { openComparePage } = useChrome();

  const { 
    currentLink, 
    handleInputChange, 
    handleAddFromInput, 
    handleAddFromTab 
  } = useProductAddition(getProduct,setSnackbarState);

  const filteredProducts = useFilteredProducts(products, categories, currentCategory.id);

  const handleProductDrop = (productId, categoryId) => {
    addToCategory(productId, categoryId);
    setSnackbarState({
      open: true,
      severity: "success",
      message: `Товар добавлен в категорию`,
    });
  };

  const handleSnackbarClose = (e, reason) => {
    if (reason === "clickaway") return;
    setSnackbarState({ open: false });
  };

  return (
    <>
      <Box sx={styles.popupContainer}>
        <Box component="nav" sx={styles.navContainer}>
          <AddProductForm
            value={currentLink}
            onChange={handleInputChange}
            onAdd={handleAddFromInput}
            showFab={showFab}
            onAddFromTab={() => handleAddFromTab(currentUrl)}
          />
        </Box>
        
        <Box sx={styles.mainContainer}>
          <Box sx={styles.categoryContainer}>
            <CategoriesList 
              currentCategory={currentCategory}
              onCategoryChange={setCurrentCategory} 
              onProductDrop={handleProductDrop}
              resetToAll={resetToAll}
            />
          </Box>
          
          <Box sx={styles.mainContentContainer}>
            <Box>
              <CartBadge count={filteredProducts.length} />
              <SnackbarAlert
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={handleSnackbarClose}
              />
            </Box>

            <Box sx={styles.listProductContainer}>
              <ProductList 
                products={filteredProducts} 
                currentCategory={currentCategory}
              />
            </Box>
            
            <Button 
              variant="contained" 
              onClick={openComparePage}
              sx={styles.linkButton}
              endIcon={<ArrowRightAltIcon />}
            >
              Перейти
            </Button>
          </Box>
          <LoadingBackdrop open={isLoading} />
        </Box>
      </Box>
    </>
  );
}

export default function Main() {
  return (
    <DndProvider backend={HTML5Backend}>
      <MainContent />
    </DndProvider>
  );
}