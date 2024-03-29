import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { generateTiles } from "./generator";
import {
  getLayersFromTile,
  isInvalidMove,
  scoreMove,
  simplifyTiles,
  isTileEmpty,
} from "./logic";

// The board is made of 5 x 6 tiles
// NOTE this could be changed but it must be an even number
export const NUMBER_OF_TILES = 30 as const;

export interface GameScore {
  errors: number;
  currentRunLen: number;
  highestRunLen: number;
}
export interface GameState {
  ended: boolean;
  tiles: number[];
  selectedTile?: number;
  lastErrorTile?: number;
  score: GameScore;
}

/**
 * Define a reactive store to keep the game state and its mutation methods.
 */
export function createGameStateStore(
  numberOfLayers = 3,
  numberOfVariations = 4,
) {
  let bitmasks: number[];
  let bitsPerLayer: number;

  function initialState(): GameState {
    const {
      tiles,
      bitmasks: masks,
      bitsPerLayer: bpl,
    } = generateTiles(NUMBER_OF_TILES, numberOfLayers, numberOfVariations);
    bitmasks = masks;
    bitsPerLayer = bpl;
    return {
      ended: false,
      tiles,
      selectedTile: undefined,
      lastErrorTile: undefined,
      score: {
        errors: 0,
        currentRunLen: 0,
        highestRunLen: 0,
      },
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
      const t1Curr = state.tiles[t1Idx];
      const t2Curr = state.tiles[t2Idx];

      if (isInvalidMove(t1Idx, t2Idx, t2Curr)) {
        return;
      }

      const [t1Next, t2Next] = simplifyTiles(t1Curr, t2Curr, bitmasks);

      const [score, wasGoodMove] = scoreMove(t1Curr, t1Next, state.score);
      _setState("lastErrorTile", wasGoodMove ? undefined : t2Idx);
      _setState("score", score);
      _setState("tiles", t1Idx, t1Next);
      _setState("tiles", t2Idx, t2Next);
      _setState("ended", checkGameEnded());
    }

    _setState({ selectedTile: tileIdx });
  }

  function checkGameEnded() {
    return state.tiles.every(isTileEmpty);
  }

  function getLayers(tile: number) {
    return getLayersFromTile(tile, bitmasks, bitsPerLayer);
  }

  return { state, reset, select, getLayers, isTileEmpty };
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
