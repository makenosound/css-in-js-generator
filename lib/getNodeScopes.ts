import * as postcss from "postcss";

import { getSelectorScope } from "./getSelectorScope";

export function getNodeScopes(node: postcss.Node): Set<string> {
    const nodeScopes = new Set();

    if (
        node.type === "rule" &&
        (node.parent.type !== "atrule" ||
            /keyframes/.test(node.parent.name) === false)
    ) {
        (node.selectors || []).forEach((selector) => {
            getSelectorScope(selector).forEach(
                (result) => nodeScopes.add(result),
            );
        });
    } else if (
        node.type === "atrule" &&
        /keyframes$/.test(node.name) === false
    ) {
        node.walkRules((rule) => {
            (rule.selectors || []).forEach((selector) => {
                getSelectorScope(selector).forEach(
                    (result) => nodeScopes.add(result),
                );
            });
        });
    }

    if (nodeScopes.size === 0) {
        nodeScopes.add("root");
    }

    return nodeScopes;
}
