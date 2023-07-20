import { vi } from "vitest";
import { NUMBER_OF_TILES, createGameStateStore } from "./";

vi.mock("array-shuffle", () => ({
  // We mock `arrayShuffle` used in the "./tiles" module with the identity fn
  default: (x: unknown) => x,
}));

const mockTiles = [
  0b001_001_001, 0b001_001_001, 0b010_010_010, 0b010_010_010, 0b011_011_011,
  0b011_011_011, 0b100_100_100, 0b100_100_100, 0b001_001_001, 0b001_001_001,
  0b010_010_010, 0b010_010_010, 0b011_011_011, 0b011_011_011, 0b100_100_100,
  0b100_100_100, 0b001_001_001, 0b001_001_001, 0b010_010_010, 0b010_010_010,
  0b011_011_011, 0b011_011_011, 0b100_100_100, 0b100_100_100, 0b001_001_001,
  0b001_001_001, 0b010_010_010, 0b010_010_010, 0b011_011_011, 0b011_011_011,
];

describe("GameState", () => {
  it("init with a new game", () => {
    const { state } = createGameStateStore();

    expect(state.tiles).toHaveLength(NUMBER_OF_TILES);
    expect(state.tiles).toEqual(mockTiles);
    expect(state.selectedTile).toBe(undefined);
  });

  it("init with a new game on reset", () => {
    const { state, reset } = createGameStateStore();
    expect(state.tiles).toEqual(mockTiles);

    reset();

    expect(state.tiles).toHaveLength(NUMBER_OF_TILES);
    expect(state.tiles).toEqual(mockTiles);
    expect(state.selectedTile).toBe(undefined);
  });
});
