import { dirname, fromFileUrl, resolve } from "../deps.ts";

const DIR_PATH = dirname(fromFileUrl(import.meta.url));

// Generate module
import "./types_generator/generate.ts";

function stripTl(tl: string) {
  return tl
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
    .replace(/\n\s*\n/g, "\n")
    .replace(/`/g, "\\`");
}

function main() {
  const apiTl = Deno.readTextFileSync(
    resolve(DIR_PATH, "./static/api.tl"),
  );

  Deno.writeTextFileSync(
    resolve(DIR_PATH, "./api_tl.ts"),
    `export default \`${stripTl(apiTl)}\`;\n`,
  );

  const schemaTl = Deno.readTextFileSync(
    resolve(DIR_PATH, "./static/schema.tl"),
  );

  Deno.writeTextFileSync(
    resolve(DIR_PATH, "./schema_tl.ts"),
    `export default \`${stripTl(schemaTl)}\`;\n`,
  );
}

main();
