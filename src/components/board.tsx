import { Component, For, createEffect, onMount } from "solid-js";

import cls from "./board.module.css";
import { useGameState } from "../game/state";
import { Tile } from "./tile";
import { useTilesetTheme } from "../graphics";

export const Board: Component = () => {
  let boardWrapperEl: HTMLDivElement | undefined;

  const { state } = useGameState();
  const { screenBgColor, boardBgColors, generateSprites } = useTilesetTheme();

  // Give haptic feedback on error
  createEffect(() => {
    if (state.lastErrorTile !== undefined && !!window.navigator.vibrate) {
      window.navigator.vibrate([30, 30]);
    }
  });

  onMount(() => {
    boardWrapperEl?.style.setProperty("--bg-color", screenBgColor);
    boardWrapperEl?.style.setProperty("--tile-bg-1-color", boardBgColors[0]);
    boardWrapperEl?.style.setProperty("--tile-bg-2-color", boardBgColors[1]);
  });

  return (
    <div ref={boardWrapperEl} class={cls.boardWrapper}>
      <div class={cls.board}>
        <svg xmlns="http://www.w3.org/2000/svg" class={cls.sprites}>
          {generateSprites()}
        </svg>
        <main class={cls.tiles}>
          <For each={state.tiles}>
            {(tile, idx) => (
              <Tile
                tile={tile}
                idx={idx()}
                error={state.lastErrorTile === idx()}
                selected={state.selectedTile === idx()}
              />
            )}
          </For>
        </main>
        <aside class={cls.score}>
          <p>
            <span>Current</span>
            <output>{state.score.currentRunLen}</output>
          </p>
          <p>
            <span>Highest</span>
            <output>{state.score.highestRunLen}</output>
          </p>
        </aside>
        <footer class={cls.version}>v {__APP_VERSION__}</footer>
      </div>
    </div>
  );
};
