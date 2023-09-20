import { Component, For, createMemo } from "solid-js";

import cls from "./tile.module.css";
import { useGameState } from "../game/state";

export const Tile: Component<{
  tile: number;
  idx: number;
  selected: boolean;
}> = (props) => {
  const { select, getLayers } = useGameState();

  const layers = createMemo(() => getLayers(props.tile));

  return (
    <button
      class={cls.tile}
      classList={{ [cls.selected]: props.selected }}
      onClick={() => select(props.idx)}
    >
      <For each={layers()}>
        {(v, l) =>
          v !== 0 ? (
            <svg>
              <use href={`#t_l${l()}_v${v}`} />
            </svg>
          ) : null
        }
      </For>
    </button>
  );
};
