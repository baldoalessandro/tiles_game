import { GameStateCtx, createGameStateStore } from "./game";
import { DEFAULT_TILESET_THEME, TilesetThemeCtx } from "./graphics";
import { Board } from "./components/board";

export const Main = () => {
  const gameStateStore = createGameStateStore();

  return (
    <TilesetThemeCtx.Provider value={DEFAULT_TILESET_THEME}>
      <GameStateCtx.Provider value={gameStateStore}>
        <Board />
      </GameStateCtx.Provider>
    </TilesetThemeCtx.Provider>
  );
};
