import { Component, Index, Show, createMemo } from "solid-js";
import { Presence, Motion } from "solid-motionone";

import cls from "./tile.module.css";
import { useGameState } from "../game/state";

import { Toast } from "./toast";

export const Tile: Component<{
  tile: number;
  idx: number;
  selected: boolean;
  error: boolean;
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
      <Index each={layers()}>
        {(v, l) => (
          <Presence>
            <Show when={v() !== 0}>
              <Motion.svg
                // The following props are required to correctly render
                // inline SVG on iOS14.
                // It is important that the width and height values
                // are set to a value > 150px (the default height value for
                // inline SVGs on Safari for iOS14) and big enough to accomodate
                // the widest possible tile.
                width="512"
                height="512"
                preserveAspectRatio="xMidYMid slice"
                // Exit animation
                // initial={false}
                initial={{ opacity: 0, scale: 0, rotate: "-360deg" }}
                animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
                exit={{ opacity: 0, scale: 0, rotate: "-360deg" }}
                transition={{ duration: 0.5, easing: "ease-in" }}
              >
                <use href={`#t_l${l}_v${v()}`} />
              </Motion.svg>
            </Show>
          </Presence>
        )}
      </Index>
      <div class={cls.toast}>
        <Show when={props.selected && empty()}>
          <Toast text="go anywhere" />
        </Show>
        <Show when={props.selected && props.error}>
          <Toast text="no match" />
        </Show>
      </div>
    </button>
  );
};
