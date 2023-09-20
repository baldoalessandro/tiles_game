import { GameStateCtx, createGameStateStore } from "./game/state";
import { DEFAULT_TILESET_THEME, TilesetThemeCtx } from "./graphics";
import { Board } from "./components/board";

export const Main = () => {
  const { numberOfLayers, numberOfVariations } = DEFAULT_TILESET_THEME;
  const gameStateStore = createGameStateStore(
    numberOfLayers,
    numberOfVariations,
  );

  return (
    <TilesetThemeCtx.Provider value={DEFAULT_TILESET_THEME}>
      <GameStateCtx.Provider value={gameStateStore}>
        <Board />
      </GameStateCtx.Provider>
    </TilesetThemeCtx.Provider>
  );
};
