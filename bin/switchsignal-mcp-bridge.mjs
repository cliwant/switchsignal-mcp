#!/usr/bin/env node

const endpoint =
  process.env.SWITCHSIGNAL_MCP_URL ??
  "https://switchsignal.grindworks.ai/api/mcp";
const token = process.env.SWITCHSIGNAL_MCP_KEY;
const timeoutMs = Number(process.env.SWITCHSIGNAL_MCP_TIMEOUT_MS ?? 30000);
const protocolVersion =
  process.env.SWITCHSIGNAL_MCP_PROTOCOL_VERSION ?? "2025-11-25";

let buffer = "";

function log(message) {
  process.stderr.write(`[switchsignal-mcp-bridge] ${message}\n`);
}

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function idsFromPayload(payload) {
  const messages = Array.isArray(payload) ? payload : [payload];
  return messages
    .filter((message) => message && Object.hasOwn(message, "id"))
    .map((message) => message.id ?? null);
}

function rpcError(id, code, message, data) {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      ...(data === undefined ? {} : { data }),
    },
  };
}

function writeTransportError(payload, code, message, data) {
  const ids = idsFromPayload(payload);
  if (ids.length === 0) return;
  const errors = ids.map((id) => rpcError(id, code, message, data));
  writeMessage(Array.isArray(payload) ? errors : errors[0]);
}

function parseServerSentEvents(text) {
  const events = [];
  for (const block of text.split(/\n\n+/)) {
    const data = block
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data || data === "[DONE]") continue;
    events.push(JSON.parse(data));
  }
  return events;
}

async function postToSwitchSignal(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "Mcp-Protocol-Version": protocolVersion,
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (response.status === 204) return;

    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();

    if (!response.ok) {
      writeTransportError(payload, -32000, `SwitchSignal MCP HTTP ${response.status}`, {
        body: text.slice(0, 2000),
      });
      return;
    }

    if (contentType.includes("text/event-stream")) {
      for (const event of parseServerSentEvents(text)) writeMessage(event);
      return;
    }

    writeMessage(JSON.parse(text));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "SwitchSignal MCP request failed";
    writeTransportError(payload, -32000, message);
  } finally {
    clearTimeout(timer);
  }
}

function handleLine(line) {
  if (!line.trim()) return;

  let payload;
  try {
    payload = JSON.parse(line);
  } catch {
    writeMessage(rpcError(null, -32700, "Parse error."));
    return;
  }

  void postToSwitchSignal(payload);
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() ?? "";
  for (const line of lines) handleLine(line);
});

process.stdin.on("end", () => {
  if (buffer.trim()) handleLine(buffer);
});

process.stdin.on("error", (error) => {
  log(`stdin error: ${error.message}`);
  process.exitCode = 1;
});

if (!token) {
  log(
    "SWITCHSIGNAL_MCP_KEY is not set; initialize works, protected tools will return Unauthorized."
  );
}
