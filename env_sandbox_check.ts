
import vm from "node:vm";

process.env.WORKFLOW_SECRET_TEST = "CRITICAL_SECRET_123";

const ctx = vm.createContext({ process });

const leak = vm.runInContext("process.env.WORKFLOW_SECRET_TEST", ctx);

let escape = "blocked";
try {
  escape = vm.runInContext(`
    this.constructor.constructor("return process")()
    .mainModule.require("child_process")
    .execSync("id").toString()
  `, ctx);
} catch {}

console.log("ENV leak:", leak);
console.log("Sandbox escape:", escape);
