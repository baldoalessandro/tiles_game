import { vi } from "vitest";
import { createRoot } from "solid-js";
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
    createRoot(() => {
      const { state } = createGameStateStore();

      expect(state.tiles).toHaveLength(NUMBER_OF_TILES);
      expect(state.tiles).toEqual(mockTiles);
      expect(state.selectedTile).toBe(undefined);
    });
  });

  it("init with a new game on reset", () => {
    createRoot(() => {
      const { state, reset } = createGameStateStore();
      expect(state.tiles).toEqual(mockTiles);

      reset();

      expect(state.tiles).toHaveLength(NUMBER_OF_TILES);
      expect(state.tiles).toEqual(mockTiles);
      expect(state.selectedTile).toBe(undefined);
    });
  });

  it("exposes a getLayers function", () => {
    createRoot(() => {
      const { getLayers } = createGameStateStore();
      const layers = getLayers(0b001_010_011);
      expect(layers).toEqual([3, 2, 1]);
    });
  });

  describe("input handling", () => {
    it("selects a tile if no tile was currently selected", () => {
      [0, 4, 12, 29].forEach((tileIdx) => {
        createRoot(() => {
          const { state, select } = createGameStateStore();

          expect(state.selectedTile).toBe(undefined);
          select(tileIdx);
          expect(state.selectedTile).toEqual(tileIdx);
        });
      });
    });

    describe(" with a currently selected tile", () => {
      it("updates the tiles when there is a match", () => {
        createRoot(() => {
          const { state, select } = createGameStateStore();

          expect(state.tiles[0]).toEqual(state.tiles[1]);
          expect(state.selectedTile).toBe(undefined);
          select(0);
          expect(state.selectedTile).toEqual(0);

          select(1);
          expect(state.selectedTile).toEqual(1);

          expect(state.tiles[0]).toEqual(0b000_000_000);
          expect(state.tiles[1]).toEqual(0b000_000_000);

          const expectedChangedTilesIdxs = [0, 1];
          expect(
            state.tiles.filter((_, i) => !expectedChangedTilesIdxs.includes(i))
          ).toEqual(
            mockTiles.filter((_, i) => !expectedChangedTilesIdxs.includes(i))
          );
        });
      });
    });
  });
});
