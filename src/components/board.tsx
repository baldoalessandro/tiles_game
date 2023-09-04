import { Component, For } from "solid-js";

import cls from "./board.module.css";
import { useGameState } from "../game";
import { Tile } from "./tile";

export const Board: Component = () => {
  const { state } = useGameState();

  return (
    <div>
      <main class={cls.board}>
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
          <span>Current chain</span>
          <output>{state.currentChain}</output>
        </p>
        <p>
          <span>Highest Chain</span>
          <output>{state.highestChain}</output>
        </p>
      </aside>
    </div>
  );
};
