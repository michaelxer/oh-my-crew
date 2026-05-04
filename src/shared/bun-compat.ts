import { spawnSync as nodeSpawnSync } from "node:child_process"

import { spawnWithWindowsHide, type SpawnOptions, type SpawnedProcess } from "./spawn-with-windows-hide"

type OutputMode = "pipe" | "ignore" | "inherit"

interface SpawnSyncOptions {
  stdout?: OutputMode
  stderr?: OutputMode
}

export function spawn(command: string[], options: SpawnOptions): SpawnedProcess {
  return spawnWithWindowsHide(command, options)
}

export function spawnSync(command: string[], options: SpawnSyncOptions = {}): { exitCode: number } {
  const [cmd, ...args] = command
  const result = nodeSpawnSync(cmd, args, {
    stdio: [
      "ignore",
      options.stdout ?? "pipe",
      options.stderr ?? "pipe",
    ],
    windowsHide: process.platform === "win32",
    shell: process.platform === "win32",
  })

  return { exitCode: result.status ?? 1 }
}
