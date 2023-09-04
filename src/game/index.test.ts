import { vi } from "vitest";
import { createRoot } from "solid-js";
import { NUMBER_OF_TILES, createGameStateStore } from "./";
import { generateTiles } from "./tiles";

// Mock tiles generation
const { mockTiles, mockBitmaps } = vi.hoisted(() => ({
  mockTiles: [
    0b0_010_100_010, 0b0_001_011_011, 0b0_011_100_011, 0b0_011_011_001,
    0b0_011_100_011, 0b0_001_011_100, 0b0_100_011_010, 0b0_001_011_100,
    0b0_001_001_001, 0b0_010_010_001, 0b0_001_001_100, 0b0_011_010_001,
    0b0_100_100_010, 0b0_100_001_100, 0b0_011_010_010, 0b0_011_001_001,
    0b0_001_001_011, 0b0_100_010_011, 0b0_001_010_010, 0b0_010_011_001,
    0b0_010_011_100, 0b0_001_010_010, 0b0_100_010_011, 0b0_010_100_011,
    0b0_010_100_001, 0b0_100_001_001, 0b0_011_011_011, 0b0_010_010_010,
    0b0_011_001_010, 0b0_010_001_100,
  ],
  mockBitmaps: [0b0_000_000_111, 0b0_000_111_000, 0b0_111_000_000],
}));

vi.mock("./tiles", async (original) => {
  const mod: typeof import("./tiles") = await original();
  return {
    ...mod,
    generateTiles: vi
      .fn<
        Parameters<typeof mod.generateTiles>,
        ReturnType<typeof mod.generateTiles>
      >()
      .mockImplementation((nrOfTiles, nrOfLayers, nrOfVariationPerLayer) => {
        // Check if the mocked version is good enough
        expect(nrOfTiles).toEqual(mockTiles.length);
        expect(nrOfLayers).toEqual(mockBitmaps.length);
        expect(nrOfVariationPerLayer).toEqual(4);

        return {
          tiles: [...mockTiles],
          bitmasks: [...mockBitmaps],
          bitsPerLayer: 3,
        };
      }),
  };
});

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

    it("doesn't change selection when selecting an empty tile", () => {
      // Set the first tile to 0 to have an empty tile
      vi.mocked(generateTiles).mockReturnValueOnce({
        tiles: [0, ...mockTiles.slice(1)],
        bitmasks: mockBitmaps,
        bitsPerLayer: 3,
      });
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.selectedTile).toBe(undefined);
        select(1);
        expect(state.selectedTile).toEqual(1);

        expect(state.tiles[0]).toEqual(0);
        select(0);

        expect(state.selectedTile).toEqual(1);
      });
    });

    describe(" with a currently selected tile", () => {
      it("updates the tiles when there is a match", () => {
        createRoot(() => {
          const { state, select } = createGameStateStore();

          expect(state.selectedTile).toBe(undefined);
          select(0);
          expect(state.selectedTile).toEqual(0);
          expect(state.tiles[0]).toEqual(0b0_010_100_010);

          expect(state.tiles[2]).toEqual(0b0_011_100_011);
          select(2);
          expect(state.selectedTile).toEqual(2);

          expect(state.tiles[0]).toEqual(0b0_010_000_010);
          expect(state.tiles[2]).toEqual(0b0_011_000_011);

          const expectedChangedTilesIdxs = [0, 2];
          expect(
            state.tiles.filter((_, i) => !expectedChangedTilesIdxs.includes(i))
          ).toEqual(
            mockTiles.filter((_, i) => !expectedChangedTilesIdxs.includes(i))
          );
        });
      });

      it("doesn't do anything when the curretly selected tile is selected again", () => {
        [0, 4, 11].forEach((t) => {
          createRoot(() => {
            const { state, select } = createGameStateStore();
            expect(state.selectedTile).toBe(undefined);
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
        expect(state.currentChain).toEqual(0);

        select(0);
        select(2);

        expect(state.currentChain).toEqual(1);
      });
    });

    it("increments highest score on valid move", () => {
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.currentChain).toEqual(0);

        select(0);
        select(2);

        expect(state.currentChain).toEqual(1);
        expect(state.highestChain).toEqual(1);
      });
    });

    it("resets only the current score on error", () => {
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.currentChain).toEqual(0);

        select(0);
        select(2);
        expect(state.currentChain).toEqual(1);
        expect(state.highestChain).toEqual(1);

        select(0);
        expect(state.currentChain).toEqual(0);
        expect(state.highestChain).toEqual(1);
      });
    });

    it("update the highest score when is beated", () => {
      createRoot(() => {
        const { state, select } = createGameStateStore();
        expect(state.currentChain).toEqual(0);

        select(0);
        select(2);
        expect(state.currentChain).toEqual(1);
        expect(state.highestChain).toEqual(1);

        select(0);
        expect(state.currentChain).toEqual(0);
        expect(state.highestChain).toEqual(1);

        select(6);
        expect(state.currentChain).toEqual(1);
        expect(state.highestChain).toEqual(1);

        select(3);
        expect(state.currentChain).toEqual(2);
        expect(state.highestChain).toEqual(2);
      });
    });
  });
});
