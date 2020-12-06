import { convertScopedCssForLinaria } from "./convertScopedCssForLinaria";
import { convertScopeToModuleName } from "./convertScopeToModuleName";
import { getCssIndexedByScope } from "./getCssIndexedByScope";
import { getRequiredScopes } from "./getRequiredScopes";

type Scope = [
    name: string,
    output: string
];

export function convertCssForLinaria(css: string): Scope[] {
    const outputScopes: Scope[] = [];
    const cssIndexedByScope = getCssIndexedByScope(css);

    const knownScopes = new Set([...cssIndexedByScope.keys()]);

    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
    });

    const sortedKnownScopes = [...knownScopes]
        .sort((scopeA, scopeB) => {
            if (scopeA === "root") {
                return -1;
            }

            return collator.compare(scopeA, scopeB);
        })
        .reduce((previousSortedKnownScopes: Set<string>, knownScope) => {
            getRequiredScopes(
                cssIndexedByScope.get(knownScope) as string,
                knownScope,
                knownScopes,
            ).forEach((requiredScope) => {
                if (previousSortedKnownScopes.has(requiredScope) === false) {
                    previousSortedKnownScopes.add(requiredScope);
                }
            });

            if (previousSortedKnownScopes.has(knownScope) === false) {
                previousSortedKnownScopes.add(knownScope);
            }

            return previousSortedKnownScopes;
        }, new Set());

    sortedKnownScopes.forEach((scope) => {
        let outputCSS = "";
        const convertedScopedCssForEmotion = convertScopedCssForLinaria(
            cssIndexedByScope.get(scope) as string,
            scope,
            knownScopes,
        );

        const scopeName = scope === "global" ? "root" : convertScopeToModuleName(scope);

        if (convertedScopedCssForEmotion.trim() !== "") {
            if (scope === "root") {
                outputCSS = `:global() {\n${convertedScopedCssForEmotion}\n}`;
            } else {
                outputCSS += convertedScopedCssForEmotion;
            }

            outputScopes.push([
                scopeName,
                outputCSS,
            ]);
        }
    });

    return outputScopes;
}
