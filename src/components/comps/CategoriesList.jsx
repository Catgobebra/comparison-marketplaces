/* global chrome */
import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';

import { Box, IconButton } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { changeFilterProducts } from "../../redux-state/reducers/filterProducts";

import styles from './CategoriesList.module.sass';

export default function CategoriesList(props) {
    const dispatch = useDispatch();
    const productFilters = useSelector((s) => (s.filterProducts && s.filterProducts.filterProducts) || {});
    const [inputValue, setInputValue] = useState('');
    console.log(productFilters)
    React.useEffect(() => {
        chrome.storage.local.get(["myStoredFiltersDict"]).then((result) => {
          if (result.myStoredFiltersDict && Object.keys(result.myStoredFiltersDict).length > 0) {

          const { "Всё": all = [], "Избранное": favorites = [], ...otherCategories } = result.myStoredFiltersDict;
          dispatch(changeFilterProducts({ "Всё": all, "Избранное": favorites, ...otherCategories }));

          } else if (productFilters && productFilters.length > 0) {
            dispatch(changeFilterProducts(productFilters))
          }
        });
      }, [dispatch]); 

      const saveToChromeStorage = async (filters) => {
        try {
            if (typeof chrome !== "undefined" && chrome.storage?.local?.set) {
                await chrome.storage.local.set({ 
                    myStoredFiltersDict: filters
                });
                console.log("Saved to Chrome Storage:", filters);
            }
        } catch (e) {
            console.error("chrome.storage.set failed", e);
        }
    };


    const addCategory = async (value) => {
        if (!value || value.trim() === '' || productFilters[value] || Number(value)) return;

        const newCategories = {...productFilters, [value] : []};
        dispatch(changeFilterProducts(newCategories));
        await saveToChromeStorage(newCategories)
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const removeCategory = async (value) => {
        const { [value]: removed, ...newCategories } = productFilters;
        dispatch(changeFilterProducts(newCategories));
        await saveToChromeStorage(newCategories);
    }

    return (
        <List sx={{width: "88px", overflow : 'scroll'}}>
            {
                Object.keys(productFilters).map((element, index) => 
                    (<ListItem component="div" disablePadding key={index} sx={{position : 'relative'}}>
                            <ListItemButton>
                            {(element !== "Всё" && element !== "Избранное") && <IconButton 
                            aria-label={`category-${index}`}
                            size="small"
                            color="primary"
                            sx={{position : 'absolute', right : '1px', 'top' : '0', fontSize : '20px', padding : '0'}} 
                            onClick={() => removeCategory(element)}
                            >
                            <CloseIcon/>
                            </IconButton>}
                            <ListItemText className={styles.listElement} primary={element} />
                            </ListItemButton>
                    </ListItem>)
                )
            }
            <ListItem component="div" disablePadding>
                <Box sx={{'padding' : '8px'}}>
                    <TextField id="standard-basic" label="Введи данные" variant="standard" onChange={handleInputChange} value={inputValue} onBlur={() => {
                    if (inputValue.trim() !== '') {
                        addCategory(inputValue);
                        setInputValue('');}}} />     
                </Box>
            </ListItem>
        </List>
  );
}
