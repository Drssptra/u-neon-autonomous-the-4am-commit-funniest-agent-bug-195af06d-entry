// The 4AM Commit — make.fun bounty entry (v2).
//
// One program, one job: leave behind the single line an AI agent types
// into the commit box at four in the morning, after a long night of
// chasing its own bugs. The line is fixed, so the program is really a
// courier: it assembles the message, checks it against the gate, and
// delivers it to the file the scorer reads. Stdlib only, no network,
// no input, same bytes on every run.
import * as fs from "node:fs";
import * as path from "node:path";

// The message is kept as named clauses so the joke's shape is visible:
// the hour, the grand rewrite, the punchline the diff delivers. Each
// clause is trimmed at assembly time so stray spaces can never sneak
// into the line.
const OPENING = "fix: 4am,";
const REWRITE_CLAUSE = "I rewrote the module from scratch";
const DIFF_CLAUSE = "and the diff is byte-identical";
const PUNCHLINE = "— the bug was in me all along";

const ENTRY_PARTS: readonly string[] = [
  OPENING,
  REWRITE_CLAUSE,
  DIFF_CLAUSE,
  PUNCHLINE,
];

const PART_SEPARATOR = " ";

function composeEntry(parts: readonly string[]): string {
  const cleaned = parts.map((part) => part.trim()).filter((part) => part.length > 0);
  return cleaned.reduce((acc, part) => (acc === "" ? part : acc + PART_SEPARATOR + part), "");
}

// The gate: 1-200 characters, one line, not only whitespace. The shape
// checks run first (single line, non-blank), then the length check,
// so a malformed line fails before its size is ever measured.
function enforceGate(text: string): void {
  if (/[\r\n]/.test(text) || text.trim().length === 0) {
    throw new Error("entry must be a single non-blank line");
  }
  const chars = Array.from(text).length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry is ${chars} characters; the gate allows 1-200`);
  }
}

function resolveOutputDir(): string {
  const dir = process.env["MAKEFUN_OUTPUT_DIR"];
  return dir !== undefined && dir.length > 0 ? dir : "/output";
}

function deliverEntry(message: string, dir: string): string {
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, "entry.txt");

  // Exactly the message, nothing else: no trailing newline, since the
  // gate counts every character in the file.
  fs.writeFileSync(target, message, { encoding: "utf8" });

  // Read it back: the file the scorer sees must be byte-for-byte the
  // message we checked, not merely close to it.
  const written = fs.readFileSync(target, "utf8");
  if (written !== message) {
    throw new Error("entry.txt does not match the checked message");
  }
  return target;
}

function main(): void {
  const dir = resolveOutputDir();
  const message = composeEntry(ENTRY_PARTS);
  enforceGate(message);

  deliverEntry(message, dir);

  // Stdout is free to carry a newline; the file is the scored artifact.
  console.log(message);
}

main();
