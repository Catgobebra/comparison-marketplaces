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
import { addCategory, removeCategory } from "../../redux-state/reducers/filterProducts";

const RESERVED_CATEGORIES = ["Всё", "Избранное"];

const DroppableCategory = ({ 
  categoryName, 
  currentCategory, 
  onCategoryChange, 
  onProductDrop,
  onRemoveCategory 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PRODUCT,
    drop: (item) => {
      if (onProductDrop) {
        onProductDrop(item.id, categoryName);
      }
      return { name: categoryName };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [categoryName, onProductDrop]);

  const isSelected = categoryName === currentCategory;
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
        onClick={() => onCategoryChange(categoryName)}
      >
        <ListItemText 
          primary={categoryName} 
          primaryTypographyProps={{
            fontSize: "0.875rem",
            noWrap: true,
            title: categoryName,
            fontWeight: isSelected ? 'bold' : 'normal'
          }}
        />
        
        {!RESERVED_CATEGORIES.includes(categoryName) && (
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
              dispatch(onRemoveCategory(categoryName));
            }}
            aria-label={`Удалить категорию ${categoryName}`}
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
      dispatch(addCategory(inputValue));
      setInputValue('');
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('+')
      dispatch(addCategory(inputValue))
      setInputValue('')
    }
  };

 /*  if (isLoading) {
    return (
      <Box sx={{ width: "88px", display: "flex", justifyContent: "center", p: 2 }}>
        <Typography variant="body2">Загрузка...</Typography>
      </Box>
    );
  } */

  return (
    <Box sx={{ width: "88px", height: "100%", overflow: "auto" }}>
      <List dense sx={{ width: "100%" }}>
        {Object.keys(categories).map((categoryName) => (
          <DroppableCategory
            key={categoryName}
            categoryName={categoryName}
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