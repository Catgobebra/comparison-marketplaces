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
import { ItemTypes } from '../../../Constants/ItemTypes';
import { addCategory, removeCategory } from "../../../redux/slices/filterProducts";

import * as styles from './styles'

const DroppableCategory = ({ 
  categoryId,
  categoryItem, 
  currentCategory, 
  onCategoryChange, 
  onProductDrop,
  onRemoveCategory,
  resetToAll
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
            title: categoryItem.name,
            fontWeight: isSelected ? 'bold' : 'normal',
            sx: {
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            hyphens: 'auto'
            }
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
              if (isSelected)
                resetToAll()
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

export default function CategoriesList({ currentCategory, onCategoryChange, onProductDrop, resetToAll }) {
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
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
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
            resetToAll={resetToAll}
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
                "& .MuiInputBase-root": { height: 'auto' },
                "& .MuiOutlinedInput-input": { 
                  fontSize: "0.875rem",
                  padding: "6px 8px",
                }
              }}
            />
          </Box>
        </ListItem>
      </List>
    </Box>
  );
}