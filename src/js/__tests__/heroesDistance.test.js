import heroesDistanceStep from "../HeroesDistance";


// eslint-disable-next-line no-undef
test.each([
    ['bowman', 3, 19, 8, 'step', true],
    ['bowman', 3, 19, 8, 'attack', true],
    ['swordsman', 29, 27, 8, 'step', true],
    ['swordsman', 29, 27, 8, 'attack', false],
    ['magician', 28, 35, 8, 'step', true],
    ['magician', 28, 35, 8, 'attack', true],
    ['vampire', 35, 44, 8, 'step', true],
    ['vampire', 12, 27, 8, 'attack', true],
    ['undead', 10, 3, 8, 'attack', true],
    ['daemon', 44, 27, 8, 'attack', true],
    ['swordsman', 29, 27, 8, 'dsdsd', false],
    ['dsdsdsdssddddsds', 29, 27, 8, 'step', false],
    ['dsdsdsdssddddsds', 29, 27, 8, 'attack', false],
])('returns the expected result for arguments: (%s, %i, %i, %i, %s)', (playerType, currentPos, targetPos, fieldSize, actionType, expectedResult) => {
    const res = heroesDistanceStep(playerType, currentPos, targetPos, fieldSize, actionType);
    expect(res).toBe(expectedResult);
});