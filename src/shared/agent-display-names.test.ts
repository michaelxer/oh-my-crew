import { describe, it, expect } from "bun:test"
import { AGENT_DISPLAY_NAMES, getAgentConfigKey, getAgentDisplayName, getAgentListDisplayName, normalizeAgentForPrompt, normalizeAgentForPromptKey, stripAgentListSortPrefix } from "./agent-display-names"

describe("getAgentDisplayName", () => {
  it("returns display name for lowercase config key (new format)", () => {
    // given config key "sisyphus"
    const configKey = "sisyphus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Captain - Ultraworker"
    expect(result).toBe("Captain - Ultraworker")
  })

  it("returns display name for uppercase config key (old format - case-insensitive)", () => {
    // given config key "Sisyphus" (old format)
    const configKey = "Sisyphus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Captain - Ultraworker" (case-insensitive lookup)
    expect(result).toBe("Captain - Ultraworker")
  })

  it("returns original key for unknown agents (fallback)", () => {
    // given config key "custom-agent"
    const configKey = "custom-agent"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "custom-agent" (original key unchanged)
    expect(result).toBe("custom-agent")
  })

  it("returns display name for atlas", () => {
    // given config key "atlas"
    const configKey = "atlas"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

     // then returns "Foreman - Plan Executor"
    expect(result).toBe("Foreman - Plan Executor")
  })

  it("returns display name for prometheus", () => {
    // given config key "prometheus"
    const configKey = "prometheus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Architect - Plan Builder"
    expect(result).toBe("Architect - Plan Builder")
  })

  it("returns display name for sisyphus-junior", () => {
    // given config key "Cadet"
    const configKey = "Cadet"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Cadet"
    expect(result).toBe("Cadet")
  })

  it("returns display name for metis", () => {
    // given config key "metis"
    const configKey = "metis"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Advisor - Plan Consultant"
    expect(result).toBe("Advisor - Plan Consultant")
  })

  it("returns display name for momus", () => {
    // given config key "momus"
    const configKey = "momus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

     // then returns "Auditor - Plan Critic"
    expect(result).toBe("Auditor - Plan Critic")
  })

  it("returns display name for oracle", () => {
    // given config key "oracle"
    const configKey = "oracle"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Sage"
    expect(result).toBe("Sage")
  })

  it("returns display name for librarian", () => {
    // given config key "librarian"
    const configKey = "librarian"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Scribe"
    expect(result).toBe("Scribe")
  })

  it("returns display name for explore", () => {
    // given config key "explore"
    const configKey = "explore"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Scout"
    expect(result).toBe("Scout")
  })

  it("returns display name for multimodal-looker", () => {
    // given config key "multimodal-looker"
    const configKey = "multimodal-looker"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Lookout"
    expect(result).toBe("Lookout")
  })
})

describe("getAgentConfigKey", () => {
  it("resolves display name to config key", () => {
    // given display name "Captain - Ultraworker"
    // when getAgentConfigKey called
    // then returns "sisyphus"
    expect(getAgentConfigKey("Captain - Ultraworker")).toBe("sisyphus")
  })

  it("resolves display name case-insensitively", () => {
    // given display name in different case
    // when getAgentConfigKey called
    // then returns "atlas"
    expect(getAgentConfigKey("foreman - plan executor")).toBe("atlas")
  })

  it("resolves legacy parenthesized display names", () => {
    // given legacy parenthesized display name from old configs/sessions
    // when getAgentConfigKey called
    // then resolves to canonical config key
    expect(getAgentConfigKey("Sisyphus (Ultraworker)")).toBe("sisyphus")
    expect(getAgentConfigKey("Atlas (Plan Executor)")).toBe("atlas")
  })

  it("resolves legacy dash-separated display names", () => {
    // given legacy dash-separated display name from old sessions
    // when getAgentConfigKey called
    // then resolves to canonical config key
    expect(getAgentConfigKey("Captain - Ultraworker")).toBe("sisyphus")
    expect(getAgentConfigKey("Strategist - Deep Agent")).toBe("hephaestus")
  })

  it("passes through lowercase config keys unchanged", () => {
    // given lowercase config key "prometheus"
    // when getAgentConfigKey called
    // then returns "prometheus"
    expect(getAgentConfigKey("prometheus")).toBe("prometheus")
  })

  it("returns lowercased unknown agents", () => {
    // given unknown agent name
    // when getAgentConfigKey called
    // then returns lowercased
    expect(getAgentConfigKey("Custom-Agent")).toBe("custom-agent")
  })

  it("resolves all core agent display names", () => {
    // given all core display names
    // when/then each resolves to its config key
    expect(getAgentConfigKey("Strategist - Deep Agent")).toBe("hephaestus")
    expect(getAgentConfigKey("Architect - Plan Builder")).toBe("prometheus")
    expect(getAgentConfigKey("Foreman - Plan Executor")).toBe("atlas")
    expect(getAgentConfigKey("Advisor - Plan Consultant")).toBe("metis")
    expect(getAgentConfigKey("Auditor - Plan Critic")).toBe("momus")
    expect(getAgentConfigKey("Cadet")).toBe("Cadet")
  })

  it("resolves atlas even when the UI ordering prefix is present", () => {
    expect(getAgentConfigKey(getAgentListDisplayName("atlas"))).toBe("atlas")
  })

  it("resolves display names even when zero-width characters are embedded", () => {
    expect(getAgentConfigKey("Captain\u200B - Ultraworker")).toBe("sisyphus")
    expect(getAgentConfigKey("\uFEFFForeman - Plan Executor")).toBe("atlas")
  })
})

describe("getAgentListDisplayName", () => {
  it("returns the canonical display name for the core agent list", () => {
    expect(getAgentListDisplayName("sisyphus")).toBe("Captain - Ultraworker")
    expect(getAgentListDisplayName("hephaestus")).toBe("Strategist - Deep Agent")
    expect(getAgentListDisplayName("prometheus")).toBe("Architect - Plan Builder")
    expect(getAgentListDisplayName("atlas")).toBe("Foreman - Plan Executor")
  })

  it("keeps non-core agents with their crew display names", () => {
    expect(getAgentListDisplayName("oracle")).toBe("Sage")
  })

  it("is a thin alias for getAgentDisplayName", () => {
    expect(getAgentListDisplayName("sisyphus")).toBe(getAgentDisplayName("sisyphus"))
  })
})

describe("stripAgentListSortPrefix", () => {
  it("strips legacy zero-width sort prefixes baked into v3.14.0-v3.16.0 sessions", () => {
    expect(stripAgentListSortPrefix("\u200B\u200BStrategist - Deep Agent")).toBe("Strategist - Deep Agent")
  })
})

describe("normalizeAgentForPrompt", () => {
  it("strips core UI ordering prefixes back to canonical display names", () => {
    expect(normalizeAgentForPrompt(getAgentListDisplayName("sisyphus"))).toBe("Captain - Ultraworker")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("hephaestus"))).toBe("Strategist - Deep Agent")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("prometheus"))).toBe("Architect - Plan Builder")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("atlas"))).toBe("Foreman - Plan Executor")
  })

  it("removes zero-width characters before returning canonical names", () => {
    expect(normalizeAgentForPrompt("Captain\u200B - Ultraworker")).toBe("Captain - Ultraworker")
  })

  it("converts legacy parenthesized names to canonical display names", () => {
    expect(normalizeAgentForPrompt("Atlas (Plan Executor)")).toBe("Foreman - Plan Executor")
  })
})

describe("normalizeAgentForPromptKey", () => {
  it("converts built-in display names to config keys", () => {
    expect(normalizeAgentForPromptKey("Sisyphus (Ultraworker)")).toBe("sisyphus")
  })

  it("strips UI ordering prefixes before returning config keys", () => {
    expect(normalizeAgentForPromptKey(getAgentListDisplayName("atlas"))).toBe("atlas")
  })

  it("preserves custom agents", () => {
    expect(normalizeAgentForPromptKey("MyCustomAgent")).toBe("MyCustomAgent")
  })
})

describe("AGENT_DISPLAY_NAMES", () => {
  it("contains all expected agent mappings", () => {
    // given expected mappings
    const expectedMappings = {
      sisyphus: "Captain - Ultraworker",
      hephaestus: "Strategist - Deep Agent",
      prometheus: "Architect - Plan Builder",
      atlas: "Foreman - Plan Executor",
      "Cadet": "Cadet",
      metis: "Advisor - Plan Consultant",
      momus: "Auditor - Plan Critic",
      athena: "Athena - Council",
      "athena-junior": "Athena-Junior - Council",
      oracle: "Sage",
      librarian: "Scribe",
      explore: "Scout",
      "multimodal-looker": "Lookout",
      "council-member": "council-member",
    }

    // when checking the constant
    // then contains all expected mappings
    expect(AGENT_DISPLAY_NAMES).toEqual(expectedMappings)
  })

  it("all display names must be HTTP-header-safe (no parentheses)", () => {
    // given all agent display names
    const httpHeaderUnsafe = /[()]/

    // when checking each display name
    for (const [, displayName] of Object.entries(AGENT_DISPLAY_NAMES)) {
      // then none should contain parentheses
      expect(httpHeaderUnsafe.test(displayName)).toBe(false)
    }
  })
})
