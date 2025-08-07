// 打包开发环境
import { parseArgs } from "node:util";
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

console.log(format, positionals);
