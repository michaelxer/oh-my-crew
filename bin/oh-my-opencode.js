#!/usr/bin/env node
// bin/oh-my-opencode.js
// Node entrypoint for the bundled JS CLI.

import("../dist/cli/index.js").catch((error) => {
  console.error("\noh-my-crew: Failed to start the JS CLI.");
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
