import GamePlay from "./GamePlay";
import themes from "./themes";
import { generateTeam } from "./generators.js";
import PositionedCharacter from "./PositionedCharacter.js";
import Bowman from "./characters/bowman.js";
import Swordsman from "./characters/swordsman.js";
import Magician from "./characters/magician.js";
import Daemon from "./characters/daemon.js";
import Undead from "./characters/undead.js";
import Vampire from "./characters/vampire.js";
import GameState from './GameState.js';
import heroesDistanceStep from "./HeroesDistance.js";


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.fieldSize = this.gamePlay.boardSize;

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.newGame = this.newGame.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.loadGame = this.loadGame.bind(this);
    this.buttonsAndMethods();
  }

  buttonsAndMethods() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);

    this.gamePlay.addNewGameListener(this.newGame);
    this.gamePlay.addSaveGameListener(this.saveGame);
    this.gamePlay.addLoadGameListener(this.loadGame);
  }

  init() {
    this.theme = themes.prairie;
    this.level = 1;
    this.gamePlay.drawUi(this.theme);

    this.playerTeam = generateTeam(
      [Bowman, Swordsman, Magician],
      this.level,
      3,
    );
    this.playerPositions = this.generatePositions('playerTeam');
    this.positionedPlayerTeam = this.createPositionedTeam(
      this.playerTeam,
      this.playerPositions,
    );

    this.enemyTeam = generateTeam(
      [Vampire, Undead, Daemon],
      this.level,
      3);
    this.enemyPositions = this.generatePositions('enemyTeam');
    this.positionedEnemyTeam = this.createPositionedTeam(
      this.enemyTeam,
      this.enemyPositions,
    );

    this.allChars;
    // this.allChars = [...this.positionedPlayerTeam, ...this.positionedEnemyTeam];
    this.gamePlay.redrawPositions(this.allChars);
    // console.log(`герои ${this.allChars}`);
    // this.allChars.forEach((position, index) => {
    //   console.log(`Позиция ${index + 1}:`, position);
    // });
    this.state = {
      isPlayer: true,
      theme: this.theme,
      level: this.level,
      chars: this.allChars,
      maxScore: this.maxScore
    };
    // console.log(this.state);
    GameState.from(this.state);
    this.winGame = true;
    // console.log(GameState.from(this.state.maxScore));
  }

  get allChars () {
    return [...this.positionedPlayerTeam, ...this.positionedEnemyTeam];
  }

  // генерация появления персонажей на поле
  generatePositions(string) {
    const positions = [];
    for (let i = 0; i < this.fieldSize; i += 1) {
      for (let j = 0; j < this.fieldSize; j += 1) {
        if (string === 'playerTeam' && j < 2) {
          positions.push(i * this.fieldSize + j);
        }
        if (string === 'enemyTeam' && (j === this.fieldSize - 2 || j === this.fieldSize - 1)) {
          positions.push(i * this.fieldSize + j);
        }
      }
    }
    return positions;
  }

  // eslint-disable-next-line class-methods-use-this
  createPositionedTeam(team, positions) {
    const positionedTeam = [];
    team.characters.forEach((char) => {
      const randomIndex = Math.floor(Math.random() * positions.length);
      const position = parseInt(positions.splice(randomIndex, 1)[0]);
      const positionedCharacter = new PositionedCharacter(char, position);
      positionedTeam.push(positionedCharacter);
    });
    return positionedTeam;
  }

  newGame() {
    this.init();
    console.log("Началась новая игра!");
  }

  saveGame() {
    console.log("Игра сохранена!");
    this.gamePlay.redrawPositions(this.allChars); // Обновляем позиции героев перед сохранением
    const charactersData = this.allChars.map(char => ({
      character: char.character,
      position: char.position
    }));
    this.state = {
      isPlayer: true,
      theme: this.theme,
      level: this.level,
      chars: charactersData.map(data => new PositionedCharacter(data.character, data.position)),
      maxScore: this.maxScore
    };
    this.gameStateInstance = GameState.from(this.state);
    this.stateService.save(this.gameStateInstance);
    // console.log(this.stateService);
    // this.stateService.storage.state.chars.forEach(char => {
    //   console.log(char.character);
    // });
    // const t = {"isPlayer":true,
    // "theme":"prairie",
    // "level":1,
    // "chars":
    //   [{"character":{"level":1,"attack":25,"defence":25,"health":50,"type":"bowman"},"position":56},
    //   {"character":{"level":1,"attack":25,"defence":25,"health":50,"type":"bowman"},"position":25},
    //   {"character":{"level":1,"attack":25,"defence":25,"health":50,"type":"bowman"},"position":16},
    //   {"character":{"level":1,"attack":25,"defence":25,"health":50,"type":"vampire"},"position":47},
    //   {"character":{"level":1,"attack":10,"defence":10,"health":50,"type":"daemon"},"position":6},
    //   {"character":{"level":1,"attack":10,"defence":10,"health":50,"type":"daemon"},"position":39}]}
    //   console.log(t.chars[0].position);
  }

  loadGame() {
      const savedState = this.stateService.load();
      const positions = [];

      console.log("Игра загружена");
      // console.log(savedState.chars.length);
      for (let i = 0; i < savedState.chars.length; i++) {
        const data = savedState.chars[i];
        // console.log(`лвл 1 ${this.theme}`);
        let character;
        switch (data.character.type) {
          case 'bowman':
            character = new Bowman(data.character.level);
            break;
          case 'swordsman':
            character = new Swordsman(data.character.level);
            break;
          case 'magician':
            character = new Magician(data.character.level);
            break;
          case 'daemon':
            character = new Daemon(data.character.level);
            break;
          case 'vampire':
            character = new Vampire(data.character.level);
            break;
          case 'undead':
            character = new Undead(data.character.level);
            break;
          default:
            throw new Error(`Неизвестный тип персонажа: ${data.character.type}`);
        }
        character.health = data.character.health;
        character.attack = data.character.attack;
        character.defence = data.character.defence;
        character.level = data.character.level;
        // console.log(`характер ${character.level}`);
        positions.push(new PositionedCharacter(character, data.position));
      }
      const playerPosit = positions.filter(pos => pos.character instanceof Bowman || pos.character instanceof Swordsman || pos.character instanceof Magician);
      const enemyPosit = positions.filter(pos => pos.character instanceof Vampire || pos.character instanceof Undead || pos.character instanceof Daemon);

      this.positionedPlayerTeam = playerPosit;
      this.positionedEnemyTeam = enemyPosit;

      // this.allChars = positions;
      // positions.forEach((position, index) => {
      //   console.log(`Позиция ${index + 1}:`, position);
      // });
      // this.allChars.push(positions);
      // if (!this.levelLocation()) {
      //   return; // Прерываем выполнение метода levelUp()
      // }
      this.theme = savedState.theme;
      // console.log(`лвл 2 ${this.theme}`);
      this.gamePlay.drawUi(savedState.theme);
      // console.log(`ТЕМА ${savedState.theme}`);
      this.gamePlay.redrawPositions(positions);
  }

  displayingCharacteristics(char) {
    return `\u{1F396} ${char.level} \u{2694} ${char.attack} \u{1F6E1} ${char.defence} \u{2764} ${char.health}`
  }

  // проверка, выбраный персонаж является ли персонажем игрока
  checkPlayerType(char) {
    if (!char) {
      return console.log('Character is missing!');
    }

    const playerType = char.character.type;
    return (
      playerType === 'bowman' || playerType === 'swordsman' || playerType === 'magician'
    );
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const cellWithChar = this.gamePlay.cells[index].querySelector('.character');
    this.enteredCell = this.gamePlay.cells[index];
    // отображение инфы при наведении на любого героя
    if (cellWithChar) {
      this.enteredChar = this.allChars.find((char) => char.position === index);
      // this.allChars.forEach((position, index) => {
      //   console.log(`наведение ${index + 1}:`, position);
      // });
      // console.log(`наведение ${this.allChars}`);
      const message = this.displayingCharacteristics(this.enteredChar.character);

      this.gamePlay.showCellTooltip(message, index);
      this.gamePlay.setCursor('pointer');
    }

    // возврат вида курсора в дефолт
    // const selectedCell = this.gamePlay.cells[index].classList.contains('selected');
    const selectedCell = this.gamePlay.deselectCell(index);

    // установка зелёного кружка (ход выбранного персонажа)
    if (!selectedCell && !cellWithChar) {
      this.gamePlay.setCursor('default');
    }

    // установка зеленого маркера для хода и проверка что туда может походить персонаж
    if (this.clickedChar && !cellWithChar) {
      const stepType = this.clickedChar.character.type;
      if (heroesDistanceStep(
        stepType,
        this.clickedChar.position,
        index,
        this.fieldSize,
        "step",
      )
      ) {
        this.gamePlay.selectCell(index, "green")
        this.gamePlay.setCursor('pointer');
      } else {
        this.gamePlay.setCursor('not-allowed');
      }
    }

    // атака игрока
    if (this.clickedChar && cellWithChar) {
      const attackType = this.clickedChar.character.type;
      const isplayerType = this.checkPlayerType(this.enteredChar);
      if (isplayerType) return;

      if (heroesDistanceStep(
        attackType,
        this.clickedChar.position,
        index,
        this.fieldSize,
        "attack",
      )
      ) {
        this.gamePlay.selectCell(index, "red")
        this.gamePlay.setCursor('crosshair');
      } else {
        this.gamePlay.setCursor('not-allowed');
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);

    if (!this.gamePlay.cells[index].classList.contains('selected-yellow')) {
      this.gamePlay.deselectCell(index);
    }
  }

  onCellClick(index) {
    // TODO: react to click
    const cellWithChar = this.gamePlay.cells[index].querySelector('.character');
    this.clickedChar = this.allChars.find((char) => char.position === index);
    // console.log(this.clickedChar);
    // Перемещаем персонажа(если поле зелённое)
    if (this.enteredCell.classList.contains('selected-green')) {
      this.playerStep(index);
      return;
    }

    // атака персонажа
    if (this.enteredCell.classList.contains('selected-red')) {
      this.playerAttack(index);
      return;
    }

    const checkPlayerType = this.checkPlayerType(this.clickedChar);
    // console.log(`кликедчар: ${this.clickedChar}`)
    // устанавливаем или снимаем желтый круг выделения своего персонажа
    if (cellWithChar && checkPlayerType) {
      this.gamePlay.cells.forEach((cell, i) => this.gamePlay.deselectCell(i));
      this.gamePlay.selectCell(index);
      this.activeChar = this.clickedChar;
      this.activeIndex = index;
    } else {
      GamePlay.showMessage('Вы не выбрали персонажа или делаете недоступный Вам ход!');
      this.gamePlay.cells.forEach((cell, i) => this.gamePlay.deselectCell(i));
      this.clickedChar = null;
    }
  }

  levelLocation(){
    const levelModules = [
      { theme: themes.prairie, level: 1 },
      { theme: themes.desert, level: 2 },
      { theme: themes.arctic, level: 3 },
      { theme: themes.mountain, level: 4 },
      { theme: null, level: 5}
    ]

    const currentTheme = this.theme;
    const currentLevelInfo = levelModules.find(info => info.theme === currentTheme);
    if (!currentLevelInfo) {
      console.log('Текущая тема не найдена в массиве уровней или не определена.');
    } else {
      const currentLevel = currentLevelInfo.level;
      this.nextLevelInfo = levelModules.find(info => info.level === currentLevel + 1);
      // if (this.nextLevelInfo) {
      //   console.log(`цифра уровеня: ${this.nextLevelInfo.level}`);
      //   // Делайте что-то с следующим уровнем
      // } else {
      //   console.log('Следующий уровень не найден.');
      // }
    }
    this.level = this.nextLevelInfo.level;
    if (this.level < 5) {
      this.theme = this.nextLevelInfo.theme;
      // console.log(`тема в левел локатион ${this.theme}`);
      this.gamePlay.drawUi(this.theme);
      return true; // Продолжаем выполнение кода
    } else {
      this.endGame();
      return false; // Прерываем выполнение кода
    }
  }

  levelUp() {
    if (!this.levelLocation()) {
      return; // Прерываем выполнение метода levelUp()
    }

    for (const hero of this.positionedPlayerTeam) {
      const { health, attack, defence } = hero.character;
      hero.character.health = Math.round(Math.min(health + 80, 100));
      hero.character.attack = Math.round(Math.max(attack, attack * (80 + health) / 100));
      hero.character.defence = Math.round(Math.max(defence, defence * (80 + health) / 100));
      hero.character.level = this.level;
    }
    this.enemyTeam = generateTeam([Vampire, Undead, Daemon], this.level, 3);
    // console.log(this.positionedPlayerTeam);
    this.playerTeam.characters = this.playerTeam.characters.filter((char) => char.health > 0);
    this.positionedPlayerTeam = this.createPositionedTeam(this.playerTeam, this.playerPositions);
    this.positionedEnemyTeam = this.createPositionedTeam(this.enemyTeam, this.enemyPositions);

    for (const enemy of this.positionedEnemyTeam) {
      if (enemy.character.level === this.level) {
          const { health, attack, defence } = enemy.character;
          enemy.character.health = Math.min(health + 80, 100);
          enemy.character.attack = Math.floor(Math.max(attack, (attack * (80 + health)) / 100));
          enemy.character.defence = Math.floor(Math.max(defence, (defence * (80 + health)) / 100));
      }
    }
    this.allChars;
    this.gamePlay.redrawPositions(this.allChars);
    GameState.from(this.state);
  }

  // логика перемещения персонажа
  playerStep(index) {
    this.activeChar.position = index;
    this.gamePlay.redrawPositions(this.allChars);
    this.gamePlay.cells.forEach((cell, i) => this.gamePlay.deselectCell(i));
    this.clickedChar = null;
    this.state.isPlayer = false;
    this.state.chars = this.allChars;
    GameState.from(this.state);
    this.compAct();
  }

  // логика расчёта урона от атаки
  damageСalculator(attacker, target) {
    const attackerAttack = attacker.character.attack;
    const targetDefence = target.character.defence;
    const damage = Math.max(attackerAttack - targetDefence, attackerAttack * 0.1);
    return Math.floor(damage);
  }

  // игрок бьёт врага
  playerAttack(index) {
    const target = this.allChars.find((char) => char.position === index);
    const damage = this.damageСalculator(this.activeChar, target);
    if (this.activeChar.character.health <= 0) {
      this.activeChar.character.attack = 0;
      alert("Ваш персонаж мёртв, для хода выберете другого героя!")
      return;
    }
    this.gamePlay.showDamage(index, damage)
      .then(() => {
        target.character.health -= damage;
        if (target.character.health <= 0) {
          this.positionedEnemyTeam = this.positionedEnemyTeam.filter((char) => char !== target);
          this.allChars;
          if (this.positionedEnemyTeam.length === 0) {
            // Вызываем метод для перехода на следующий уровень или завершения игры
            this.levelUp();
          }
        }

        this.gamePlay.redrawPositions(this.allChars);
        this.state.isPlayer = true;
        this.state.chars = this.allChars;
        GameState.from(this.state);
        this.compAct();
      })
  }

  // Ход ИИ. поиск героя игрока для атаки, если такового нет, тогда перемещение.
  compAct() {
    let targetHero = null;
    let targetEnemy = null;
    const playerHeroes = this.positionedPlayerTeam.map((player) => player.position)
    for (const enemy of this.positionedEnemyTeam) {
      for (const hero of playerHeroes) {
        if (heroesDistanceStep(enemy.character.type, enemy.position, hero, this.fieldSize, 'attack')) {
          targetHero = hero;
          targetEnemy = enemy;
          break;
        }
      }
    }
    if (targetEnemy !== null) {
      this.enemyAttack(targetHero, targetEnemy);
    } else {
      this.stepEnemy();
    }
  }

  // враг бьёт ---> игрока
  enemyAttack(targetHero, targetEnemy) {
    const targetHeroes = this.allChars.find((char) => char.position === targetHero);
    const damage = this.damageСalculator(targetEnemy, targetHeroes);
    this.gamePlay.showDamage(targetHero, damage)
      .then(() => {
        targetHeroes.character.health -= damage;
        if (targetHeroes.character.health <= 0) {
          this.positionedPlayerTeam = this.positionedPlayerTeam.filter((char) => char !== targetHeroes);
          this.allChars;
        }
        this.gamePlay.redrawPositions(this.allChars);
        this.state.isPlayer = true;
        this.state.chars = this.allChars;
        GameState.from(this.state);
      })
  }
  

  // передвижение по полю бота
  stepEnemy() {
    if (this.winGame) {
      const randomEnemyIndex = Math.floor(Math.random() * this.positionedEnemyTeam.length);
      const randomEnemy = this.positionedEnemyTeam[randomEnemyIndex];
      const availableCells = [];
      for (let i = 0; i < this.fieldSize * this.fieldSize; i += 1) {
        if (heroesDistanceStep(randomEnemy.character.type, randomEnemy.position, i, this.fieldSize, 'step')) {
          availableCells.push(i);
        }
      }
      const occupiedCells = this.allChars.map((char) => char.position);
      const unoccupiedCells = availableCells.filter((cell) => !occupiedCells.includes(cell));
      const randomCellIndex = Math.floor(Math.random() * unoccupiedCells.length);
      const newPosition = unoccupiedCells[randomCellIndex];
      randomEnemy.position = newPosition;
      this.gamePlay.redrawPositions(this.allChars);
      this.state.chars = this.allChars;
      GameState.from(this.state);
      this.winGame = true;
    }
  }

  endGame() {
    this.winGame = false;
    if (this.maxScore > 0) {
      let scoreItog = ((this.level - 1) * 10) + (((this.state.chars.length) - 1) * 5);
      this.maxScore = this.maxScore + scoreItog;
      console.log(`Счёт за эту игру: ${scoreItog}`);
      console.log(`Конечный счёт за ВСЕ игры: ${this.maxScore}`);
    } else {
      let maxScore = 0;
      console.log(`Счёт пока равен 0: ${maxScore}`);
      let scoreItog = ((this.level - 1) * 10) + (((this.state.chars.length) - 1) * 5);
      this.maxScore = maxScore + scoreItog;
      console.log(`Конечный счёт за ВСЕ игры: ${this.maxScore}`);
    }
    alert(`Поздравляю! Вы прошли игру! Ваши очки за прохождение компании: ${this.maxScore}!`)
    // console.log(GameState.from(this.state.maxScore));
    // return
    // this.init()
    var boardContainer = document.querySelector('.board-container');
    boardContainer.classList.add('disabled');
    var saveButton = document.querySelector('button[data-id="action-save"]');
    saveButton.classList.add('disabled');
    var loadButton = document.querySelector('button[data-id="action-load"]');
    loadButton.classList.add('disabled');
  }
}



// 1. убрать божественный класс.

// Ключевые сущности:
// GamePlay - класс, отвечающий за взаимодействие с HTML-страницей
// GameController - класс, отвечающий за логику приложения (важно: это не контроллер в терминах MVC), там вы будете работать больше всего
// GameState - объект, который хранит текущее состояние игры (может сам себя воссоздавать из другого объекта)
// // ...
