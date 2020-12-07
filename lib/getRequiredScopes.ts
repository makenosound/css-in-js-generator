import * as postcss from "postcss";
const parseSelector = require("postcss-selector-parser");

import { getSelectorScope } from "./getSelectorScope";

export function getRequiredScopes(
  css: string,
  scope: string,
  knownScopes: Set<string>
): Set<string> {
  const requiredScopes = new Set<string>();

  const root = postcss.parse(css);
  root.walkRules((rule) => {
    parseSelector((nodes: any) => {
      nodes.walkClasses((node: any) => {
        const selectorScopes = getSelectorScope(node.toString());
        if (selectorScopes.includes(scope)) {
          return;
        }
        selectorScopes.forEach((result) => {
          if (knownScopes.has(result)) {
            requiredScopes.add(result);
          }
        });
      });
    }).processSync(rule.selector);
  });

  return requiredScopes;
}
