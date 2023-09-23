import { Component, For, createMemo } from "solid-js";

import cls from "./tile.module.css";
import { useGameState } from "../game/state";

export const Tile: Component<{
  tile: number;
  idx: number;
  selected: boolean;
}> = (props) => {
  const { select, getLayers, isTileEmpty } = useGameState();

  const layers = createMemo(() => getLayers(props.tile));
  const empty = createMemo(() => isTileEmpty(props.tile));

  return (
    <button
      class={cls.tile}
      classList={{ [cls.selected]: props.selected, [cls.empty]: empty() }}
      onClick={() => select(props.idx)}
    >
      <span class="visually-hidden">Tile {props.idx + 1}</span>
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
