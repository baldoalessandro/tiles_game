import { Component, For } from "solid-js";

import cls from "./board.module.css";
import { useGameState } from "../game";
import { Tile } from "./tile";

export const Board: Component = () => {
  const { state } = useGameState();

  return (
    <div class={cls.board}>
      <For each={state.tiles}>
        {(tile, idx) => <Tile tile={tile} idx={idx()} />}
      </For>
    </div>
  );
};
