import { GameScore } from "./state";

/**
 * Given two tiles it simplifies them removing the common layers
 */
export function simplifyTiles(
  t1: number,
  t2: number,
  bitmasks: readonly number[],
): readonly [number, number] {
  const commonLayerMask = ~bitmasks.reduce((acc, mask) => {
    const tl1 = t1 & mask;
    const tl2 = t2 & mask;
    return acc ^ ((tl1 ^ tl2) === 0 ? mask : 0);
  }, 0);

  return [t1, t2].map((t) => t & commonLayerMask) as [number, number];
}

/**
 * Get the layers from the tile representation
 */
export function getLayersFromTile(
  tile: number,
  bitmasks: readonly number[],
  bitsPerLayer: number,
) {
  return bitmasks.map((m, idx) => (m & tile) >> (idx * bitsPerLayer));
}

/**
 * Check if a move is invalid or not
 */
export function isInvalidMove(
  tile1Idx: number,
  tile2Idx: number,
  tile2Value: number,
): boolean {
  return tile1Idx === tile2Idx || tile2Value === 0;
}

/**
 * Compute the score of a move.
 * To score a move we can use the old/new value of the first tile involved
 * in the move. If the move started on an empty tile => keep the current score.
 */
export function scoreMove(
  oldTileValue: number,
  newTileValue: number,
  score: GameScore,
): GameScore {
  if (oldTileValue === 0) {
    return score;
  }
  const goodMove = oldTileValue !== newTileValue;
  const s = goodMove ? score.currentRunLen + 1 : 0;

  return {
    currentRunLen: s,
    highestRunLen: Math.max(score.highestRunLen, s),
    errors: score.errors + (goodMove ? 0 : 1),
  };
}

export function isTileEmpty(tile: number): boolean {
  return tile === 0;
}
