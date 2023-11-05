import { cleanup, render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";

import { Won } from "./won";
import { GameStateCtx, createGameStateStore } from "../game/state";

const user = userEvent.setup();

describe("Won screen", () => {
  let ctxValue: ReturnType<typeof createGameStateStore>;

  afterEach(async () => {
    await cleanup();
  });

  beforeEach(() => {
    ctxValue = {
      state: {
        score: { errors: 0, currentRunLen: 18, highestRunLen: 18 },
        ended: false,
        tiles: [],
      },
      reset: vi.fn(),
      select: vi.fn(),
      getLayers: vi.fn(),
      isTileEmpty: vi.fn(),
    };
  });

  it("shows the game score", () => {
    const value: ReturnType<typeof createGameStateStore> = {
      ...ctxValue,
      state: {
        ...ctxValue.state,
        score: {
          errors: 2,
          currentRunLen: 4,
          highestRunLen: 16,
        },
      },
    };
    render(() => (
      <GameStateCtx.Provider value={value}>
        <Won />
      </GameStateCtx.Provider>
    ));

    expect(screen.getByText(/You won/)).toBeInTheDocument();
    expect(screen.getByText("Number of chains: 3")).toBeInTheDocument();
    expect(screen.getByText("Longest chain: 16")).toBeInTheDocument();
  });

  it("allows to reset the game", async () => {
    render(() => (
      <GameStateCtx.Provider value={ctxValue}>
        <Won />
      </GameStateCtx.Provider>
    ));

    expect(screen.getByText(/You won/)).toBeInTheDocument();
    expect(ctxValue.reset).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "New game" }));

    expect(ctxValue.reset).toHaveBeenCalled();
  });

  it("tells the users if they had a perfect game", () => {
    render(() => (
      <GameStateCtx.Provider value={ctxValue}>
        <Won />
      </GameStateCtx.Provider>
    ));

    expect(screen.getByText(/You won/)).toBeInTheDocument();
    expect(screen.getByText(/perfect/i)).toBeInTheDocument();
    expect(screen.getByText("Number of chains: 1")).toBeInTheDocument();
    expect(screen.getByText("Longest chain: 18")).toBeInTheDocument();
  });
});
