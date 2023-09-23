import { render, screen } from "@solidjs/testing-library";

import { Tile } from "./tile";

vi.mock("../game/generator");

describe("<Tile> component", () => {
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
    const props = {
      tile: 0b0_000_000_000,
      idx: 0,
      selected: true,
    };
    render(() => <Tile {...props} />);

    const $btn = screen.getByRole("button", { name: "Tile 1" });
    expect($btn).toBeInTheDocument();
    expect($btn.className).toContain("selected");
    expect($btn.className).toContain("empty");
  });
});
