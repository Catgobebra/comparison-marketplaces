import { useState, useCallback, useEffect, useRef } from "react";
import { getCostWeight } from "../Utils/tableLogic";

export function useCharacteristics(sProductsInfo) {
  const [characteristicsExpanded, setCharacteristicsExpanded] = useState(true);
  const [orderedCharacteristics, setOrderedCharacteristics] = useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);
  const [rankItems, setRankItems] = useState([]);
  const isInitialMount = useRef(true);

  const getProductCharacteristics = (product) => {
    if (!product.characteristics) return [];
    const characteristics = [];
    Object.values(product.characteristics).forEach((char) => {
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
    return characteristics;
  };

  const getCommonCharacteristics = useCallback(() => {
    if (!sProductsInfo || sProductsInfo.length === 0) return [];
    const allCharacteristics = [];
    const characteristicNames = new Set();
    sProductsInfo.forEach((product, index) => {
      const productChars = getProductCharacteristics(product);
      allCharacteristics[index] = productChars;
      productChars.forEach((char) => characteristicNames.add(char.name));
    });
    const commonCharNames = Array.from(characteristicNames).filter((charName) =>
      sProductsInfo.every((_, index) =>
        allCharacteristics[index].some((char) => char.name === charName)
      )
    );
    return commonCharNames.map((charName, index_) => {
      const values = [];
      const isBestFlags = [];
      sProductsInfo.forEach((_, index) => {
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
          : 1,
      };
    });
  }, [sProductsInfo, selectedCharacteristics]);

  const commonCharacteristics = getCommonCharacteristics();

  useEffect(() => {
    if (commonCharacteristics.length > 0) {
      if (isInitialMount.current || orderedCharacteristics.length === 0) {
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
        setOrderedCharacteristics([
          ...characteristicsWithWeights.filter((item) =>
            item.isBestFlags.some((x) => x)
          ),
          ...characteristicsWithWeights.filter(
            (item) => !item.isBestFlags.some((x) => x)
          ),
        ]);
        isInitialMount.current = false;
      }
    }
  }, [commonCharacteristics, selectedCharacteristics]);

  const findCharacteristic = useCallback(
    (id) => {
      const characteristic = orderedCharacteristics.find((c) => c.name === id);
      return {
        characteristic,
        index: orderedCharacteristics.indexOf(characteristic),
      };
    },
    [orderedCharacteristics]
  );

  const moveCharacteristic = useCallback(
    (id, atIndex) => {
      const { characteristic, index } = findCharacteristic(id);
      if (!characteristic) return;

      const newOrderedCharacteristics = [...orderedCharacteristics];
      newOrderedCharacteristics.splice(index, 1);
      newOrderedCharacteristics.splice(atIndex, 0, characteristic);

      const updatedCharacteristics = newOrderedCharacteristics.map(
        (char, idx) => ({
          ...char,
          costWeight:
            char.costWeight > 0
              ? getCostWeight(
                  char.name,
                  newOrderedCharacteristics.length,
                  idx,
                  selectedCharacteristics,
                  char.manualWeight
                )
              : 0,
        })
      );

      setOrderedCharacteristics(updatedCharacteristics);
    },
    [findCharacteristic, orderedCharacteristics, selectedCharacteristics]
  );

  useEffect(() => {
    if (!orderedCharacteristics || !sProductsInfo || sProductsInfo.length === 0)
      return;

    const rank = new Array(sProductsInfo.length).fill(0);

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

    const total = rank.reduce((sum, value) => sum + value, 0);

    let normalizedRank;
    if (total > 0) {
      normalizedRank = rank.map((value) => Math.round((value / total) * 100));
    } else {
      normalizedRank = rank.map(() => 100 / rank.length);
    }

    setRankItems(normalizedRank);
  }, [orderedCharacteristics, sProductsInfo]);

  const resetCharacteristics = () => {
    setOrderedCharacteristics([]);
    setSelectedCharacteristics([]);
    setRankItems([]);
    isInitialMount.current = true;
  };

  return {
    characteristicsExpanded,
    setCharacteristicsExpanded,
    orderedCharacteristics,
    selectedCharacteristics,
    rankItems,
    getProductCharacteristics,
    getCommonCharacteristics,
    findCharacteristic,
    moveCharacteristic,
    setOrderedCharacteristics,
    setSelectedCharacteristics,
    resetCharacteristics,
  };
}
