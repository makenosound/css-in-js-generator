import { convertScopedCssForLinaria } from "../convertScopedCssForLinaria";

const fixtures: Array<
  [[string, string, Set<string>], [string, Set<string>]]
> = [
  [
    [
      `@media print {
    .badge {
        border: 1px solid #000;
    }
}

.badge {
    display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
}

.badge:empty {
    display: none;
}

.badge::before {
    content: "\\2014 \\00A0";
}`,
      ".badge",
      new Set<string>(["root", ".badge"]),
    ],
    [
      `@media print {
    & {
        border: 1px solid #000;
    }
}


    display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;


&:empty {
    display: none;
}

&::before {
    content: "\\\\2014 \\\\00A0";
}`,
      new Set<string>(),
    ],
  ],
  [
    [
      `.alert-primary {
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
}

.alert-primary hr {
    border-top-color: #9fcdff;
}

.alert-primary .alert-link {
    color: #002752;
}
`,
      ".alert-primary",
      new Set<string>(["root", ".alert-primary", ".alert-link"]),
    ],
    [
      `
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;


& hr {
    border-top-color: #9fcdff;
}

& \${alertLink} {
    color: #002752;
}
`,
      new Set<string>(["alertLink"]),
    ],
  ],
];

test("convertScopedCssForLinaria", () => {
  fixtures.forEach(([[scopedCss, scope, knownScopes], [expectedCSS, expectedMatchedScopes]]) => {
    const [convertedCSS, matchedScopes] = convertScopedCssForLinaria(
      scopedCss,
      scope,
      knownScopes,
    );

    expect(convertedCSS).toEqual(expectedCSS);
    expect(matchedScopes).toEqual(expectedMatchedScopes);
  });
});
