import { GameStateCtx, createGameStateStore } from "./game/state";
import { DEFAULT_TILESET_THEME, TilesetThemeCtx } from "./graphics";
import { Board } from "./components/board";
import { Won } from "./components/won";
import { Match, Switch } from "solid-js";

export const Main = () => {
  const { numberOfLayers, numberOfVariations } = DEFAULT_TILESET_THEME;
  const gameStateStore = createGameStateStore(
    numberOfLayers,
    numberOfVariations,
  );

  return (
    <TilesetThemeCtx.Provider value={DEFAULT_TILESET_THEME}>
      <GameStateCtx.Provider value={gameStateStore}>
        <Switch>
          <Match when={gameStateStore.state.ended}>
            <Won />
          </Match>
          <Match when={!gameStateStore.state.ended}>
            <Board />
          </Match>
        </Switch>
      </GameStateCtx.Provider>
    </TilesetThemeCtx.Provider>
  );
};
