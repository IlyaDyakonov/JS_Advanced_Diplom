import Team from './Team.js';


/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomType = Math.floor(Math.random() * allowedTypes.length);
    const randomLVL = Math.ceil(Math.random() * maxLevel);
    const char = new allowedTypes[randomType]();
    char.level = randomLVL;
    yield char;
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const generTeam = characterGenerator(allowedTypes, maxLevel);
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    const generChar = generTeam.next().value;
    team.push(generChar);
  }
  return new Team(team);
}
