import { getSelectorScope } from "../getSelectorScope";

const fixtures: Array<[string, string[]]> = [
  ["*::before", ["root"]],
  [".list-inline-item:not(:last-child)", [".list-inline-item"]],
  [".no-gutters > .col", [".no-gutters", ".col"]],
  ["abbr[title]", ["root"]],
  ["h1", ["root"]],
  ['[role="button"]', ["root"]],
  ["a.bg-primary:focus", [".bg-primary"]],
]

test("getSelectorScope", () => {
  fixtures.forEach(([selector, selectorScope]) => {
    expect(getSelectorScope(selector)).toEqual(selectorScope);
  });
});
