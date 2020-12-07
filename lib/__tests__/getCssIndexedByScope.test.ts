import { getCssIndexedByScope } from "../getCssIndexedByScope";

test("getCssIndexedByScope", () => {
  const cssIndexedByScope = getCssIndexedByScope(`/*! Copyright 2017 Acme, Inc. */
    @media print {
        *,
        *::before,
        *::after {
            text-shadow: none !important;
            box-shadow: none !important;
        }

        pre {
            white-space: pre-wrap !important;
        }
        .navbar {
            display: none;
        }
    }

    @-ms-viewport {
        width: device-width;
    }

    h1, .h1 {
        font-size: 2.5rem;
    }

    .parentClass .nestedClass {
        content: "nested";
    }

    p {
      content: "p";
    }

    .group {
      content: "group";
    }

    .group:hover .group-inner {
      content: "group-hover-group-inner";
    }
    .group .group-inner {
      content: "group-group-inner";
    }

    pre {
        display: block;
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 90%;
        color: #212529;
    }

    .container {
        margin-right: auto;
        margin-left: auto;
        padding-right: 15px;
        padding-left: 15px;
        width: 100%;
    }

    @media (min-width: 576px) {
        .container {
            max-width: 540px;
        }
    }

    @keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
        0%,
        68.2% {
            -webkit-transform: scaleX(0);
            transform: scaleX(0);
        }

        68.2% {
            -webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1);
            animation-timing-function: cubic-bezier(0, 0, 0, 1);
        }

        100% {
            -webkit-transform: scaleX(1);
            transform: scaleX(1);
        }
    }
  `);

  cssIndexedByScope.forEach((css, scope) => {
    cssIndexedByScope.set(scope, css.replace(/^\s+$/gm, ""));
  });

  expect(cssIndexedByScope).toEqual(
    new Map([
      [
        ".navbar",
        `@media print {

        .navbar {
            display: none;
        }

    }
`,
      ],
      [
        ".h1",
        `.h1 {
        font-size: 2.5rem;
    }
`,
      ],
      [
        ".nestedClass",
        `.parentClass .nestedClass {
        content: \"nested\";
    }
`
      ],
      [
        ".parentClass",
        `.parentClass .nestedClass {
        content: \"nested\";
    }
`
      ],
      [
        ".container",
        `.container {
        margin-right: auto;
        margin-left: auto;
        padding-right: 15px;
        padding-left: 15px;
        width: 100%;
    }

@media (min-width: 576px) {
        .container {
            max-width: 540px;
        }

    }
`,
      ],
      [
        ".group",
        `.group {
      content: \"group\";
    }

.group:hover .group-inner {
      content: \"group-hover-group-inner\";
    }

.group .group-inner {
      content: \"group-group-inner\";
    }
`
      ],
      [".group-inner", `.group:hover .group-inner {
      content: \"group-hover-group-inner\";
    }

.group .group-inner {
      content: \"group-group-inner\";
    }
`],
      [
        "root",
        `/*! Copyright 2017 Acme, Inc. */
    @media print {
        *,*::before,*::after {
            text-shadow: none !important;
            box-shadow: none !important;
        }

        pre {
            white-space: pre-wrap !important;
        }

    }

    @-ms-viewport {
        width: device-width;
    }

    h1 {
        font-size: 2.5rem;
    }

    p {
      content: \"p\";
    }

    pre {
        display: block;
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 90%;
        color: #212529;
    }

    @keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
        0%,
        68.2% {
            -webkit-transform: scaleX(0);
            transform: scaleX(0);
        }

        68.2% {
            -webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1);
            animation-timing-function: cubic-bezier(0, 0, 0, 1);
        }

        100% {
            -webkit-transform: scaleX(1);
            transform: scaleX(1);
        }

    }
`,
      ]
    ]),
  );
});
