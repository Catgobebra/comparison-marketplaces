/* global chrome */
import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import Badge from '@mui/material/Badge';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { Link } from 'react-router-dom';

function Main(){

    const [products,setProducts] = useState([])
    const [currentLink, setCurrentLink] = useState('');

    const isOzonProduct = /https:\/\/www\.ozon\.ru\/product\/.+/i
    const isCurrentSkuOzon = /\/product\/[^\/]+\-(\d{9,})(?:\/|\?|$)/i

    const [currentUrl, setCurrentUrl] = useState('');

    const [isProduct, setIsProduct] = useState(false);

    const [open, setOpen] = React.useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });


    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
        }
        setSnackbar(prev => ({...prev, open: false}));
    };


    /* useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
            setCurrentUrl(tabs[0].url)
            setIsProduct(isOzonProduct.test(tabs[0].url))
        }
        });
    }, []); */

    const checkProduct = (url) => {
        return isOzonProduct.test(url) && isCurrentSkuOzon.test(url);
    }
    
    const addProduct = () => {
        const isValidProduct = checkProduct(currentLink) && !products.includes(currentLink.match(isCurrentSkuOzon)[1]);

        if (isValidProduct) {
            setProducts([...products, currentLink.match(isCurrentSkuOzon)[1]]);
            setSnackbar({
                open: true,
                severity: "success",
                message: "Товар успешно добавлен"
            });
        } else {
            setSnackbar({
                open: true,
                severity: "error",
                message: "Неверная или пустая ссылка"
            });
        }

        setCurrentLink('');


    }

    const handleDelete = (productToDelete) => {
        setProducts(products.filter(product => product !== productToDelete));
    };

    const handleInputChange = (event) => {
        setCurrentLink(event.target.value); 
    };
    
    return(
        <>
        <Container maxWidth="lg" style={{ minWidth : '400px', display: 'flex', alignItems : 'center', justifyContent : 'center', flexDirection : 'column'}}>
         <Box style={{padding : '10px'}}>
            <Box style={{display: 'flex', gap: 20, position : 'relative', marginTop: '50px'}}>
            <Badge badgeContent={products.length} color="primary" style={{position : 'absolute', top : '-50px', right : '0'}}>
            <ShoppingBasketIcon color="action" />
            </Badge>
            <TextField
            id="filled-search"
            label="Введите ссылку на товар"
            type="search"
            variant="filled"
            value={currentLink}
            onChange={handleInputChange}
            />
            <Button variant="contained" onClick={addProduct}>Добавить</Button>
            {isProduct &&
                (<Fab style={{minWidth: '56px'}} color="primary" aria-label="add">
                <AddIcon />
                </Fab>)
            }
            <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
            </Snackbar>
            </Box>
            <Box>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {products.map((value,index) => (
                <ListItem
                key={index}
                disableGutters
                secondaryAction={
                    <IconButton 
                    aria-label="delete"
                    onClick={() => handleDelete(value)} 
                    >
                    <DeleteIcon />
                    </IconButton>
                }
                >
                <InventoryIcon color="action" />
                <ListItemText primary={`${value}`} />
                </ListItem>
                ))}
                </List>
            </Box>
            <Button variant="contained">
                Перейти
            </Button>
         </Box>
        </Container>
        </>
    )
}

export default Main


