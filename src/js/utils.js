/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // const row = Math.floor(index / boardSize); // строка
  // const col = index % boardSize;  // столбец

  if (index === 0) return "top-left";
  if (index === 7) return "top-right";
  if (index === 56) return "bottom-left";
  if (index === 63) return "bottom-right";
  if (index > 0 && index < 7) return "top";
  if (index > 56 && index < 63) return "bottom";
  for (let i = 8; i < 49; i += 8) {
    if (i === index) {
      return "left";
    }
  }
  for (let i = 15; i < 56; i += 8) {
    if (i === index) {
      return "right";
    }
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
