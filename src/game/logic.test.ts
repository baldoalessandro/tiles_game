import { simplifyTiles, getLayersFromTile } from "./logic";

describe("simplfyTiles", () => {
  const bitmaks = [0b000_000_111, 0b000_111_000, 0b111_000_000] as const;

  it("returns [0,0] it the tiles are equals", () => {
    expect(simplifyTiles(4, 4, bitmaks)).toEqual([0, 0]);
  });

  it("returns [0,0] it the tiles both 0", () => {
    expect(simplifyTiles(0, 0, bitmaks)).toEqual([0, 0]);
  });

  it("removes common layers", () => {
    expect(simplifyTiles(0b001_011_010, 0b011_011_110, bitmaks)).toEqual([
      0b001_000_010, 0b011_000_110,
    ]);
  });
});

describe("getLayerFromTile", () => {
  const bitmaks = [0b000_000_111, 0b000_111_000, 0b111_000_000] as const;
  const bitsPerLayer = 3;

  it("extracts layers from the tile representation", () => {
    const cases = [
      [0, [0, 0, 0]],
      [0b001_001_001, [1, 1, 1]],
      [0b010_011_100, [4, 3, 2]],
      [0b011_010_101, [5, 2, 3]],
      [0b111_000_000, [0, 0, 7]],
    ] as const;
    cases.forEach((c) => {
      const [input, expected] = c;
      const res = getLayersFromTile(input, bitmaks, bitsPerLayer);
      expect(res).toEqual(expected);
    });
  });
});
