import { characterGenerator, generateTeam } from '../generators';
import Bowman from '../characters/bowman';
import Swordsman from '../characters/swordsman';
import Magician from '../characters/magician';
import Team from '../Team';

test('проверка characterGenerator', () => {
    const characterCount = 100;
    const generatorsTeam = characterGenerator([Bowman, Swordsman, Magician], 3);
    const team = [];
    for (let i = 0; i < characterCount; i += 1) {
        const generatorsChar = generatorsTeam.next().value;
        team.push(generatorsChar);
    }
    const resTeam = new Team(team);
    expect(resTeam.characters.length).toEqual(100);
});

test('проверка generateTeam', () => {
    const res = generateTeam([Bowman, Swordsman, Magician], 3, 50);
    const levelsInRange = res.characters.every(
        (character) => character.level >= 1 && character.level <= 3,
    );
    expect(res.characters.length).toBe(50);
    expect(levelsInRange).toBe(true);
});