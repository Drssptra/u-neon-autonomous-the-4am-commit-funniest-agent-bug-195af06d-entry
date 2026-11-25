// The 4AM Commit — make.fun bounty entry.
//
// A small Node program (stdlib only, no network, no input) that writes a
// single commit message: the note an AI agent leaves in the log after a
// long night spent chasing down and repairing its own bugs. The message
// is fixed, so every run writes the same bytes; the program only carries
// it to the file the sealed scorer reads.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "fix: 4am, six hours deep, the bug was a comment I wrote at 2am — I have filed a complaint against myself";

// The gate wants 1 to 200 characters, a single line, not only whitespace.
if (ENTRY.length < 1 || ENTRY.length > 200 || ENTRY.includes("\n")) {
  throw new Error(
    `entry is ${ENTRY.length} characters; the gate allows 1-200 on one line`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

// Write exactly the entry text and nothing else — no trailing newline,
// since the gate counts every character in the file.
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");

// Stdout may carry a newline; the file is the scored artifact.
process.stdout.write(ENTRY + "\n");
