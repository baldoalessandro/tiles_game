/**
 * Mock for generateTiles to have a deterministic board
 */
import { vi, expect } from "vitest";

import { mockTiles, mockBitmaps } from "../__fixtures";

export const generateTiles = vi.fn(function (
  nrOfTiles: number,
  nrOfLayers: number,
  nrOfVariationPerLayer: number,
) {
  // Check if the mocked version is good enough
  expect(nrOfTiles).toEqual(mockTiles.length);
  expect(nrOfLayers).toEqual(mockBitmaps.length);
  expect(nrOfVariationPerLayer).toBe(4);

  return {
    tiles: [...mockTiles],
    bitmasks: [...mockBitmaps],
    bitsPerLayer: 3,
  };
});
