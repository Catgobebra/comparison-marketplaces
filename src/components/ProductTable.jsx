/* global chrome */

import * as React from "react";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Checkbox from "@mui/material/Checkbox";

import { useDispatch, useSelector } from "react-redux";
import { changeProducts } from "../redux-state/reducers/products";
import { useEffect } from "react";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DraggableTableRow = styled(StyledTableRow)(({ theme, isdragging }) => ({
  cursor: isdragging === "true" ? "grabbing" : "grab",
  backgroundColor:
    isdragging === "true" ? theme.palette.action.selected : "inherit",
  opacity: isdragging === "true" ? 0.6 : 1,
  transition: "all 0.2s ease",
}));

function ProductTable() {
  const dispatch = useDispatch();
  const productsInfo = useSelector((state) => state.products.products);
  const [characteristicsExpanded, setCharacteristicsExpanded] =
    React.useState(true);
  const [draggedRow, setDraggedRow] = React.useState(null);
  const [dragOverRow, setDragOverRow] = React.useState(null);
  const [orderedCharacteristics, setOrderedCharacteristics] = React.useState(
    []
  );
  const [selectedCharacteristics, setSelectedCharacteristics] = React.useState(
    []
  );

  console.log(characteristicsExpanded);
  console.log(orderedCharacteristics);
  console.log(selectedCharacteristics);

  useEffect(() => {
    chrome.storage.local.get(["myStoredArray"]).then((result) => {
      if (result.myStoredArray && result.myStoredArray.length > 0) {
        dispatch(changeProducts(result.myStoredArray));
      }
    });
  }, [dispatch]);

  const excludedCharacteristics = [
    "Артикул",
    "Бренд",
    "Продавец",
    "Ссылка на товар",
  ];

  // Drag and Drop handlers for characteristics only
  const handleDragStart = (e, index) => {
    setDraggedRow(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedRow === null || draggedRow === index) return;
    setDragOverRow(index);
  };

  const handleDragLeave = () => {
    setDragOverRow(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedRow === null || draggedRow === targetIndex) return;

    const newOrder = [...orderedCharacteristics];
    const [movedCharacteristic] = newOrder.splice(draggedRow, 1);
    newOrder.splice(targetIndex, 0, movedCharacteristic);

    setOrderedCharacteristics(newOrder);

    setDraggedRow(null);
    setDragOverRow(null);
  };

  const handleDragEnd = () => {
    setDraggedRow(null);
    setDragOverRow(null);
  };

  // Checkbox handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = displayCharacteristics.map((n) => n.name);
      setSelectedCharacteristics(newSelecteds);
      return;
    }
    setSelectedCharacteristics([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selectedCharacteristics.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCharacteristics, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCharacteristics.slice(1));
    } else if (selectedIndex === selectedCharacteristics.length - 1) {
      newSelected = newSelected.concat(selectedCharacteristics.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCharacteristics.slice(0, selectedIndex),
        selectedCharacteristics.slice(selectedIndex + 1)
      );
    }

    setSelectedCharacteristics(newSelected);
  };

  const isSelected = (name) => selectedCharacteristics.indexOf(name) !== -1;

  const getProductCharacteristics = (product) => {
    if (!product.characteristics) return [];

    const characteristics = [];
    product.characteristics.forEach((group) => {
      group.characteristics?.forEach((char) => {
        if (
          !excludedCharacteristics.includes(char.name) &&
          char.value &&
          char.value !== "—"
        ) {
          characteristics.push({
            name: char.name,
            value: char.value,
            isBest: char.isBest || false,
          });
        }
      });
    });

    return characteristics;
  };

  const ratingConfidenceInterval = (
    avg_rating,
    num_reviews,
    confidence = 0.95
  ) => {
    if (num_reviews <= 1) return [0, 5];

    const assumed_std = 1.2;
    const standard_error = assumed_std / Math.sqrt(num_reviews);

    const z_values = {
      0.9: 1.645,
      0.95: 1.96,
      0.99: 2.576,
    };

    const z_value = z_values[confidence] || 1.96;
    const margin = z_value * standard_error;

    const lower = Math.max(0, avg_rating - margin);
    const upper = Math.min(5, avg_rating + margin);

    return [lower, upper];
  };

  const getStatusRank = (low, high) => {
    const width = high - low;

    let reliability;
    if (width < 0.5) reliability = "высокая";
    else if (width < 1.0) reliability = "средняя";
    else reliability = "низкая";
    return reliability;
  };

  const getCommonCharacteristics = () => {
    if (productsInfo.length === 0) return [];

    const allCharacteristics = [];
    const characteristicNames = new Set();

    productsInfo.forEach((product, index) => {
      const productChars = getProductCharacteristics(product);
      allCharacteristics[index] = productChars;
      productChars.forEach((char) => characteristicNames.add(char.name));
    });

    const commonCharNames = Array.from(characteristicNames).filter(
      (charName) => {
        return productsInfo.every((_, index) => {
          return allCharacteristics[index].some(
            (char) => char.name === charName
          );
        });
      }
    );

    const result = commonCharNames.map((charName) => {
      const values = [];
      const isBestFlags = [];

      productsInfo.forEach((_, index) => {
        const char = allCharacteristics[index].find((c) => c.name === charName);
        if (char) {
          values.push(char.value);
          isBestFlags.push(char.isBest);
        }
      });

      return {
        name: charName,
        values: values,
        isBestFlags: isBestFlags,
      };
    });

    return result;
  };

  const getPriceInfo = (product) => {
    const prices = [
      product.currentPrice || 0,
      product.cardPrice || 0,
      product.originalPrice || 0,
    ].filter((price) => price > 0);

    if (prices.length === 0) return { min: 0, max: 0 };

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const commonCharacteristics = getCommonCharacteristics();

  // Initialize ordered characteristics when common characteristics change
  useEffect(() => {
    if (
      commonCharacteristics.length > 0 &&
      orderedCharacteristics.length === 0
    ) {
      setOrderedCharacteristics(commonCharacteristics);
      // Select all characteristics by default
      setSelectedCharacteristics(
        commonCharacteristics.map((char) => char.name)
      );
    }
  }, [commonCharacteristics, orderedCharacteristics.length]);

  if (!productsInfo || productsInfo.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Нет данных для отображения</h2>
        <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
      </div>
    );
  }

  const firstColumnWidth = "30%";
  const productColumnWidth = `${70 / productsInfo.length}%`;

  // Use ordered characteristics for display
  const displayCharacteristics =
    orderedCharacteristics.length > 0
      ? orderedCharacteristics
      : commonCharacteristics;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Сравнение товаров
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        💡 Перетаскивайте строки общих характеристик для изменения порядка
      </Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 700,
            tableLayout: "fixed",
            width: "100%",
          }}
          aria-label="comparison table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: firstColumnWidth }}>
                Характеристика
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell
                  key={index}
                  align="center"
                  sx={{ width: productColumnWidth }}
                >
                  {product.productName || `Товар ${index + 1}`}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Основная информация о товарах */}

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
                        maxWidth: "200px",
                        maxHeight: "200px",
                        margin: "5px",
                      }}
                    />
                  ) : (
                    "—"
                  )}
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
                          style={{
                            textDecoration: "line-through",
                            margin: "2px",
                          }}
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
                      "—"
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
                  {product.averageRating
                    ? (() => {
                        const [low, high] = ratingConfidenceInterval(
                          product.averageRating,
                          product.reviewsCount
                        );
                        const reliability = getStatusRank(low, high);

                        const chipColor =
                          reliability === "высокая"
                            ? "success"
                            : reliability === "средняя"
                            ? "warning"
                            : "error";

                        return (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Rating
                              name="half-rating-read"
                              value={product.averageRating}
                              precision={0.01}
                              readOnly
                            />
                            <Chip
                              label={`Надежность: ${reliability}`}
                              color={chipColor}
                              size="small"
                              variant="outlined"
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {product.averageRating.toFixed(1)} (
                              {product.reviewsCount})
                            </Typography>
                          </Box>
                        );
                      })()
                    : "—"}
                </StyledTableCell>
              ))}
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Наличие</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.isAvailable ? (
                    <Chip label="В наличии" color="success" size="small" />
                  ) : (
                    <Chip label="Нет в наличии" color="error" size="small" />
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell
                component="th"
                scope="row"
                colSpan={productsInfo.length + 1}
                sx={{
                  backgroundColor: "grey.200",
                  fontWeight: "bold",
                  fontSize: "1.1em",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedCharacteristics.length > 0 &&
                      selectedCharacteristics.length <
                        displayCharacteristics.length
                    }
                    checked={
                      displayCharacteristics.length > 0 &&
                      selectedCharacteristics.length ===
                        displayCharacteristics.length
                    }
                    onChange={handleSelectAllClick}
                  />
                  <IconButton
                    aria-label="expand characteristics"
                    size="small"
                    onClick={() =>
                      setCharacteristicsExpanded(!characteristicsExpanded)
                    }
                    sx={{ mr: 1 }}
                  >
                    {characteristicsExpanded ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  Общие характеристики
                </Box>
              </StyledTableCell>
            </StyledTableRow>

            {/* ОБЩИЕ ХАРАКТЕРИСТИКИ С DRAG-AND-DROP */}
            {displayCharacteristics.map((characteristic, rowIndex) => {
              const isItemSelected = isSelected(characteristic.name);
              const labelId = `enhanced-table-checkbox-${rowIndex}`;

              return (
                <DraggableTableRow
                  key={characteristic.name}
                  isdragging={(draggedRow === rowIndex).toString()}
                  draggable
                  onDragStart={(e) => handleDragStart(e, rowIndex)}
                  onDragOver={(e) => handleDragOver(e, rowIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, rowIndex)}
                  onDragEnd={handleDragEnd}
                  style={{
                    maxHeight: characteristicsExpanded ? "1000px" : "0",
                    opacity: characteristicsExpanded ? 1 : 0,
                    overflow: "hidden",
                    transition: "all 0.3s ease-in-out",
                    display: characteristicsExpanded ? "table-row" : "none",
                  }}
                >
                  <StyledTableCell
                    component="th"
                    scope="row"
                    sx={{
                      width: firstColumnWidth,
                      position: "relative",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                        onClick={(event) =>
                          handleClick(event, characteristic.name)
                        }
                      />
                      <DragIndicatorIcon
                        sx={{
                          cursor: "grab",
                          color: "action.active",
                          "&:hover": { color: "primary.main" },
                          mr: 1,
                        }}
                      />
                      {characteristic.name}
                    </Box>
                  </StyledTableCell>
                  {characteristic.values.map((value, index) => (
                    <StyledTableCell
                      key={index}
                      align="center"
                      sx={{
                        width: productColumnWidth,
                        color: characteristic.isBestFlags[index]
                          ? "success.light"
                          : "inherit",
                        textShadow: characteristic.isBestFlags[index]
                          ? "0px 2px 3px rgba(76, 175, 80, 1);"
                          : "",
                        fontWeight: characteristic.isBestFlags[index]
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {value}
                    </StyledTableCell>
                  ))}
                </DraggableTableRow>
              );
            })}

            {displayCharacteristics.length === 0 && (
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  <strong>Общие характеристики</strong>
                </StyledTableCell>
                {productsInfo.map((product, index) => (
                  <StyledTableCell key={index} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Нет общих характеристик для сравнения
                    </Typography>
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            )}

            {/* Дополнительная информация */}
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Артикул (SKU)</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.article || "—"}
                </StyledTableCell>
              ))}
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Бренд</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.brand || "—"}
                </StyledTableCell>
              ))}
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <strong>Продавец</strong>
              </StyledTableCell>
              {productsInfo.map((product, index) => (
                <StyledTableCell key={index} align="center">
                  {product.sellerName || "—"}
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
                      style={{ fontSize: "0.8em" }}
                    >
                      Перейти к товару
                    </a>
                  ) : (
                    "—"
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
