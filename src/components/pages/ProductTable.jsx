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

  const [characteristicsExpanded, setCharacteristicsExpanded] = React.useState(true);
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [dragOverItem, setDragOverItem] = React.useState(null);
  const [orderedCharacteristics, setOrderedCharacteristics] = React.useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = React.useState([]);
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
      if (characteristic && characteristic.isBestFlags && characteristic.costWeight) {
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
    Object.values(product.characteristics).forEach((char) => {
      if (
        ["Артикул", "Бренд", "Продавец", "Ссылка на товар"].includes(char.name) ||
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
    if (commonCharacteristics.length > 0 && orderedCharacteristics.length === 0) {
      const characteristicsWithWeights = commonCharacteristics.map((char, index) => ({
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
      }));
      setOrderedCharacteristics(characteristicsWithWeights);
    }
  }, [commonCharacteristics, orderedCharacteristics.length, selectedCharacteristics]);

  const updateCharacteristicsOrder = (newSelected) => {
    const selectedChars = orderedCharacteristics.filter(char => 
      newSelected.includes(char.name)
    );
    const unselectedChars = orderedCharacteristics.filter(char => 
      !newSelected.includes(char.name)
    );
    
    const orderedSelectedChars = newSelected.map(name => 
      selectedChars.find(char => char.name === name)
    ).filter(Boolean);
    
    const newOrdered = [...orderedSelectedChars, ...unselectedChars];
    
    const updatedOrder = newOrdered.map((char, index) => ({
      ...char,
      costWeight:
        char.costWeight > 0
          ? getCostWeight(
              char.name,
              newOrdered.length,
              index,
              newSelected,
              char.manualWeight
            )
          : 0,
    }));
    
    setOrderedCharacteristics(updatedOrder);
  };

  if (!productsInfo || productsInfo.length === 0)
    return (
      <div style={{ padding: 20 }}>
        <h2>Нет данных для отображения</h2>
        <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
      </div>
    );

  const firstColumnWidth = "30%";
  const productColumnWidth = `${70 / productsInfo.length}%`;
  
  const displayedCharacteristics = [
    ...orderedCharacteristics.filter(item => item.isBestFlags.some(x => x)),
    ...orderedCharacteristics.filter(item => !item.isBestFlags.some(x => x))
  ];

  const handleDragStart = (characteristicName) => {
    setDraggedItem(characteristicName);
  };

  const handleDragOver = (e, characteristicName) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== characteristicName) {
      setDragOverItem(characteristicName);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (targetCharacteristicName) => {
    if (!draggedItem || draggedItem === targetCharacteristicName) {
      return;
    }

    const newOrder = [...orderedCharacteristics];
    const draggedIndex = newOrder.findIndex(char => char.name === draggedItem);
    const targetIndex = newOrder.findIndex(char => char.name === targetCharacteristicName);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [movedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);

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
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleToggleSelect = (event, name) => {
    const selectedIndex = selectedCharacteristics.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedCharacteristics, name];
    } else {
      newSelected = selectedCharacteristics.filter(item => item !== name);
    }
    
    setSelectedCharacteristics(newSelected);
    updateCharacteristicsOrder(newSelected);
  };

  const isSelected = (name) => selectedCharacteristics.indexOf(name) !== -1;

  const handleWeightChange = (event, characteristicName) => {
    const charIndex = orderedCharacteristics.findIndex(char => char.name === characteristicName);
    if (charIndex === -1) return;
    
    const newValue = parseFloat(event.target.value) || 1;
    const updatedCharacteristics = [...orderedCharacteristics];
    
    updatedCharacteristics[charIndex] = {
      ...updatedCharacteristics[charIndex],
      costWeight: getCostWeight(
        updatedCharacteristics[charIndex].name,
        updatedCharacteristics.length,
        charIndex,
        selectedCharacteristics,
        newValue
      ),
      manualWeight: newValue,
    };
    
    setOrderedCharacteristics(updatedCharacteristics);
  };

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
              characteristicsExpanded={characteristicsExpanded}
              toggleExpanded={() => setCharacteristicsExpanded(!characteristicsExpanded)}
            />

            {displayedCharacteristics.map((characteristic) => (
              <CharacteristicRow
                key={characteristic.name}
                characteristic={characteristic}
                firstColumnWidth={firstColumnWidth}
                productColumnWidth={productColumnWidth}
                isDragged={draggedItem === characteristic.name}
                isDragOver={dragOverItem === characteristic.name}
                onDragStart={() => handleDragStart(characteristic.name)}
                onDragOver={(e) => handleDragOver(e, characteristic.name)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(characteristic.name)}
                onDragEnd={handleDragEnd}
                isSelected={isSelected(characteristic.name)}
                onToggleSelect={handleToggleSelect}
                onWeightChange={handleWeightChange}
                characteristicsExpanded={characteristicsExpanded}
              />
            ))}

            {displayedCharacteristics.length === 0 && (
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

            <AdditionalInfoRows productsInfo={productsInfo} rankItems={rankItems} />
          </tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}