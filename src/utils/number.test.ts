import { expectTypeOf } from "vitest";
import { assertPositiveInteger } from "./number";

describe("assertPositiveInteger", () => {
  /* eslint-disable-next-line vitest/expect-expect --
   * The ESLint vitest plugin doesn't recognize `expectTypeOf` as an assertion
   * for the moment :-/
   **/
  it("creates a PositiveInteger when the argument is a positive integer", () => {
    const n: unknown = 42;
    assertPositiveInteger(n);

    expectTypeOf(n).not.toEqualTypeOf(42);
  });

  it("throws an error if a PositiveInteger cannot be contructed from the input", () => {
    [-2, 3.14].forEach((n) => {
      expect(() => assertPositiveInteger(n)).toThrow(/not a positive integer/i);
    });
  });
});
