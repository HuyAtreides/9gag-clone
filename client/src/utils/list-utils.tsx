export function merge2SortedList<ElementType>(
  currentList: ElementType[],
  latestList: ElementType[],
  comparator: (a: ElementType, b: ElementType) => number,
) {
  const result: ElementType[] = [];
  const length1 = currentList.length;
  const length2 = latestList.length;
  let index1 = 0;
  let index2 = 0;

  while (index1 < length1 && index2 < length2) {
    const element1 = currentList[index1];
    const element2 = latestList[index2];
    const compareResult = comparator(element1, element2);

    if (compareResult > 0) {
      result.push(element1);
      index1++;
    } else if (compareResult === 0) {
      result.push(element2);
      index1++;
      index2++;
    } else {
      result.push(element2);
      index2++;
    }
  }

  while (index1 < length1) {
    result.push(currentList[index1++]);
  }

  while (index2 < length2) {
    result.push(latestList[index2++]);
  }

  return result;
}
