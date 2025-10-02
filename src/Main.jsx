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

import {changeProducts} from './redux-state/reducers/products'

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Main(){

    const navigate = useNavigate();

    const dispatch = useDispatch()
    const products = useSelector(state => state.products.products)

    const [currentLink, setCurrentLink] = useState('');

    const isOzonProduct = /https:\/\/www\.ozon\.ru\/product\/.+/i
    const isCurrentSkuOzon = /\/product\/[^\/]+\-(\d{9,})(?:\/|\?|$)/i

    const [currentUrl, setCurrentUrl] = useState('');
    const [isProduct, setIsProduct] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    /*useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
            setCurrentUrl(tabs[0].url)
            setIsProduct(isOzonProduct.test(tabs[0].url))
        }
        });
    }, []);*/

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({...prev, open: false}));
    };

    const getProductsInfo = async () => {
        try {
            const promises = products.map(sku => 
                fetch(`http://localhost:5018/api/Products/by-sku/${sku}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'text/plain'
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
            );

            const results = await Promise.all(promises);
            
            console.log('Products info:', results);
            
            navigate('/comparison', {
                state: { productsInfo: results }
            });
            
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            setSnackbar({
                open: true,
                severity: "warning",
                message: "Ошибка при получении данных о товарах"
            });
        }
    }

    const checkProduct = (url) => {
        return isOzonProduct.test(url) && isCurrentSkuOzon.test(url);
    }
    
    const addProduct = (currentState,currentSetState) => {
        const isValidProduct = checkProduct(currentState) && !products.includes(currentState.match(isCurrentSkuOzon)[1]);

        if (isValidProduct) {
            dispatch(changeProducts([...products, currentState.match(isCurrentSkuOzon)[1]]));
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

        currentSetState('');
    }

    const handleDelete = (productToDelete) => {
        dispatch(changeProducts(products.filter(product => product !== productToDelete)));
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
            <Button variant="contained" onClick={() => addProduct(currentLink,setCurrentLink)}>Добавить</Button>
            {isProduct &&
                (<Fab onClick={() => addProduct(currentUrl,setCurrentUrl)} style={{minWidth: '56px'}} color="primary" aria-label="add">
                <AddIcon/>
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
            <Button variant="contained" onClick={getProductsInfo}>
                Перейти
            </Button>
         </Box>
        </Container>
        </>
    )
}

export default Main