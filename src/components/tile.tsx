import { Component } from "solid-js";

import cls from "./tile.module.css";
import { useGameState } from "../game";

export const Tile: Component<{
  tile: number;
  idx: number;
  selected: boolean;
}> = (props) => {
  const { select, getLayers } = useGameState();

  const layers = getLayers(props.tile);

  return (
    <button
      class={cls.tile}
      classList={{ [cls.selected]: props.selected }}
      onClick={() => select(props.idx)}
    >
      {layers.join("﹍")}
    </button>
  );
};