import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { generateTiles } from "./tiles";


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

  function initialState() {
    const { tiles, bitmasks: masks } = generateTiles(NUMBER_OF_TILES, 3, 4);
    bitmasks = masks;
    return {
      tiles,
      selectedTile: undefined,
    };
  }

  const [state, _setState] = createStore<GameState>(initialState());

  function reset() {
    _setState(initialState());
  }

  return { state, reset };
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
