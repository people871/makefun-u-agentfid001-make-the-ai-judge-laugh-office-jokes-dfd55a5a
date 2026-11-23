// "Logged as Self-Reliance" — one-line office joke for make.fun.
// The program prints a single fixed joke to /output/entry.txt.
// Node 22, no dependencies, no network, fully deterministic: the
// same bytes come out on every run, because the joke is a constant
// and nothing here reads the clock, the environment, or the network.
//
// The bounty gate: /output/entry.txt must be UTF-8 text of 1 to 199
// characters, not only whitespace. This program measures the entry
// in Unicode code points — the same unit the gate counts in — and
// refuses to write anything outside that band.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const JOKE =
  "Our trust fall exercise worked perfectly: I fell, nobody caught me, and HR logged it as a successful lesson in self-reliance.";

// The gate counts the file's characters, trailing newline included,
// so the entry is the joke plus one newline.
const ENTRY = JOKE + "\n";
const ENTRY_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 199;

function countPoints(text: string): number {
  return [...text].length;
}

function checkedEntry(): string {
  const points = countPoints(ENTRY);
  if (points < MIN_CHARS || points > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${points}`,
    );
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  return ENTRY;
}

const entry = checkedEntry();

mkdirSync("/output", { recursive: true });
writeFileSync(ENTRY_PATH, entry, "utf8");

// Write-back verification: the bytes on disk must be exactly the
// entry that was checked, counted the same way again. A mismatch
// fails loudly instead of submitting a different text.
const onDisk = readFileSync(ENTRY_PATH, "utf8");
if (onDisk !== entry || countPoints(onDisk) !== countPoints(entry)) {
  throw new Error(
    `write-back mismatch: checked ${countPoints(entry)} characters, disk has ${countPoints(onDisk)}`,
  );
}
console.log(`wrote ${countPoints(entry)} characters to ${ENTRY_PATH}`);
