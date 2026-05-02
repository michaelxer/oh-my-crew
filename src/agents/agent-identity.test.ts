/// <reference types="bun-types" />

import { describe, it, expect } from "bun:test"
import { buildAgentIdentitySection } from "./dynamic-agent-core-sections"
import { createSisyphusAgent } from "./sisyphus"
import { createHephaestusAgent } from "./hephaestus"
import { mergeAgentConfig } from "./builtin-agents/agent-overrides"

describe("buildAgentIdentitySection", () => {
  describe("#given an agent name and role description", () => {
    describe("#when building the identity section", () => {
      it("#then includes the agent name prominently", () => {
        const result = buildAgentIdentitySection("Captain", "Advanced software engineering orchestrator from OhMyCrew")

        expect(result).toContain("Captain")
      })

      it("#then includes the role description", () => {
        const result = buildAgentIdentitySection("Captain", "Advanced software engineering orchestrator from OhMyCrew")

        expect(result).toContain("Advanced software engineering orchestrator from OhMyCrew")
      })

      it("#then wraps content in an identity XML tag", () => {
        const result = buildAgentIdentitySection("Strategist", "Autonomous deep worker")

        expect(result).toContain("<agent-identity>")
        expect(result).toContain("</agent-identity>")
      })

      it("#then explicitly states this identity overrides any prior identity", () => {
        const result = buildAgentIdentitySection("Captain", "Advanced software engineering orchestrator from OhMyCrew")

        expect(result).toMatch(/override|supersede|replace|disregard|instead of/i)
      })
    })
  })

  describe("#given different agent names", () => {
    describe("#when building identity for each", () => {
      it("#then each identity section contains the correct agent name", () => {
        const captain = buildAgentIdentitySection("Captain", "AI orchestrator")
        const strategist = buildAgentIdentitySection("Strategist", "Autonomous deep worker")
        const sage = buildAgentIdentitySection("Sage", "Strategic advisor")

        expect(captain).toContain("Captain")
        expect(captain).not.toContain("Strategist")
        expect(strategist).toContain("Strategist")
        expect(strategist).not.toContain("Captain")
        expect(sage).toContain("Sage")
      })
    })
  })
})

describe("Captain prompt identity", () => {
  describe("#given a Captain agent created with default model", () => {
    describe("#when checking the prompt", () => {
      it("#then contains the agent identity section with override directive", () => {
        const config = createSisyphusAgent("anthropic/claude-opus-4-7")

        expect(config.prompt).toContain("<agent-identity>")
        expect(config.prompt).toContain("Captain")
        expect(config.prompt).toContain("</agent-identity>")
      })

      it("#then identity section appears before the Role section", () => {
        const config = createSisyphusAgent("anthropic/claude-opus-4-7")
        const prompt = config.prompt ?? ""
        const identityIndex = prompt.indexOf("<agent-identity>")
        const roleIndex = prompt.indexOf("<Role>")

        expect(identityIndex).toBeGreaterThanOrEqual(0)
        expect(roleIndex).toBeGreaterThan(identityIndex)
      })
    })
  })

  describe("#given a Captain agent created with GPT-5.4 model", () => {
    describe("#when checking the prompt", () => {
      it("#then contains the agent identity section", () => {
        const config = createSisyphusAgent("openai/gpt-5.4")

        expect(config.prompt).toContain("<agent-identity>")
        expect(config.prompt).toContain("Captain")
        expect(config.prompt).toContain("</agent-identity>")
      })
    })
  })
})

describe("Strategist prompt identity", () => {
  describe("#given a Strategist agent created with GPT model", () => {
    describe("#when checking the prompt", () => {
      it("#then contains the agent identity section", () => {
        const config = createHephaestusAgent("openai/gpt-5.4")

        expect(config.prompt).toContain("<agent-identity>")
        expect(config.prompt).toContain("Strategist")
        expect(config.prompt).toContain("</agent-identity>")
      })

      it("#then identity section appears at the start of the prompt", () => {
        const config = createHephaestusAgent("openai/gpt-5.4")
        const prompt = config.prompt ?? ""
        const identityIndex = prompt.indexOf("<agent-identity>")

        expect(identityIndex).toBe(0)
      })
    })
  })
})

describe("Agent identity preservation through overrides", () => {
  describe("#given a Captain agent with prompt_append override", () => {
    describe("#when merging the override", () => {
      it("#then identity section is preserved in the merged prompt", () => {
        const baseConfig = createSisyphusAgent("anthropic/claude-opus-4-7")
        const merged = mergeAgentConfig(baseConfig, { prompt_append: "Extra instructions here" })

        expect(merged.prompt).toContain("<agent-identity>")
        expect(merged.prompt).toContain("Captain")
        expect(merged.prompt).toContain("</agent-identity>")
        expect(merged.prompt).toContain("Extra instructions here")
      })
    })
  })

  describe("#given a Captain agent with model override only", () => {
    describe("#when merging the override", () => {
      it("#then identity section is preserved unchanged", () => {
        const baseConfig = createSisyphusAgent("anthropic/claude-opus-4-7")
        const merged = mergeAgentConfig(baseConfig, { model: "openai/gpt-5.4" })

        expect(merged.prompt).toContain("<agent-identity>")
        expect(merged.prompt).toContain("Captain")
        expect(merged.prompt).toContain("</agent-identity>")
      })
    })
  })
})
