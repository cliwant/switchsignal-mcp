import fs from "node:fs";
import { spawn } from "node:child_process";

JSON.parse(fs.readFileSync("mcp.json", "utf8"));
JSON.parse(fs.readFileSync("examples/tool-calls.json", "utf8"));

const child = spawn(process.execPath, ["bin/switchsignal-mcp-bridge.mjs"], {
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, SWITCHSIGNAL_MCP_KEY: "" },
});

let stderr = "";
child.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

child.stdin.end(
  `${JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} })}\n`
);

setTimeout(() => {
  child.kill();
  if (!stderr.includes("SWITCHSIGNAL_MCP_KEY is not set")) {
    throw new Error("Bridge did not report missing key guidance.");
  }
  console.log("switchsignal-mcp public smoke ok");
}, 500);
