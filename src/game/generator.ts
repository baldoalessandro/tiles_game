import arrayShuffle from "array-shuffle";
import { PositiveInteger, assertPositiveInteger } from "../utils/number";

// NOTE at the moment we use a number to store a tile.
// Bitwise operations in JS only take into account the 32 least significat bits
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#bitwise_operators
// If we change the tiles storage from number[] to a TypedArray then this could
// change to allow more variance.
const BITS_PER_TILE = 32 as const;

/**
 * Create a new tile-board for the game.
 *
 * The total number of tiles should be an even number.
 * Different tile rendering styles can have a different number of layers and
 * a different number of variations for each layer.
 * The tiles must be created in a way that guarantees the puzzle solvability,
 * so variations for each layer appear in pairs.
 *
 * This function will throw an error if the number of layers with the given
 * variability cannot be accomodated in the underlying storage.
 */

export function generateTiles(
  nrOfTiles: number,
  nrOfLayers: number,
  nrOfVariationPerLayer: number,
): { tiles: number[]; bitmasks: number[]; bitsPerLayer: number } {
  assertPositiveInteger(nrOfTiles);
  assertPositiveInteger(nrOfLayers);
  assertPositiveInteger(nrOfVariationPerLayer);

  if (nrOfTiles % 2 !== 0) {
    throw Error("Total number of tiles must be an even number!");
  }
  ensureTileVariabilityCanFitStorage(nrOfLayers, nrOfVariationPerLayer);

  const bitsPerLayer = Math.ceil(Math.log2(nrOfVariationPerLayer + 1));
  assertPositiveInteger(bitsPerLayer);

  const bitmasks = generateBitmasks(bitsPerLayer, nrOfLayers);

  const tiles = Array.from({ length: nrOfLayers }, (_, idx) =>
    createRandomLayer(nrOfVariationPerLayer, nrOfTiles).map(
      (t) => t << (idx * bitsPerLayer),
    ),
  ).reduce((acc, layer) => acc.map((v, idx) => (v |= layer[idx])));

  return { tiles, bitmasks, bitsPerLayer };
}

function ensureTileVariabilityCanFitStorage(
  nrOfLayers: PositiveInteger,
  nrOfVariationPerLayer: PositiveInteger,
) {
  const maxAvailableBitsPerLayer = Math.floor(BITS_PER_TILE / nrOfLayers);
  const maxRepresentableVariationPerLayer =
    // NOTE: 2^n - 1 - 1 because we need to exclude the 0
    // which represents an empty tile
    Math.pow(2, maxAvailableBitsPerLayer) - 2;
  if (nrOfVariationPerLayer > maxRepresentableVariationPerLayer) {
    throw new RangeError(
      `The combination of layers=${nrOfLayers} and variations=
      ${nrOfVariationPerLayer} exceeds the available bits for
      each tile.`,
    );
  }
}

/**
 * Given a `nrOfBits` for the base mask, returns an array of `nrOfShifts` of
 * all the right-aligned non overllapping bitmaks.
 */
export function generateBitmasks(
  nrOfBits: number,
  nrOfShifts: number,
): number[] {
  return Array.from(
    { length: nrOfShifts },
    (_, idx) => (Math.pow(2, nrOfBits) - 1) << (idx * nrOfBits),
  );
}

/**
 * PRECONDITION: `len` must be an even number!
 */
export function createRandomLayer(variations: number, len: number): number[] {
  return arrayShuffle(createLayer(variations, len));
}

export function createLayer(variations: number, len: number): number[] {
  return Array.from({ length: len }, (_, idx) => {
    return (((idx / 2) >> 0) % variations) + 1;
  });
}
