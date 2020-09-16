import { createRequire } from "module";
const require = createRequire(import.meta.url);

let keys
if (process.env.NODE_ENV === "production") {
  keys = require("./keys_prod.cjs")
} else {
  keys = require("./keys_dev.cjs");
}

export default keys;
