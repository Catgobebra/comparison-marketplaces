/* global chrome */
import React from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { changeProducts } from "../../redux-state/reducers/products";

import TableHeader from "../comps/TableHeader";
import ImagesRow from "../comps/ImagesRow";
import PriceRow from "../comps/PriceRow";
import RatingRow from "../comps/RatingRow";
import AvailabilityRow from "../comps/AvailabilityRow";
import CharacteristicsHeader from "../comps/CharacteristicsHeader";
import CharacteristicRow from "../comps/CharacteristicRow";
import AdditionalInfoRows from "../comps/AdditionalInfoRows";

import { getCostWeight } from "../../utils/tableLogic";
import { StyledTableRow, StyledTableCell } from "../comps/styledComponents";

export default function ProductTable() {
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
  const [rankItems, setRankItems] = React.useState([]);

  React.useEffect(() => {
    chrome.storage.local.get(["myStoredArray"]).then((result) => {
      if (result.myStoredArray && result.myStoredArray.length > 0)
        dispatch(changeProducts(result.myStoredArray));
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (!orderedCharacteristics || !productsInfo || productsInfo.length === 0)
      return;
    const rank = new Array(productsInfo.length).fill(0);
    orderedCharacteristics.forEach((characteristic) => {
      if (
        characteristic &&
        characteristic.isBestFlags &&
        characteristic.costWeight
      ) {
        characteristic.isBestFlags.forEach((isBest, productIndex) => {
          if (isBest && productIndex < rank.length)
            rank[productIndex] += characteristic.costWeight;
        });
      }
    });
    setRankItems(rank);
  }, [orderedCharacteristics, productsInfo]);

  const getProductCharacteristics = (product) => {
    if (!product.characteristics) return [];
    const characteristics = [];
    product.characteristics.forEach((group) => {
      group.characteristics?.forEach((char) => {
        if (
          ["Артикул", "Бренд", "Продавец", "Ссылка на товар"].includes(
            char.name
          ) ||
          !char.value ||
          char.value === "—"
        )
          return;
        characteristics.push({
          name: char.name,
          value: char.value,
          isBest: char.isBest || false,
        });
      });
    });
    return characteristics;
  };

  const getCommonCharacteristics = React.useCallback(() => {
    if (!productsInfo || productsInfo.length === 0) return [];
    const allCharacteristics = [];
    const characteristicNames = new Set();
    productsInfo.forEach((product, index) => {
      const productChars = getProductCharacteristics(product);
      allCharacteristics[index] = productChars;
      productChars.forEach((char) => characteristicNames.add(char.name));
    });
    const commonCharNames = Array.from(characteristicNames).filter((charName) =>
      productsInfo.every((_, index) =>
        allCharacteristics[index].some((char) => char.name === charName)
      )
    );
    return commonCharNames.map((charName, index_) => {
      const values = [];
      const isBestFlags = [];
      productsInfo.forEach((_, index) => {
        const char = allCharacteristics[index].find((c) => c.name === charName);
        if (char) {
          values.push(char.value);
          isBestFlags.push(char.isBest);
        }
      });
      const isCompare = isBestFlags.some((x) => x);
      return {
        name: charName,
        values,
        isBestFlags,
        manualWeight: 1,
        costWeight: isCompare
          ? getCostWeight(
              charName,
              commonCharNames.length,
              index_,
              selectedCharacteristics
            )
          : 0,
      };
    });
  }, [productsInfo, selectedCharacteristics]);

  const commonCharacteristics = getCommonCharacteristics();

  React.useEffect(() => {
    if (
      commonCharacteristics.length > 0 &&
      orderedCharacteristics.length === 0
    ) {
      const characteristicsWithWeights = commonCharacteristics.map(
        (char, index) => ({
          ...char,
          costWeight:
            char.costWeight > 0
              ? getCostWeight(
                  char.name,
                  commonCharacteristics.length,
                  index,
                  selectedCharacteristics,
                  char.manualWeight
                )
              : 0,
        })
      );
      setOrderedCharacteristics(characteristicsWithWeights);
      setSelectedCharacteristics(
        commonCharacteristics.map((char) => char.name)
      );
    }
  }, [
    commonCharacteristics,
    orderedCharacteristics.length,
    selectedCharacteristics,
  ]);

  if (!productsInfo || productsInfo.length === 0)
    return (
      <div style={{ padding: 20 }}>
        <h2>Нет данных для отображения</h2>
        <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
      </div>
    );

  const firstColumnWidth = "30%";
  const productColumnWidth = `${70 / productsInfo.length}%`;
  const displayCharacteristics =
    orderedCharacteristics.length > 0
      ? orderedCharacteristics
      : commonCharacteristics;

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
  const handleDragLeave = () => setDragOverRow(null);
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedRow === null || draggedRow === targetIndex) return;
    const newOrder = [...orderedCharacteristics];
    const [movedCharacteristic] = newOrder.splice(draggedRow, 1);
    newOrder.splice(targetIndex, 0, movedCharacteristic);
    const updatedOrder = newOrder.map((char, index) => ({
      ...char,
      costWeight:
        char.costWeight > 0
          ? getCostWeight(
              char.name,
              newOrder.length,
              index,
              selectedCharacteristics,
              char.manualWeight
            )
          : 0,
    }));
    setOrderedCharacteristics(updatedOrder);
    setDraggedRow(null);
    setDragOverRow(null);
  };
  const handleDragEnd = () => {
    setDraggedRow(null);
    setDragOverRow(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = displayCharacteristics.map((n) => n.name);
      setSelectedCharacteristics(newSelecteds);
      const updatedCharacteristics = orderedCharacteristics.map(
        (char, index) => ({
          ...char,
          costWeight:
            char.costWeight > 0
              ? getCostWeight(
                  char.name,
                  orderedCharacteristics.length,
                  index,
                  newSelecteds,
                  char.manualWeight
                )
              : 0,
        })
      );
      setOrderedCharacteristics(updatedCharacteristics);
      return;
    }
    setSelectedCharacteristics([]);
    const updatedCharacteristics = orderedCharacteristics.map(
      (char, index) => ({
        ...char,
        costWeight:
          char.costWeight > 0
            ? getCostWeight(
                char.name,
                orderedCharacteristics.length,
                index,
                [],
                char.manualWeight
              )
            : 0,
      })
    );
    setOrderedCharacteristics(updatedCharacteristics);
  };

  const handleToggleSelect = (event, name) => {
    const selectedIndex = selectedCharacteristics.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1)
      newSelected = newSelected.concat(selectedCharacteristics, name);
    else if (selectedIndex === 0)
      newSelected = newSelected.concat(selectedCharacteristics.slice(1));
    else if (selectedIndex === selectedCharacteristics.length - 1)
      newSelected = newSelected.concat(selectedCharacteristics.slice(0, -1));
    else if (selectedIndex > 0)
      newSelected = newSelected.concat(
        selectedCharacteristics.slice(0, selectedIndex),
        selectedCharacteristics.slice(selectedIndex + 1)
      );
    setSelectedCharacteristics(newSelected);
    const updatedCharacteristics = orderedCharacteristics.map(
      (char, index) => ({
        ...char,
        costWeight:
          char.costWeight > 0
            ? getCostWeight(
                char.name,
                orderedCharacteristics.length,
                index,
                newSelected,
                char.manualWeight
              )
            : 0,
      })
    );
    setOrderedCharacteristics(updatedCharacteristics);
  };

  const isSelected = (name) => selectedCharacteristics.indexOf(name) !== -1;

  const handleWeightChange = (event, rowIndex) => {
    const newValue = parseFloat(event.target.value) || 1;
    const updatedCharacteristics = [...orderedCharacteristics];
    const currentCharacteristic = updatedCharacteristics[rowIndex];
    updatedCharacteristics[rowIndex] = {
      ...currentCharacteristic,
      costWeight: getCostWeight(
        currentCharacteristic.name,
        updatedCharacteristics.length,
        rowIndex,
        selectedCharacteristics,
        newValue
      ),
      manualWeight: newValue,
    };
    setOrderedCharacteristics(updatedCharacteristics);
  };
  console.log(orderedCharacteristics);
  console.log(rankItems);
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
          sx={{ minWidth: 700, tableLayout: "fixed", width: "100%" }}
          aria-label="comparison table"
        >
          <TableHeader
            firstColumnWidth={firstColumnWidth}
            productColumnWidth={productColumnWidth}
            productsInfo={productsInfo}
          />
          <tbody>
            <ImagesRow productsInfo={productsInfo} />
            <PriceRow productsInfo={productsInfo} />
            <RatingRow productsInfo={productsInfo} />
            <AvailabilityRow productsInfo={productsInfo} />

            <CharacteristicsHeader
              displayCharacteristics={displayCharacteristics}
              selectedCharacteristics={selectedCharacteristics}
              onSelectAll={handleSelectAllClick}
              characteristicsExpanded={characteristicsExpanded}
              toggleExpanded={() =>
                setCharacteristicsExpanded(!characteristicsExpanded)
              }
            />

            {displayCharacteristics.map((characteristic, rowIndex) => (
              <CharacteristicRow
                key={characteristic.name}
                characteristic={characteristic}
                rowIndex={rowIndex}
                firstColumnWidth={firstColumnWidth}
                productColumnWidth={productColumnWidth}
                draggedRow={draggedRow}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isSelected={isSelected(characteristic.name)}
                onToggleSelect={handleToggleSelect}
                onWeightChange={handleWeightChange}
                characteristicsExpanded={characteristicsExpanded}
              />
            ))}

            {displayCharacteristics.length === 0 && (
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  <strong>Общие характеристики</strong>
                </StyledTableCell>
                {productsInfo.map((product, index) => (
                  <StyledTableCell key={index} align="center">
                    <em style={{ color: "#6b7280" }}>
                      Нет общих характеристик для сравнения
                    </em>
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            )}

            <AdditionalInfoRows productsInfo={productsInfo} />
          </tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
