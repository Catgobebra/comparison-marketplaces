/* global chrome */
import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { addCategory, removeCategory } from "../../redux-state/slices/filterProducts";

const DroppableCategory = ({ 
  categoryId,
  categoryItem, 
  currentCategory, 
  onCategoryChange, 
  onProductDrop,
  onRemoveCategory 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PRODUCT,
    drop: (item) => {
      if (onProductDrop) {
        onProductDrop(item.id, categoryItem.id);
      }
      return { name: categoryItem.name };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [categoryItem.name, onProductDrop]);

  const isSelected = categoryId === currentCategory.id;
  const dispatch = useDispatch()

  return (
    <ListItem 
      ref={drop}
      disablePadding 
      sx={{ 
        position: "relative",
        backgroundColor: isOver ? 'action.hover' : 'transparent',
        transition: 'background-color 0.2s'
      }}
    >
      <ListItemButton 
        sx={{ 
          minHeight: 48,
          backgroundColor: isSelected ? 'action.selected' : 'transparent'
        }}
        onClick={() => onCategoryChange(categoryItem)}
      >
        <ListItemText 
          primary={categoryItem.name} 
          primaryTypographyProps={{
            fontSize: "0.875rem",
            noWrap: true,
            title: categoryItem.name,
            fontWeight: isSelected ? 'bold' : 'normal'
          }}
        />
        
        {!categoryItem.isSystem && (
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              right: 1,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.6,
              "&:hover": { opacity: 1 }
            }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(onRemoveCategory({categoryId : categoryId}));
            }}
            aria-label={`Удалить категорию ${categoryItem.name}`}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default function CategoriesList({ currentCategory, onCategoryChange, onProductDrop }) {
  const dispatch = useDispatch()  
  const categories = useSelector((s) => s.filterProducts?.filterProducts)
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      dispatch(addCategory({categoryName : inputValue}));
      setInputValue('');
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      dispatch(addCategory({categoryName : inputValue}))
      setInputValue('')
    }
  };

  return (
    <Box sx={{ width: "88px", height: "100%", overflow: "auto" }}>
      <List dense sx={{ width: "100%" }}>
        {categories.map((categoryObject) => (
          <DroppableCategory
            key={categoryObject.id}
            categoryId={categoryObject.id}
            categoryItem={categoryObject}
            currentCategory={currentCategory}
            onCategoryChange={onCategoryChange}
            onProductDrop={onProductDrop}
            onRemoveCategory={removeCategory}
          />
        ))}
        
        <ListItem disablePadding>
          <Box sx={{ p: 1, width: "100%" }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Новая категория"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={handleInputKeyPress}
              inputProps={{ maxLength: 20 }}
              sx={{
                "& .MuiInputBase-root": { height: 32 },
                "& .MuiOutlinedInput-input": { 
                  fontSize: "0.875rem",
                  padding: "6px 8px"
                }
              }}
            />
          </Box>
        </ListItem>
      </List>
    </Box>
  );
}