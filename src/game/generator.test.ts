import {
  generateTiles,
  createRandomLayer,
  generateBitmasks,
} from "./generator";

describe("generateTiles", () => {
  it("can only generate an even number of tiles", () => {
    expect(() => {
      generateTiles(3, 3, 3);
    }).toThrowError(/must be an even number/);
  });

  it("can only generate tiles for reasonable args", () => {
    expect(() => {
      generateTiles(16, 1024, 4);
    }).toThrowError(/exceeds the available bits/);

    expect(() => {
      generateTiles(16, 4, 4096);
    }).toThrowError(/exceeds the available bits/);
  });

  it("generates a solvable tileset of given length", () => {
    const { tiles } = generateTiles(16, 4, 4);
    expect(tiles).toHaveLength(16);

    const isNonZeroInteger = (n: number) => Number.isSafeInteger(n) && n > 0;
    tiles.forEach((t) => {
      expect(t).toSatisfy(isNonZeroInteger);
    });

    // In order to guarantee the solvability of the puzzle
    // each variation should appear an even number of times
    // This implies that when XORing together all the tiles
    // we should get 0.
    const res = tiles.reduce((acc, t) => acc ^ t, 0);
    expect(res).toBe(0);
  });

  it("returns the bitmasks and info required to access each layer", () => {
    const nrOfLayer = 4;
    const nrOfVariation = 2;
    const { bitmasks, bitsPerLayer } = generateTiles(
      2,
      nrOfLayer,
      nrOfVariation,
    );

    expect(bitmasks).toHaveLength(nrOfLayer);

    const expectedBitsPerLayer = Math.ceil(Math.log2(nrOfVariation + 1));
    expect(bitsPerLayer).toEqual(expectedBitsPerLayer);
    expect(bitmasks).toEqual(generateBitmasks(expectedBitsPerLayer, nrOfLayer));
  });
});

describe("generateBitmasks", () => {
  it("generates the right number of masks", () => {
    const masks = generateBitmasks(2, 4);
    expect(masks).toHaveLength(4);
  });

  it("generates non overlapping masks", () => {
    const masks = generateBitmasks(3, 4);
    expect(masks).toHaveLength(4);
    const res = masks.reduce((acc, m) => (acc ^= m), 0);
    expect(res.toString(2).padStart(32, "0")).toMatch(/^0*1{12}$/);
  });

  it("generates all the masks needed to access each layer", () => {
    const masks = generateBitmasks(3, 4);

    const expected = [
      "000000000111",
      "000000111000",
      "000111000000",
      "111000000000",
    ].map((s) => Number.parseInt(s.padStart(32, "0"), 2));

    expect(masks).toEqual(expected);
  });
});

describe("createRandomLayer", () => {
  it("creates an array with NUMBER_OF_TILES ÷ 2 couple of variantions", () => {
    const res = createRandomLayer(4, 16);
    expect(res).toHaveLength(16);

    expect(res.filter((v) => v === 1)).toHaveLength(4);
    expect(res.filter((v) => v === 2)).toHaveLength(4);
    expect(res.filter((v) => v === 3)).toHaveLength(4);
    expect(res.filter((v) => v === 4)).toHaveLength(4);

    expect(res.sort()).toEqual([
      1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
    ]);
  });

  it("works also with an odd number of variantions", () => {
    const res = createRandomLayer(3, 16);
    expect(res).toHaveLength(16);

    expect(res.filter((v) => v === 1)).toHaveLength(6);
    expect(res.filter((v) => v === 2)).toHaveLength(6);
    expect(res.filter((v) => v === 3)).toHaveLength(4);

    expect(res.sort()).toEqual([
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
    ]);
  });
});
