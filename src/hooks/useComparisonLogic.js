import { getCostWeight } from "../Utils/tableLogic";

export function useComparisonLogic(
  orderedCharacteristics,
  setOrderedCharacteristics,
  selectedCharacteristics,
  setSelectedCharacteristics
) {
  const updateCharacteristicsOrder = (newSelected) => {
    const selectedChars = orderedCharacteristics.filter((char) =>
      newSelected.includes(char.name)
    );
    const unselectedChars = orderedCharacteristics.filter(
      (char) => !newSelected.includes(char.name)
    );

    const orderedSelectedChars = newSelected
      .map((name) => selectedChars.find((char) => char.name === name))
      .filter(Boolean);

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
          : 1,
    }));

    setOrderedCharacteristics(updatedOrder);
  };

  const handleToggleBestFlag = (characteristicName, productIndex) => {
    setOrderedCharacteristics((prev) => {
      const updated = prev.map((char) =>
        char.name === characteristicName
          ? {
              ...char,
              isBestFlags: char.isBestFlags.map((flag, index) =>
                index === productIndex ? !flag : flag
              ),
            }
          : char
      );

      const sorted = [...updated].sort((a, b) => {
        const aHasBest = a.isBestFlags.some((x) => x);
        const bHasBest = b.isBestFlags.some((x) => x);

        if (aHasBest && !bHasBest) return -1;
        if (!aHasBest && bHasBest) return 1;

        const aIndex = prev.findIndex((x) => x.name === a.name);
        const bIndex = prev.findIndex((x) => x.name === b.name);
        return aIndex - bIndex;
      });

      const sortedWithWeights = sorted.map((char, index) => ({
        ...char,
        costWeight: getCostWeight(
          char.name,
          sorted.length,
          index,
          selectedCharacteristics,
          char.manualWeight
        ),
      }));

      return sortedWithWeights;
    });
  };

  const handleToggleSelect = (event, name) => {
    const selectedIndex = selectedCharacteristics.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedCharacteristics, name];
    } else {
      newSelected = selectedCharacteristics.filter((item) => item !== name);
    }

    setSelectedCharacteristics(newSelected);
    updateCharacteristicsOrder(newSelected);
  };

  const handleWeightChange = (event, characteristicName) => {
    const charIndex = orderedCharacteristics.findIndex(
      (char) => char.name === characteristicName
    );
    if (charIndex === -1) return;

    let newValue = parseFloat(event.target.value);
    if (isNaN(newValue)) newValue = 0;

    if (newValue > 1) newValue = 1;
    if (newValue < 0) newValue = 0;

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

  return {
    handleToggleBestFlag,
    handleToggleSelect,
    handleWeightChange,
    updateCharacteristicsOrder,
    isSelected: (name) => selectedCharacteristics.indexOf(name) !== -1,
  };
}
