import { cleanup, render, screen } from "@solidjs/testing-library";

import { Tile } from "./tile";

vi.mock("../game/generator");

describe("<Tile> component", () => {
  afterEach(async () => {
    await cleanup();
  });

  it("renders", () => {
    const props = {
      tile: 0b0_010_001_001,
      idx: 0,
      selected: false,
      error: false,
    };
    render(() => <Tile {...props} />);

    expect(screen.getByRole("button", { name: "Tile 1" })).toBeInTheDocument();
  });

  it("renders a selected tile", () => {
    const props = {
      tile: 0b0_010_001_001,
      idx: 0,
      selected: true,
      error: false,
    };
    render(() => <Tile {...props} />);

    const $btn = screen.getByRole("button", { name: "Tile 1" });
    expect($btn).toBeInTheDocument();
    expect($btn.className).toContain("selected");
    expect($btn.className).not.toContain("empty");
  });

  it("renders a tile with error", () => {
    const props = {
      tile: 0b0_010_001_001,
      idx: 0,
      selected: true,
      error: true,
    };
    render(() => <Tile {...props} />);

    const $btn = screen.getByRole("button");
    expect($btn).toBeInTheDocument();
    expect($btn.className).toContain("selected");
    expect($btn.className).not.toContain("empty");
    expect(screen.getByText(/no match/)).toBeInTheDocument();
  });

  it("renders a tile with error only if selected", () => {
    const props = {
      tile: 0b0_010_001_001,
      idx: 0,
      selected: false,
      error: true,
    };
    render(() => <Tile {...props} />);

    const $btn = screen.getByRole("button");
    expect($btn).toBeInTheDocument();
    expect($btn.className).not.toContain("selected");
    expect($btn.className).not.toContain("empty");
    expect(screen.queryByText(/no match/)).not.toBeInTheDocument();
  });

  it("renders an empty tile", () => {
    const props = {
      tile: 0b0_000_000_000,
      idx: 0,
      selected: false,
      error: true,
    };
    render(() => <Tile {...props} />);

    const $btn = screen.getByRole("button", { name: "Tile 1" });
    expect($btn).toBeInTheDocument();
    expect($btn.className).not.toContain("selected");
    expect($btn.className).toContain("empty");
  });

  it("renders a selected empty tile", () => {
    const props = {
      tile: 0b0_000_000_000,
      idx: 0,
      selected: true,
      error: true,
    };
    render(() => <Tile {...props} />);

    const $btn = screen.getByRole("button");
    expect($btn).toBeInTheDocument();
    expect($btn.className).toContain("selected");
    expect($btn.className).toContain("empty");
    expect(screen.getByText(/go anywhere/)).toBeInTheDocument();
  });
});
