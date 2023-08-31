import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { generateTiles, getLayersFromTile, simplifyTiles } from "./tiles";

// The board is made of 5 x 6 tiles
// NOTE this could be changed but it must be an even number
export const NUMBER_OF_TILES = 30 as const;

export interface GameState {
  tiles: number[];
  selectedTile?: number;
}

/**
 * Define a reactive store to keep the game state and its mutation methods.
 */
export function createGameStateStore() {
  let bitmasks: number[];
  let bitsPerLayer: number;

  function initialState() {
    const { tiles, bitmasks: masks, bitsPerLayer: bpl } = generateTiles(NUMBER_OF_TILES, 3, 4);
    bitmasks = masks;
    bitsPerLayer = bpl;
    return {
      tiles,
      selectedTile: undefined,
    };
  }

  const [state, _setState] = createStore<GameState>(initialState());

  function reset() {
    _setState(initialState());
  }

  function select(tileIdx: number) {
    if (state.selectedTile !== undefined) {
      const t1Idx = state.selectedTile;
      const t2Idx = tileIdx;

      if (t1Idx === t2Idx) {
        return;
      }

      const t1Curr = state.tiles[t1Idx];
      const t2Curr = state.tiles[t2Idx];

      const [t1Next, t2Next] = simplifyTiles(t1Curr, t2Curr, bitmasks);

      _setState("tiles", t1Idx, t1Next);
      _setState("tiles", t2Idx, t2Next);
    }

    _setState({ selectedTile: tileIdx });
  }

  function getLayers(tile: number) {
    return getLayersFromTile(tile, bitmasks, bitsPerLayer);
  }

  return { state, reset, select, getLayers };
}

/**
 * The context used to expose the game state store in the application
 */
export const GameStateCtx = createContext<
  ReturnType<typeof createGameStateStore>
>(createGameStateStore());

/**
 * Hook the game state store from any component in the tree.
 */
export function useGameState() {
  return useContext(GameStateCtx);
}
