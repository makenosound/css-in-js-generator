import { convertScopedCssForLinaria } from "./convertScopedCssForLinaria";
import { convertScopeToModuleName } from "./convertScopeToModuleName";
import { getCssIndexedByScope } from "./getCssIndexedByScope";
import { getRequiredScopes } from "./getRequiredScopes";

type Scope = [
    string,
    Set<string>,
    string
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
        }, new Set<string>());

    sortedKnownScopes.forEach((scope) => {
        let outputCSS = "";
        const [convertedScopedCssForLinaria, convertedScopes] = convertScopedCssForLinaria(
            cssIndexedByScope.get(scope) as string,
            scope,
            knownScopes,
        );

        const scopeName = scope === "root" ? "global" : convertScopeToModuleName(scope);

        if (convertedScopedCssForLinaria.trim() !== "") {
            if (scope === "root") {
                outputCSS = `:global() {\n${convertedScopedCssForLinaria}\n}`;
            } else {
                outputCSS += convertedScopedCssForLinaria;
            }

            outputScopes.push([
                scopeName,
                convertedScopes,
                outputCSS,
            ]);
        }
    });

    return outputScopes;
}
