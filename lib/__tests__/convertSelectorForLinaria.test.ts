import { convertSelectorForLinaria } from "../convertSelectorForLinaria";

test("convertSelectorForLinaria", () => {
  [
    [
      [
        ".list-inline-item:not(:last-child)",
        ".list-inline-item",
        new Set(["root", ".list-inline-item"]),
      ],
      ["&:not(:last-child)", new Set()],
    ],
    [
      [
        ".no-gutters > .col",
        ".no-gutters",
        new Set(["root", ".no-gutters", ".col"]),
      ],
      ["& > .${col}", new Set(["col"])],
    ],
    [
      [
        ".alert-primary .alert-link",
        ".alert-primary",
        new Set(["root", ".alert-primary", ".alert-link"]),
      ],
      ["& .${alertLink}", new Set(["alertLink"])],
    ],
  ].forEach(([[selector, scope, knownScopes], convertedSelector]) => {
    expect(
      convertSelectorForLinaria(
        selector as string,
        scope as string,
        knownScopes as Set<string>
      )
    ).toEqual(convertedSelector);
  });
});
