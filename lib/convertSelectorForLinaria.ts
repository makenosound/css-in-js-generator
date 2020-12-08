const parseSelector = require("postcss-selector-parser");

import { convertScopeToModuleName } from "./convertScopeToModuleName";

export function convertSelectorForLinaria(
  selector: string,
  scope: string,
  knownScopes: Set<string>
): [string, Set<string>] {
  const convertedScopes = new Set<string>();
  const convertedSelector: string = parseSelector((nodes: any) => {
    nodes.first.walkClasses((node: any) => {
      if (node.toString() === scope) {
        node.toString = () => "&";
      } else if (knownScopes.has(node.toString())) {
        convertedScopes.add(convertScopeToModuleName(node.value));
        node.toString = () =>
          "${" + convertScopeToModuleName(node.value) + "}";
      }
    });
  }).processSync(selector);
  return [convertedSelector, convertedScopes];
}
