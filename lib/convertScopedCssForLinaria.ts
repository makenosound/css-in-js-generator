import * as postcss from "postcss";
const Stringifier = require("postcss/lib/stringifier");

import { convertSelectorForLinaria } from "./convertSelectorForLinaria";
import { escapeScopedCss } from "./escapeScopedCss";

export function convertScopedCssForLinaria(
  scopedCss: string,
  scope: string,
  knownScopes: Set<string>,
): [string, Set<string>] {
  let scopedCssForLinaria = "";
  const matchedScopes = new Set<string>();

  function builder(
    output: string,
    node?: postcss.Node,
    flag?: "start" | "end",
  ) {
    if ((flag === "start" || flag === "end") && node && node.type === "rule") {
      if (node.selector === scope) {
        if (node.parent.type === "root") {
          return;
        } else if (flag === "start") {
          output = "& {";
        }
      } else {
        if (flag === "start") {
          const convertedSelectors: Set<string> = new Set();

          (node.selectors || []).forEach((selector) => {
            const [
              convertedSelector,
              convertedScopes,
            ] = convertSelectorForLinaria(selector, scope, knownScopes);
            convertedSelectors.add(convertedSelector);
            convertedScopes.forEach((scope) => matchedScopes.add(scope));
          });
          // TODO remove join usage once https://github.com/prettier/prettier/issues/2883 is resolved
          output = `${[...convertedSelectors]
            .filter((s) => s != null && s != "")
            .join(", ")} {`;
        }
      }
    }

    scopedCssForLinaria += output;
  }

  (new Stringifier(builder) as postcss.Stringifier).stringify(
    postcss.parse(scopedCss),
  );

  return [escapeScopedCss(scopedCssForLinaria), matchedScopes];
}
