// 打包开发环境
import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { context } from "esbuild";
import { createRequire } from "node:module";
const __dirname = resolve(fileURLToPath(import.meta.url), "../");
const {
  values: { format },
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    format: {
      type: "string",
      default: "esm",
      short: "f",
    },
  },
});
const require = createRequire(import.meta.url);
const target = positionals[0] || "vue";
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`);
const pkg = require(`../packages/${target}/package.json`);
console.log(pkg);

context({
  entryPoints: [entry],
  outfile,
  format,
  platform: format === "cjs" ? "node" : "browser",
  bundle: true,
  sourcemap: true,
  globalName: pkg.buildOptions?.name,
}).then((ctx) => ctx.watch());

console.log(format, positionals);
