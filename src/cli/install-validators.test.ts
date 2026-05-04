import { describe, expect, test } from "bun:test"

import { argsToConfig, formatConfigSummary, validateNonTuiArgs } from "./install-validators"
import type { InstallArgs } from "./types"

function createArgs(overrides: Partial<InstallArgs> = {}): InstallArgs {
  return {
    tui: false,
    claude: "no",
    openai: "no",
    gemini: "no",
    copilot: "no",
    opencodeZen: "no",
    zaiCodingPlan: "no",
    kimiForCoding: "no",
    opencodeGo: "no",
    skipAuth: false,
    ...overrides,
  }
}

describe("validateNonTuiArgs", () => {
  test("rejects invalid --opencode-go values", () => {
    // #given
    const args = createArgs({ opencodeGo: "maybe" as InstallArgs["opencodeGo"] })

    // #when
    const result = validateNonTuiArgs(args)

    // #then
    expect(result.valid).toBe(false)
    expect(result.errors).toContain("Invalid --opencode-go value: maybe (expected: no, yes)")
  })
})

describe("argsToConfig", () => {
  test("axrAI mode ignores other provider flags and manual model overrides", () => {
    // #given
    const args = createArgs({
      axrai: "trial",
      claude: "max20",
      openai: "yes",
      gemini: "yes",
      copilot: "yes",
      customProvider: "yes",
      customProviderId: "other-provider",
      captainModel: "openai/gpt-5.5",
    })

    // #when
    const result = argsToConfig(args)

    // #then
    expect(result.axraiTier).toBe("trial")
    expect(result.hasClaude).toBe(false)
    expect(result.hasOpenAI).toBe(false)
    expect(result.hasGemini).toBe(false)
    expect(result.hasCopilot).toBe(false)
    expect(result.customProviderId).toBeUndefined()
    expect(result.modelOverrides).toBeUndefined()
  })
})

describe("formatConfigSummary", () => {
  test("shows final crew model assignments and useful commands", () => {
    // #given
    const config = argsToConfig(createArgs())

    // #when
    const result = formatConfigSummary(config)

    // #then
    expect(result).toContain("Crew Models")
    expect(result).toContain("Captain - Ultraworker: opencode/gpt-5-nano")
    expect(result).toContain("Useful Commands")
    expect(result).toContain("opencode agent list")
    expect(result).toContain("opencode debug config")
  })
})
