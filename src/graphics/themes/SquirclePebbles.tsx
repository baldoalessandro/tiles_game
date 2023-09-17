import { TilesetTheme, genID } from "..";

const theme: TilesetTheme = {
  name: "Squircle Pebbles",
  screenBgColor: "#d8d8d8",
  boardBgColors: ["#eee", "#ececec"],
  numberOfLayers: 3,
  numberOfVariations: 6,
  generateSprites() {
    console.log("generate sprites");
    
    // Colors used for the variants
    const colors = ["#d62b72", "#24b576", "#6d4ad7", "#e6a80b", "#25cbcb", "#212dd8"] as const;

    // viewBox for the different layers
    const viewBoxes = [
      "-4 -4 136 136",
      "-40 -60 208 208",
      "-140 -200 408 408",
    ] as const;

    return Array.from(
      { length: theme.numberOfLayers * theme.numberOfVariations },
      (_, idx) => {
        const l = Math.trunc((idx / theme.numberOfVariations));
        const v = (idx % theme.numberOfVariations);

        return (
          <symbol id={genID(l, v + 1)} viewBox={viewBoxes[l]}>
            <path
              d="M 0 64 C 0 0, 0 0, 64 0S 128 0, 128 64, 128 128 64 128, 0 128, 0 64"
              transform="rotate(0,64,64)translate(0,0)"
              fill={colors[v]}
            />
          </symbol>
        );
      }
    );
  },
};

export default theme;
