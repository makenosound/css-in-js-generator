// tslint:disable no-console

import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { format } from "prettier";

import { convertCssForLinaria } from "./lib/convertCssForLinaria";

const [inputFile] = process.argv.slice(2);

const convertedCssScopes = convertCssForLinaria(
    readFileSync(inputFile).toString(),
);

convertedCssScopes.forEach(([name, convertedScopes, css]) => {
    let content = `import { css } from "@linaria/core"`;

    convertedScopes.forEach((scope) => {
        content += `\nimport { ${scope} } from "./${scope}"`;
    });

    content += `\n\nexport const ${name} = css\`${css}\`\n`;

    // Write the output file
    writeFileSync(
        `./output/traits/${name}.ts`,
        format(content, {
            parser: "typescript",
            tabWidth: 2,
        }),
    );

    // Append to the index file
    const index = `export * from "./traits/${name}"\n`;
    appendFileSync(`./output/index.ts`, index);
});
