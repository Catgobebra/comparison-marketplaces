/* global chrome */

import * as React from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { useDispatch, useSelector } from 'react-redux';
import { changeProducts } from '../redux-state/reducers/products';
import { useEffect } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CategoryHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '1.1em',
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
}));

function ProductTable() {
  const dispatch = useDispatch();
  const productsInfo = useSelector(state => state.products.products);
  const [characteristicsExpanded, setCharacteristicsExpanded] = React.useState(false);

  useEffect(() => {
    chrome.storage.local.get(["myStoredArray"]).then((result) => {
      if (result.myStoredArray && result.myStoredArray.length > 0) {
        dispatch(changeProducts(result.myStoredArray));
      }
    });
  }, [dispatch]);

  const excludedCharacteristics = [
    'Артикул', 'Бренд', 'Продавец', 'Ссылка на товар'
  ];

  const getGroupedCharacteristics = () => {
    if (productsInfo.length === 0) return {};
    
    const allCategories = {};
    
    productsInfo.forEach(product => {
      if (!product.characteristics) return;
      
      product.characteristics.forEach(group => {
        if (!allCategories[group.name]) {
          allCategories[group.name] = new Set();
        }
        
        group.characteristics?.forEach(char => {
          if (!excludedCharacteristics.includes(char.name)) {
            allCategories[group.name].add(char.name);
          }
        });
      });
    });
    
    const commonCategories = Object.keys(allCategories).filter(categoryName => {
      return productsInfo.every(product => 
        product.characteristics?.some(group => group.name === categoryName)
      );
    });
    
    const groupedCommonChars = {};
    
    commonCategories.forEach(categoryName => {
      const categoryCharSets = productsInfo.map(product => {
        const categoryGroup = product.characteristics?.find(group => group.name === categoryName);
        if (!categoryGroup?.characteristics) return new Set();
        
        return new Set(
          categoryGroup.characteristics
            .filter(char => !excludedCharacteristics.includes(char.name))
            .map(char => char.name)
        );
      });
      
      if (categoryCharSets.length > 0) {
        let commonCharsInCategory = Array.from(categoryCharSets[0]);
        for (let i = 1; i < categoryCharSets.length; i++) {
          commonCharsInCategory = commonCharsInCategory.filter(char => 
            categoryCharSets[i].has(char)
          );
        }
        
        if (commonCharsInCategory.length > 0) {
          groupedCommonChars[categoryName] = commonCharsInCategory;
        }
      }
    });
    
    return groupedCommonChars;
  };

  const findCharacteristicValueByCategory = (product, categoryName, characteristicName) => {
    if (!product.characteristics) return '—';
    
    const categoryGroup = product.characteristics.find(group => group.name === categoryName);
    if (!categoryGroup?.characteristics) return '—';
    
    const foundChar = categoryGroup.characteristics.find(c => c.name === characteristicName);
    return foundChar ? foundChar.value : '—';
  };

  const findCharacteristicValue = (product, characteristicName) => {
    if (!product.characteristics) return '—';
    
    for (const group of product.characteristics) {
      const foundChar = group.characteristics?.find(c => c.name === characteristicName);
      if (foundChar) {
        return foundChar.value;
      }
    }
    return '—';
  };

  const getPriceInfo = (product) => {
    const prices = [
      product.currentPrice || 0,
      product.cardPrice || 0,
      product.originalPrice || 0
    ].filter(price => price > 0);
    
    if (prices.length === 0) return { min: 0, max: 0 };
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  console.log('Сгруппированные характеристики:', getGroupedCharacteristics());

  if (!productsInfo || productsInfo.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Нет данных для отображения</h2>
        <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
      </div>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Сравнение товаров
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="comparison table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Характеристика</StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.productName || `Товар ${index + 1}`}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Основная информация о товарах */}
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Название</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.productName || '—'}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Цена</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => {
                const priceInfo = getPriceInfo(product);
                return (
                  <StyledTableCell key={index} align="center">
                    {priceInfo.max > priceInfo.min && priceInfo.min > 0 ? (
                      <>
                        <Chip 
                          style={{ textDecoration: 'line-through', margin: '2px' }} 
                          label={`${priceInfo.max}₽`} 
                          size="small"
                        />
                        <Chip 
                          label={`${priceInfo.min}₽`} 
                          color="success" 
                          size="small"
                        />
                      </>
                    ) : priceInfo.min > 0 ? (
                      <Chip label={`${priceInfo.min}₽`} color="primary" />
                    ) : (
                      '—'
                    )}
                  </StyledTableCell>
                );
              })}
            </StyledTableRow>
            
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Рейтинг</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.averageRating ? (
                    <Rating 
                      name="half-rating-read" 
                      value={product.averageRating} 
                      precision={0.01} 
                      readOnly 
                    />
                  ) : (
                    '—'
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Количество отзывов</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.reviewsCount || '—'}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Наличие</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.isAvailable ? 
                    <Chip label="В наличии" color="success" size="small" /> : 
                    <Chip label="Нет в наличии" color="error" size="small" />
                  }
                </StyledTableCell>
              ))}
            </StyledTableRow>

            {/* Заголовок секции характеристик с кнопкой сворачивания */}
            <StyledTableRow>
              <StyledTableCell 
                component="th" 
                scope="row" 
                colSpan={productsInfo.length + 1}
                sx={{ 
                  backgroundColor: 'grey.200',
                  fontWeight: 'bold',
                  fontSize: '1.1em'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    aria-label="expand characteristics"
                    size="small"
                    onClick={() => setCharacteristicsExpanded(!characteristicsExpanded)}
                    sx={{ mr: 1 }}
                  >
                    {characteristicsExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                  Характеристики товаров
                </Box>
              </StyledTableCell>
            </StyledTableRow>

            <TableRow>
              <TableCell style={{ padding: 0 }} colSpan={productsInfo.length + 1}>
                <Collapse in={characteristicsExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 0 }}>
                    {Object.entries(getGroupedCharacteristics()).map(([categoryName, characteristics]) => (
                      <React.Fragment key={categoryName}>
                        <StyledTableRow>
                          <CategoryHeaderCell colSpan={productsInfo.length + 1} align="center">
                            {categoryName}
                          </CategoryHeaderCell>
                        </StyledTableRow>
                        
                        {characteristics.map(characteristic => (
                          <StyledTableRow key={characteristic}>
                            <StyledTableCell component="th" scope="row" sx={{ paddingLeft: 4 }}>
                              {characteristic}
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                              <StyledTableCell key={index} align="center">
                                {findCharacteristicValueByCategory(product, categoryName, characteristic)}
                              </StyledTableCell>
                            ))}
                          </StyledTableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
            
            {/* Дополнительная информация */}
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Артикул (SKU)</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.article || '—'}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Бренд</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.brand || '—'}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Продавец</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.sellerName || '—'}
                </StyledTableCell>
              ))}
            </StyledTableRow>   
            
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Ссылка на товар</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.productUrl ? (
                    <a 
                      href={product.productUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8em' }}
                    >
                      Перейти к товару
                    </a>
                  ) : (
                    '—'
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Изображение товара</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.productName}
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px',
                        margin: '5px'
                      }}
                    />
                  ) : (
                    '—'
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ProductTable;