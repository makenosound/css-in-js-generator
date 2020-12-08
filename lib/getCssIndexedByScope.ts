import * as postcss from "postcss";
const Stringifier = require("postcss/lib/stringifier");

import { getNodeScopes } from "./getNodeScopes";
import { getSelectorScope } from "./getSelectorScope";

function prepassTailwindSelectors(css: string): string {
  return (
    css
      // .\32xl\:rule -> .2xl\:rule
      .replace(/\.\\3/g, ".")
      // something\:rule -> .something-rule
      .replace(/\\:/g, "-")
      // .rule-0\.5 -> .rule-0dot5
      .replace(/([a-z]\-\d+)\\\.(\d+)/g, "$1dot$2")
      // .rule-1\/3 -> .rule-1of3
      .replace(/([a-z]\-\d+)\\\/(\d+)/g, "$1of$2")
  );
}

export function getCssIndexedByScope(css: string): Map<string, string> {
  css = prepassTailwindSelectors(css);
  const cssIndexedByScope = new Map();

  const scopesStack = [new Set(["root"])];

  function builder(
    output: string,
    node?: postcss.Node,
    flag?: "start" | "end",
  ) {
    if (flag === "start" && node) {
      scopesStack.push(getNodeScopes(node));
    }

    if (flag === "end") {
      output += "\n\n";
    }

    scopesStack[scopesStack.length - 1].forEach((scope) => {
      if (cssIndexedByScope.has(scope) === false) {
        cssIndexedByScope.set(scope, "");
      }

      if (
        flag === "start" &&
        node &&
        node.type === "rule" &&
        (node.parent.type !== "atrule" ||
          /keyframes$/.test(node.parent.name) === false)
      ) {
        output = `${(node.selectors || []).filter((selector) =>
          getSelectorScope(selector).includes(scope),
        )} {`;
      }

      cssIndexedByScope.set(scope, cssIndexedByScope.get(scope) + output);
    });

    if (flag === "end") {
      scopesStack.pop();
    }
  }

  (new Stringifier(builder) as postcss.Stringifier).stringify(
    postcss.parse(css),
  );

  // To ensure that we don’t repeat nested class rules, we need to reparse the
  // CSS and remove the rules where the _scope_ is the top-level classScope
  // and there is more than one classScope
  cssIndexedByScope.forEach((css: string, scope: string) => {
    const parsed = postcss.parse(css);
    parsed.walkRules((rule) => {
      const { selector } = rule;
      const classScopes = getSelectorScope(selector);
      if (classScopes.length > 1 && classScopes[0] === scope) {
        rule.remove()
      }
    });

    cssIndexedByScope.set(scope, parsed.toString())
  });

  return cssIndexedByScope;
}
