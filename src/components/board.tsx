import { Component, For, onMount } from "solid-js";

import cls from "./board.module.css";
import { useGameState } from "../game";
import { Tile } from "./tile";
import { useTilesetTheme } from "../graphics";

export const Board: Component = () => {
  let boardEl: HTMLDivElement | undefined;

  const { state } = useGameState();
  const { screenBgColor, boardBgColors, generateSprites } = useTilesetTheme();

  onMount(() => {
    boardEl?.style.setProperty("--bg-color", screenBgColor);
    boardEl?.style.setProperty("--tile-bg-1-color", boardBgColors[0]);
    boardEl?.style.setProperty("--tile-bg-2-color", boardBgColors[1]);
  });

  return (
    <div ref={boardEl} class={cls.board}>
      <svg xmlns="http://www.w3.org/2000/svg" class={cls.sprites}>
        { generateSprites() }
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
  );
};
