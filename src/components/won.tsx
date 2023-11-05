import { Component } from "solid-js";

import cls from "./won.module.css";
import { useGameState } from "../game/state";

export const Won: Component = () => {
  const { state, reset } = useGameState();

  return (
    <main class={cls.won}>
      <span class={cls.cup} aria-hidden>
        🏆
      </span>
      <h1>You won!</h1>
      <p>Number of chains: {state.score.errors + 1}</p>
      <p>Longest chain: {state.score.highestRunLen}</p>
      <button onClick={() => reset()} class={cls.newGame}>
        New game
      </button>
    </main>
  );
};
