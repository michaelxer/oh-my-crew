import { spawnWithTimeout } from "../spawn-with-timeout"
import { getBinaryLookupCommand, parseBinaryPaths, selectBinaryPath } from "./system-binary"

export async function findBinaryPath(binary: string): Promise<string | null> {
  const result = await spawnWithTimeout(
    [getBinaryLookupCommand(process.platform), binary],
    { stdout: "pipe", stderr: "pipe" },
    5_000
  )

  if (result.timedOut || result.exitCode !== 0) {
    return null
  }

  return selectBinaryPath(parseBinaryPaths(result.stdout), process.platform)
}
