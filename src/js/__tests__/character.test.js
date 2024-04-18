import Character from "../Character";
import Bowman from "../characters/bowman";
import Swordsman from "../characters/swordsman";
import Magician from "../characters/magician";
import Daemon from "../characters/daemon";
import Undead from "../characters/undead";
import Vampire from "../characters/vampire";


test("создание классов персонажей", () => {
    const resultBowman = {
        level: 1,
        attack: 25,
        defence: 25,
        health: 50,
        type: 'bowman',
    };

    const resultSwordsman = {
        level: 1,
        attack: 40,
        defence: 10,
        health: 50,
        type: 'swordsman',
    };

    const resultMagician = {
        level: 1,
        attack: 10,
        defence: 40,
        health: 50,
        type: 'magician',
    };

    const resultDeamon = {
        level: 1,
        attack: 10,
        defence: 10,
        health: 50,
        type: 'daemon',
    };

    const resultUndead = {
        level: 1,
        attack: 40,
        defence: 10,
        health: 50,
        type: 'undead',
    };

    const resultVampire = {
        level: 1,
        attack: 25,
        defence: 25,
        health: 50,
        type: 'vampire',
    };

    expect(new Bowman(1)).toEqual(resultBowman);
    expect(new Swordsman(1)).toEqual(resultSwordsman);
    expect(new Magician(1)).toEqual(resultMagician);
    expect(new Daemon(1)).toEqual(resultDeamon);
    expect(new Undead(1)).toEqual(resultUndead);
    expect(new Vampire(1)).toEqual(resultVampire);
});

test("Ошибка создания класса через Character", () => {
    expect(() => {
        new Character(1);}).toThrow("Нельзя создать данный класс персонажей!");
});