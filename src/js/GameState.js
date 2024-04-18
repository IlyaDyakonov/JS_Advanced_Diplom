import PositionedCharacter from "./PositionedCharacter.js";


export default class GameState {
  static from(object) {
    const game = {
      isPlayer: object.isPlayer,
      theme: object.theme,
      level: object.level,
      chars: object.chars,
      maxScore: object.maxScore,
    };
    return game;
  }
}
