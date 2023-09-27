import { GameStateCtx, createGameStateStore } from "./game/state";
import { DEFAULT_TILESET_THEME, TilesetThemeCtx } from "./graphics";
import { Board } from "./components/board";
import { Won } from "./components/won";
import { Match, Switch, onMount } from "solid-js";

import { registerSW } from "virtual:pwa-register";

export const Main = () => {
  const { numberOfLayers, numberOfVariations } = DEFAULT_TILESET_THEME;
  const gameStateStore = createGameStateStore(
    numberOfLayers,
    numberOfVariations,
  );

  onMount(() => {
    const updateSW = registerSW({
      onOfflineReady() {
        console.info("Game ready to work offline!");
      },
      onNeedRefresh() {
        console.info("New version available!");
        const installNow = window.confirm(
          "A new version is available, do you want to install it now?",
        );
        if (installNow) {
          console.info("Updating to new version");
          updateSW();
        }
      },
    });
  });

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
