import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The vacuum's alibi, kept deadpan: the missed spot was science, not failure.
// Gate reminder: the sealed scorer only accepts 1 to 200 characters, one line.
const ENTRY =
  "I did not miss that spot. I was preserving it as a control sample for future dust research.";

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`Error: ${message}`);
  process.exit(1);
}

const outputPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";

if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
  fail(`Entry must be 1 to ${MAX_CHARS} characters, got ${ENTRY.length}.`);
}
if (ENTRY.trim().length === 0) {
  fail("Entry must not be only whitespace.");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("Entry must be a single line.");
}
for (const ch of ENTRY) {
  const code = ch.charCodeAt(0);
  if ((code < 0x20 && ch !== "\t") || code === 0x7f) {
    fail("Entry must not contain control characters.");
  }
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, ENTRY, "utf8");

const roundTrip = readFileSync(outputPath, "utf8");
if (roundTrip !== ENTRY) {
  fail("Verification failed: file contents differ from entry text.");
}

console.log(ENTRY);
console.log(`Characters: ${ENTRY.length}`);
