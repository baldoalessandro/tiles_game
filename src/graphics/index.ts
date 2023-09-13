import { JSX, createContext, useContext } from "solid-js";

import SquirclePebbles from "./themes/SquirclePebbles";

export interface TilesetTheme {
  /**
   * The theme name
   */
  readonly name: string;
  /**
   * The background color for the board.
   */
  readonly screenBgColor: string;
  /**
   * The colors used for the checkeboard background.
   */
  readonly boardBgColors: [string, string];
  /**
   * The number of stacked layer composing each tile.
   */
  readonly numberOfLayers: number;
  /**
   * The number of variations available for each layer.
   */
  readonly numberOfVariations: number;

  /**
   * Functions that returns the SVG of every layer and variant.
   */
  generateSprites(): JSX.Element[];
}

/**
 * Generate a textual ID to be used in each layer variant.
 */
export function genID(layer: number, variation: number): string {
  return `t_l${layer}_v${variation}`;
}

export const DEFAULT_TILESET_THEME = SquirclePebbles;

/**
 * The context used to expose the tileset graphics theme
 */
export const TilesetThemeCtx = createContext<TilesetTheme>(
  DEFAULT_TILESET_THEME
);

/**
 * Hook the tileset theme from any component in the tree.
 */
export function useTilesetTheme() {
  return useContext(TilesetThemeCtx);
}
