import GameController from '../GameController.js';
import GamePlay from '../GamePlay.js';
import Vampire from '../characters/vampire.js';
import Swordsman from '../characters/swordsman.js';


test('Создание всплывающего сообщения с характеристиками', () => {
    const gamePlay = new GamePlay();
    const gameContr = new GameController(gamePlay);
    const vampir = new Vampire(1);
    const swordsman = new Swordsman(1);
    const res1 = gameContr.displayingCharacteristics(vampir);
    const res2 = gameContr.displayingCharacteristics(swordsman);

    const expectedVampir = '\u{1F396} 1 \u{2694} 25 \u{1F6E1} 25 \u{2764} 50';
    const expectedSwordsman = '\u{1F396} 1 \u{2694} 40 \u{1F6E1} 10 \u{2764} 50';

    expect(res1).toEqual(expectedVampir);
    expect(res2).toEqual(expectedSwordsman);
});