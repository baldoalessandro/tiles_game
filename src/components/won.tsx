import { Component, Match, Show, Switch } from "solid-js";

import cls from "./won.module.css";
import { useGameState } from "../game/state";

export const Won: Component = () => {
  const { state, reset } = useGameState();

  const wasPerfectGame = state.score.errors === 0;

  return (
    <main class={cls.won}>
      <span class={cls.cup} aria-hidden>
        <Switch>
          <Match when={wasPerfectGame}>🏅</Match>
          <Match when={!wasPerfectGame}>🏆</Match>
        </Switch>
      </span>
      <h1>You won!</h1>
      <Show when={wasPerfectGame}>
        <p>PERFECT</p>
      </Show>
      <p>Number of chains: {state.score.errors + 1}</p>
      <p>Longest chain: {state.score.highestRunLen}</p>
      <button onClick={() => reset()} class={cls.newGame}>
        New game
      </button>
    </main>
  );
};
