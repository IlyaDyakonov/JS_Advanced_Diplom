import { calcTileType } from "../utils.js";


test("тестируем отрисовку игрового поля", () => {
    expect(calcTileType(0, 8)).toBe("top-left");
    expect(calcTileType(7, 8)).toBe("top-right");
    expect(calcTileType(56, 8)).toBe("bottom-left");
    expect(calcTileType(63, 8)).toBe("bottom-right");
    for (let i = 9; i < 55; i++) {
        if (i % 8 !== 0 && i % 8 !== 7) {
            expect(calcTileType(i, 8)).toBe("center");
        }
    };

    for (let i = 1; i < 7; i++) {
        expect(calcTileType(i, 8)).toBe("top");
    };

    for (let i = 57; i < 63; i += 1) {
        expect(calcTileType(i, 8)).toBe("bottom");
    };

    for (let i = 8; i < 49; i += 8) {
        expect(calcTileType(i, 8)).toBe("left");
    };

    for (let i = 15; i < 56; i += 8) {
        expect(calcTileType(i, 8)).toBe("right");
    };
});