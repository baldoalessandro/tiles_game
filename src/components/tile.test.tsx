import { cleanup, render, screen } from "@solidjs/testing-library";

import { Tile } from "./tile";
import { createSignal } from "solid-js";

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
    };
    render(() => <Tile {...props} />);

    expect(screen.getByRole("button", { name: "Tile 1" })).toBeInTheDocument();
  });

  it("renders a selected tile", () => {
    const props = {
      tile: 0b0_010_001_001,
      idx: 0,
      selected: true,
    };
    render(() => <Tile {...props} />);

    const $btn = screen.getByRole("button", { name: "Tile 1" });
    expect($btn).toBeInTheDocument();
    expect($btn.className).toContain("selected");
    expect($btn.className).not.toContain("empty");
  });

  it("renders an empty tile", () => {
    const [selected, setSelcted] = createSignal(false);

    render(() => <Tile idx={0} tile={0b0_000_000_000} selected={selected()} />);

    let $btn = screen.getByRole("button", { name: "Tile 1" });
    expect($btn).toBeInTheDocument();
    expect($btn.className).not.toContain("selected");
    expect($btn.className).toContain("empty");

    setSelcted(true);

    $btn = screen.getByRole("button");
    expect($btn).toBeInTheDocument();
    expect($btn.className).toContain("selected");
    expect($btn.className).toContain("empty");
    expect(screen.getByText(/go anywhere/)).toBeInTheDocument();
  });
});
