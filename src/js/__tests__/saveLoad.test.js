import GameStateService from "../GameStateService";


describe('GameStateService', () => {
  test('load save success', () => {
    const localStorageMock = {
      getItem: (key) => {
        if (key === 'gameData') {
          return `{
            "isPlayer": true,
            "theme": "prairie",
            "level": 1,
            "chars": [
              {"character":{"level":1,"attack":25,"defence":25,"health":50,"type":"bowman"},"position":56},
              {"character":{"level":1,"attack":25,"defence":25,"health":50,"type":"bowman"},"position":25},
              {"character":{"level":1,"attack":25,"defence":25,"health":50,"type":"bowman"},"position":16},
              {"character":{"level":1,"attack":25,"defence":25,"health":50,"type":"vampire"},"position":47},
              {"character":{"level":1,"attack":10,"defence":10,"health":50,"type":"daemon"},"position":6},
              {"character":{"level":1,"attack":10,"defence":10,"health":50,"type":"daemon"},"position":39}
            ],
            "maxScore": 755
            }`;
        }
      }
    }
    const gameStateService = new GameStateService(localStorageMock);
    // const gameDataString = localStorageMock.getItem('gameData');
    // const gameData = JSON.parse(gameDataString);
    // const chars = gameData.chars[0].position;
    // console.log(localStorageMock.getItem);
    expect(gameStateService.storage.getItem).toEqual(localStorageMock.getItem);
  });

  test('load save failed', () => {
    const localStorageMock = { getItem: () => { throw new Error() } };
    const gameStateService = new GameStateService(localStorageMock);
    expect(() => { gameStateService.load() }).toThrowError("Ошибка загрузки игры.");
    });
})
