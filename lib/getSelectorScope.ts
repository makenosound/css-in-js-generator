const parseSelector = require("postcss-selector-parser").default;

export function getSelectorScope(selector: string): string[] {
  const selectorScope: string[] = [];

  parseSelector((nodes: any) => {
    for (const node of nodes.first.nodes) {
      if (node.type === "class") {
        selectorScope.push(node.toString());
      }
    }
  }).processSync(selector);

  return selectorScope.length > 0 ? selectorScope : ["root"];
}
