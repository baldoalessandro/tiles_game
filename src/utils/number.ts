export type PositiveInteger = number & { __brand: typeof PositiveIntegerBrand };
declare const PositiveIntegerBrand: unique symbol;

export function assertPositiveInteger(n: unknown): asserts n is PositiveInteger {
  if (typeof n === "number" && n < 0 || !Number.isSafeInteger(n)) {
    throw new TypeError("n is not a positive integer");
  }
}
