import { GameStateCtx, createGameStateStore } from "./game";
import { Board } from "./components/board";

export const Main = () => {
  const gameStateStore = createGameStateStore();

  return (
    <GameStateCtx.Provider value={gameStateStore}>
      <Board />
    </GameStateCtx.Provider>
  );
};
