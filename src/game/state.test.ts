import { vi } from "vitest";
import { createRoot } from "solid-js";

import { NUMBER_OF_TILES, createGameStateStore } from "./state";

import { mockTiles, mockBitmaps } from "./__fixtures";

vi.mock("./generator");
import { generateTiles } from "./generator";

describe("GameState", () => {
  it("init with a new game", () => {
    createRoot(() => {
      const { state } = createGameStateStore();

      expect(state.tiles).toHaveLength(NUMBER_OF_TILES);
      expect(state.tiles).toEqual(mockTiles);
      expect(state.selectedTile).toBeUndefined();
      expect(state.ended).toBe(false);
    });
  });

  it("init with a new game with given params", () => {
    vi.mocked(generateTiles).mockReturnValueOnce({
      tiles: Array.from({ length: 30 }, () => 0),
      bitmasks: mockBitmaps,
      bitsPerLayer: 4,
    });

    createRoot(() => {
      const { state } = createGameStateStore(4, 6);

      expect(state.tiles).toHaveLength(NUMBER_OF_TILES);
      expect(vi.mocked(generateTiles)).toHaveBeenCalledWith(
        NUMBER_OF_TILES,
        4,
        6,
      );
    });
  });

  it("init with a new game on reset", () => {
    createRoot(() => {
      const { state, reset } = createGameStateStore();
      expect(state.tiles).toEqual(mockTiles);

      reset();

      expect(state.tiles).toHaveLength(NUMBER_OF_TILES);
      expect(state.tiles).toEqual(mockTiles);
      expect(state.selectedTile).toBeUndefined();
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

          expect(state.selectedTile).toBeUndefined();
          select(tileIdx);
          expect(state.selectedTile).toEqual(tileIdx);
        });
      });
    });

    it("doesn't change selection when selecting an empty tile", () => {
      // Set the first tile to 0 to have an empty tile
      vi.mocked(generateTiles).mockReturnValueOnce({
        tiles: [0, ...mockTiles.slice(1)],
        bitmasks: mockBitmaps,
        bitsPerLayer: 3,
      });
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.selectedTile).toBeUndefined();
        select(1);
        expect(state.selectedTile).toBe(1);

        expect(state.tiles[0]).toBe(0);
        select(0);

        expect(state.selectedTile).toBe(1);
      });
    });

    describe("with a currently selected tile", () => {
      it("updates the tiles when there is a match", () => {
        createRoot(() => {
          const { state, select } = createGameStateStore();

          expect(state.selectedTile).toBeUndefined();
          expect(state.lastErrorTile).toBeUndefined();
          select(0);
          expect(state.selectedTile).toBe(0);
          expect(state.tiles[0]).toBe(0b0_010_100_010);

          expect(state.tiles[2]).toBe(0b0_011_100_011);
          select(2);
          expect(state.selectedTile).toBe(2);

          expect(state.tiles[0]).toBe(0b0_010_000_010);
          expect(state.tiles[2]).toBe(0b0_011_000_011);

          const expectedChangedTilesIdxs = [0, 2];
          expect(
            state.tiles.filter((_, i) => !expectedChangedTilesIdxs.includes(i)),
          ).toEqual(
            mockTiles.filter((_, i) => !expectedChangedTilesIdxs.includes(i)),
          );
          expect(state.lastErrorTile).toBeUndefined();
        });
      });

      it("updates the lastErrorTile when there isn't a match", () => {
        createRoot(() => {
          const { state, select } = createGameStateStore();

          expect(state.selectedTile).toBeUndefined();
          expect(state.lastErrorTile).toBeUndefined();
          select(0);
          expect(state.selectedTile).toBe(0);
          expect(state.tiles[0]).toBe(0b0_010_100_010);

          expect(state.tiles[5]).toBe(0b0_001_011_100);
          select(5);
          expect(state.selectedTile).toBe(5);

          expect(state.tiles[0]).toBe(0b0_010_100_010);
          expect(state.tiles[5]).toBe(0b0_001_011_100);

          expect(state.lastErrorTile).toBe(5);
        });
      });

      it("doesn't do anything when the curretly selected tile is selected again", () => {
        [0, 4, 11].forEach((t) => {
          createRoot(() => {
            const { state, select } = createGameStateStore();
            expect(state.selectedTile).toBeUndefined();
            select(t);
            expect(state.selectedTile).toEqual(t);

            select(t);

            expect(state.selectedTile).toEqual(t);
            expect(state.tiles).toEqual(mockTiles);
          });
        });
      });
    });
  });

  describe("score", () => {
    it("increments current score on valid move", () => {
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.score.currentRunLen).toBe(0);
        expect(state.score.errors).toBe(0);

        select(0);
        select(2);

        expect(state.score.currentRunLen).toBe(1);
        expect(state.score.errors).toBe(0);
      });
    });

    it("increments highest score on valid move", () => {
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.score.currentRunLen).toBe(0);

        select(0);
        select(2);

        expect(state.score.currentRunLen).toBe(1);
        expect(state.score.highestRunLen).toBe(1);
        expect(state.score.errors).toBe(0);
      });
    });

    it("resets only the current score on error and starts a new chain", () => {
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.score.currentRunLen).toBe(0);

        select(0);
        select(2);
        expect(state.score.currentRunLen).toBe(1);
        expect(state.score.highestRunLen).toBe(1);

        select(0);
        expect(state.score.currentRunLen).toBe(0);
        expect(state.score.highestRunLen).toBe(1);
        expect(state.score.errors).toBe(1);
      });
    });

    it("doesn't reset the current score when a move starts from an empty tile", () => {
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.score.currentRunLen).toBe(0);

        select(24);
        select(0);
        select(21);
        select(9);
        select(24);
        expect(state.score.currentRunLen).toBe(4);
        expect(state.score.highestRunLen).toBe(4);
        expect(state.tiles[24]).toBe(0);
        expect(state.selectedTile).toBe(24);

        select(11);
        expect(state.score.currentRunLen).toBe(4);
        expect(state.score.highestRunLen).toBe(4);
        expect(state.selectedTile).toBe(11);
      });
    });

    it("updates the highest score when is beated", () => {
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.score.currentRunLen).toBe(0);

        select(0);
        select(2);
        expect(state.score.currentRunLen).toBe(1);
        expect(state.score.highestRunLen).toBe(1);

        select(0);
        expect(state.score.currentRunLen).toBe(0);
        expect(state.score.highestRunLen).toBe(1);

        select(6);
        expect(state.score.currentRunLen).toBe(1);
        expect(state.score.highestRunLen).toBe(1);

        select(3);
        expect(state.score.currentRunLen).toBe(2);
        expect(state.score.highestRunLen).toBe(2);
      });
    });

    it("detects the end of a game", () => {
      vi.mocked(generateTiles).mockReturnValueOnce({
        tiles: [
          0b0_001_000_000,
          0b0_001_000_000,
          ...Array.from({ length: NUMBER_OF_TILES - 2 }, () => 0),
        ],
        bitmasks: mockBitmaps,
        bitsPerLayer: 3,
      });

      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.ended).toBe(false);

        select(0);
        select(1);

        expect(state.ended).toBe(true);
      });
    });
  });
});
