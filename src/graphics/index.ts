import { createContext, useContext } from "solid-js";

export interface TilesetTheme {
  /**
   * The theme name
   */
  name: string;
  /**
   * The background color for the board.
   */
  screenBgColor: string;

  /**
   * The colors used for the checkeboard background.
   */
  boardBgColors: [string, string];
}


export const DEFAULT_TILESET_THEME: TilesetTheme = {
  name: "default",
  screenBgColor: "silver",
  boardBgColors: ["gray", "whitesmoke"],
}


/**
 * The context used to expose the tileset graphics theme
 */
export const TilesetThemeCtx = createContext<TilesetTheme>(DEFAULT_TILESET_THEME);

/**
 * Hook the tileset theme from any component in the tree.
 */
export function useTilesetTheme() {
  return useContext(TilesetThemeCtx);
}
