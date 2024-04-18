/**
* @param playerType Тип персонажа (например, 'swordsman', 'bowman', 'magician').
* @param currentPos Текущая позиция персонажа на игровом поле (в виде одномерного индекса).
* @param targetPos Целевая позиция на игровом поле (в виде одномерного индекса).
* @param fieldSize Размер игрового поля (количество ячеек в строке или столбце).
* @param actionType Тип действия ("step" - перемещение, "attack" - атака).
*/
export default function heroesDistanceStep(playerType, currentPos, targetPos, fieldSize, actionType) {
    const rowDiff = Math.abs(Math.floor(currentPos / fieldSize) - Math.floor(targetPos / fieldSize));
    const colDiff = Math.abs((currentPos % fieldSize) - (targetPos % fieldSize));

    if (actionType === 'step') {
        let maxMovDist;
        switch (playerType) {
            case 'swordsman':
            case 'undead':
                maxMovDist = 4;
                break;
            case 'bowman':
            case 'vampire':
                maxMovDist = 2;
                break;
            case 'magician':
            case 'daemon':
                maxMovDist = 1;
                break;
            default:
                console.log('Выбран неверный тип игрока');
                return false;
        }
        return rowDiff <= maxMovDist && colDiff <= maxMovDist && (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff);
    } if (actionType === 'attack') {
        let maxAttackRadius;
        switch (playerType) {
            case 'swordsman':
            case 'undead':
                maxAttackRadius = 1; //1
                break;
            case 'bowman':
            case 'vampire':
                maxAttackRadius = 2; // 2
                break;
            case 'magician':
            case 'daemon':
                maxAttackRadius = 4; // 4
                break;
            default:
                console.log('Выбран неверный тип противника');
                return false;
        }

        // Проверка на радиус атаки в квадратном поле
        return rowDiff <= maxAttackRadius && colDiff <= maxAttackRadius;
    }
    return false;
}

