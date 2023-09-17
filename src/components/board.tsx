import { Component, For, onMount } from "solid-js";

import cls from "./board.module.css";
import { useGameState } from "../game";
import { Tile } from "./tile";
import { useTilesetTheme } from "../graphics";

export const Board: Component = () => {
  let boardWrapperEl: HTMLDivElement | undefined;

  const { state } = useGameState();
  const { screenBgColor, boardBgColors, generateSprites } = useTilesetTheme();

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
                selected={state.selectedTile === idx()}
              />
            )}
          </For>
        </main>
        <aside class={cls.score}>
          <p>
            <span>Current</span>
            <output>{state.currentChain}</output>
          </p>
          <p>
            <span>Highest</span>
            <output>{state.highestChain}</output>
          </p>
        </aside>
      </div>
    </div>
  );
};
