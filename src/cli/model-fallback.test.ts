/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test"

import { createCatalogModelSelector, generateModelConfig } from "./model-fallback"
import type { InstallConfig } from "./types"

function createConfig(overrides: Partial<InstallConfig> = {}): InstallConfig {
  return {
    hasClaude: false,
    isMax20: false,
    hasOpenAI: false,
    hasGemini: false,
    hasCopilot: false,
    hasOpencodeZen: false,
    hasZaiCodingPlan: false,
    hasKimiForCoding: false,
    hasOpencodeGo: false,
    hasVercelAiGateway: false,
    ...overrides,
  }
}

describe("generateModelConfig", () => {
  describe("axrAI catalog-driven setup", () => {
    test("Trial output uses only Trial models and does not contain gpt-5.5", () => {
      // given
      const result = generateModelConfig({
        hasClaude: false,
        isMax20: false,
        hasOpenAI: false,
        hasGemini: false,
        hasCopilot: false,
        hasOpencodeZen: false,
        hasZaiCodingPlan: false,
        hasKimiForCoding: false,
        hasOpencodeGo: false,
        hasVercelAiGateway: false,
        axraiTier: "trial",
        axraiModelIds: ["gemini-3.1-pro", "glm-5.0", "gpt-5.3-codex", "gpt-5.4", "kimi-k2.5"],
        axraiPrimaryModel: "axrai/gpt-5.4",
        axraiSmallModel: "axrai/gpt-5.4",
      })

      // then
      const serialized = JSON.stringify(result)
      expect(serialized).toContain("axrai/gpt-5.4")
      expect(serialized).not.toContain("gpt-5.5")
      expect(serialized).not.toContain("deepseek")
      expect(result.agents?.sisyphus?.model.startsWith("axrai/")).toBe(true)
      expect(result.agents?.atlas?.fallback_models?.[0]?.model.startsWith("axrai/")).toBe(true)
    })

    test("Pro output can use gpt-5.5 and only axrAI provider-prefixed models", () => {
      // given
      const result = generateModelConfig({
        hasClaude: false,
        isMax20: false,
        hasOpenAI: false,
        hasGemini: false,
        hasCopilot: false,
        hasOpencodeZen: false,
        hasZaiCodingPlan: false,
        hasKimiForCoding: false,
        hasOpencodeGo: false,
        hasVercelAiGateway: false,
        axraiTier: "pro",
        axraiModelIds: ["gpt-5.5", "gpt-5-mini", "gemini-3.1-pro"],
        axraiPrimaryModel: "axrai/gpt-5.5",
        axraiSmallModel: "axrai/gpt-5-mini",
      })

      // then
      const serialized = JSON.stringify(result)
      expect(serialized).toContain("axrai/gpt-5.5")
      expect(serialized).toContain("axrai/gpt-5-mini")
      expect(serialized).not.toContain("deepseek-v4")
      for (const agent of Object.values(result.agents ?? {})) {
        expect(agent.model.startsWith("axrai/")).toBe(true)
        for (const fallback of agent.fallback_models ?? []) {
          expect(fallback.model.startsWith("axrai/")).toBe(true)
        }
      }
    })

    test("Pro output uses the AXR Pro / Owner recommendation table when recommended models are present", () => {
      // given
      const result = generateModelConfig({
        hasClaude: false,
        isMax20: false,
        hasOpenAI: false,
        hasGemini: false,
        hasCopilot: false,
        hasOpencodeZen: false,
        hasZaiCodingPlan: false,
        hasKimiForCoding: false,
        hasOpencodeGo: false,
        hasVercelAiGateway: false,
        axraiTier: "pro",
        axraiModelIds: [
          "claude-opus-4.6",
          "gpt-5.5",
          "gpt-5.4",
          "gemini-3.1-pro",
          "gemini-3.0-flash",
          "claude-haiku-4.5",
          "kimi-k2.5",
        ],
        axraiPrimaryModel: "axrai/gpt-5.5",
        axraiSmallModel: "axrai/claude-haiku-4.5",
      })

      // then
      expect(result.agents?.sisyphus?.model).toBe("axrai/gpt-5.5")
      expect(result.agents?.sisyphus?.fallback_models?.[0]?.model).toBe("axrai/claude-opus-4.6")
      expect(result.agents?.atlas?.model).toBe("axrai/gpt-5.4")
      expect(result.agents?.atlas?.fallback_models?.[0]?.model).toBe("axrai/kimi-k2.5")
      expect(result.agents?.["sisyphus-junior"]?.model).toBe("axrai/kimi-k2.5")
      expect(result.agents?.["sisyphus-junior"]?.fallback_models?.[0]?.model).toBe("axrai/gpt-5.4")
      expect(result.agents?.hephaestus?.model).toBe("axrai/gpt-5.4")
      expect(result.agents?.hephaestus?.fallback_models?.[0]?.model).toBe("axrai/claude-opus-4.6")
      expect(result.agents?.oracle?.model).toBe("axrai/gemini-3.1-pro")
      expect(result.agents?.oracle?.fallback_models?.[0]?.model).toBe("axrai/gpt-5.4")
      expect(result.agents?.librarian?.model).toBe("axrai/claude-haiku-4.5")
      expect(result.agents?.librarian?.fallback_models?.[0]?.model).toBe("axrai/gemini-3.0-flash")
      expect(result.categories?.["visual-engineering"]?.model).toBe("axrai/gemini-3.1-pro")
      expect(result.categories?.["visual-engineering"]?.fallback_models?.[0]?.model).toBe("axrai/gpt-5.4")
    })

    test("Pro falls back to catalog selection when a recommended primary model is absent", () => {
      // given
      const result = generateModelConfig({
        hasClaude: false,
        isMax20: false,
        hasOpenAI: false,
        hasGemini: false,
        hasCopilot: false,
        hasOpencodeZen: false,
        hasZaiCodingPlan: false,
        hasKimiForCoding: false,
        hasOpencodeGo: false,
        hasVercelAiGateway: false,
        axraiTier: "pro",
        axraiModelIds: ["claude-opus-4.7", "gpt-5.6", "gpt-5.5", "gpt-5-mini", "kimi-k2.5"],
        axraiPrimaryModel: "axrai/gpt-5.6",
        axraiSmallModel: "axrai/gpt-5-mini",
      })

      // then
      expect(result.agents?.sisyphus?.model).toBe("axrai/gpt-5.5")
      expect(result.agents?.atlas?.model).toBe("axrai/claude-opus-4.7")
      expect(result.agents?.oracle?.model).toBe("axrai/gpt-5.6")
    })
  })

  describe("catalog-driven provider selection", () => {
    test("model quality ranking is independent of the provider id", () => {
      // given
      const selector = createCatalogModelSelector({
        providerId: "custom-gateway",
        modelIds: ["claude-opus-4.6", "gpt-5.5", "gpt-5-mini", "kimi-k2.5"],
        primaryModel: "custom-gateway/gpt-5.5",
        smallModel: "custom-gateway/gpt-5-mini",
      })

      // when
      const captain = selector.selectForChain([
        { providers: ["custom-gateway"], model: "claude-opus-4-7" },
        { providers: ["custom-gateway"], model: "kimi-k2.5" },
        { providers: ["custom-gateway"], model: "gpt-5.5" },
      ])
      const fast = selector.selectForChain([
        { providers: ["custom-gateway"], model: "gpt-5.4-mini-fast" },
        { providers: ["custom-gateway"], model: "gpt-5.4-nano" },
      ], true)

      // then
      expect(captain.model).toBe("custom-gateway/claude-opus-4.6")
      expect(captain.fallback_models?.[0]?.model).toBe("custom-gateway/gpt-5.5")
      expect(fast.model).toBe("custom-gateway/gpt-5-mini")
      expect(fast.fallback_models?.[0]?.model).toBe("custom-gateway/gpt-5.5")
    })
  })

  describe("no providers available", () => {
    test("returns ULTIMATE_FALLBACK for all agents and categories when no providers", () => {
      // #given no providers are available
      const config = createConfig()

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use ULTIMATE_FALLBACK for everything
      expect(result).toMatchSnapshot()
    })

    test("applies installer model, MCP, session guardian, and telemetry selections", () => {
      // #given scripted installer choices
      const config = createConfig({
        modelOverrides: {
          captain: "custom/opus",
          foreman: "custom/sonnet",
          architect: "custom/planner",
          reviewer: "custom/reviewer",
          utility: "custom/fast",
        },
        enabledMcps: ["websearch", "context7"],
        sessionGuardianEnabled: false,
        telemetryEnabled: false,
      })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.sisyphus?.model).toBe("custom/opus")
      expect(result.agents?.atlas?.model).toBe("custom/sonnet")
      expect(result.agents?.prometheus?.model).toBe("custom/planner")
      expect(result.agents?.oracle?.model).toBe("custom/reviewer")
      expect(result.agents?.momus?.model).toBe("custom/reviewer")
      expect(result.agents?.metis?.model).toBe("custom/reviewer")
      expect(result.agents?.explore?.model).toBe("custom/fast")
      expect(result.agents?.librarian?.model).toBe("custom/fast")
      expect(result.disabled_mcps).toEqual(["grep_app"])
      expect(result.disabled_skills).toEqual(["session-guardian"])
      expect(result.anonymous_telemetry).toBe(false)
    })
  })

  describe("single native provider", () => {
    test("uses Claude models when only Claude is available", () => {
      // #given only Claude is available
      const config = createConfig({ hasClaude: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use Claude models per NATIVE_FALLBACK_CHAINS
      expect(result).toMatchSnapshot()
    })

    test("uses Claude models with isMax20 flag", () => {
      // #given Claude is available with Max 20 plan
      const config = createConfig({ hasClaude: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models for Sisyphus
      expect(result).toMatchSnapshot()
    })

    test("uses OpenAI models when only OpenAI is available", () => {
      // #given only OpenAI is available
      const config = createConfig({ hasOpenAI: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use OpenAI models
      expect(result).toMatchSnapshot()
    })

    test("uses OpenAI models with isMax20 flag", () => {
      // #given OpenAI is available with Max 20 plan
      const config = createConfig({ hasOpenAI: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models
      expect(result).toMatchSnapshot()
    })

    test("uses Gemini models when only Gemini is available", () => {
      // #given only Gemini is available
      const config = createConfig({ hasGemini: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use Gemini models
      expect(result).toMatchSnapshot()
    })

    test("uses Gemini models with isMax20 flag", () => {
      // #given Gemini is available with Max 20 plan
      const config = createConfig({ hasGemini: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models
      expect(result).toMatchSnapshot()
    })
  })

  describe("all native providers", () => {
    test("uses preferred models from fallback chains when all natives available", () => {
      // #given all native providers are available
      const config = createConfig({
        hasClaude: true,
        hasOpenAI: true,
        hasGemini: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use first provider in each fallback chain
      expect(result).toMatchSnapshot()
    })

    test("uses preferred models with isMax20 flag when all natives available", () => {
      // #given all native providers are available with Max 20 plan
      const config = createConfig({
        hasClaude: true,
        hasOpenAI: true,
        hasGemini: true,
        isMax20: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models
      expect(result).toMatchSnapshot()
    })
  })

  describe("fallback providers", () => {
    test("uses OpenCode Zen models when only OpenCode Zen is available", () => {
      // #given only OpenCode Zen is available
      const config = createConfig({ hasOpencodeZen: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use OPENCODE_ZEN_MODELS
      expect(result).toMatchSnapshot()
    })

    test("uses OpenCode Zen models with isMax20 flag", () => {
      // #given OpenCode Zen is available with Max 20 plan
      const config = createConfig({ hasOpencodeZen: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models
      expect(result).toMatchSnapshot()
    })

    test("uses GitHub Copilot models when only Copilot is available", () => {
      // #given only GitHub Copilot is available
      const config = createConfig({ hasCopilot: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use GITHUB_COPILOT_MODELS
      expect(result).toMatchSnapshot()
    })

    test("uses GitHub Copilot models with isMax20 flag", () => {
      // #given GitHub Copilot is available with Max 20 plan
      const config = createConfig({ hasCopilot: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models
      expect(result).toMatchSnapshot()
    })

    test("uses ZAI model for librarian when only ZAI is available", () => {
      // #given only ZAI is available
      const config = createConfig({ hasZaiCodingPlan: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use ZAI_MODEL for librarian
      expect(result).toMatchSnapshot()
    })

    test("uses ZAI model for librarian with isMax20 flag", () => {
      // #given ZAI is available with Max 20 plan
      const config = createConfig({ hasZaiCodingPlan: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use ZAI_MODEL for librarian
      expect(result).toMatchSnapshot()
    })
  })

  describe("mixed provider scenarios", () => {
    test("uses Claude + OpenCode Zen combination", () => {
      // #given Claude and OpenCode Zen are available
      const config = createConfig({
        hasClaude: true,
        hasOpencodeZen: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should prefer Claude (native) over OpenCode Zen
      expect(result).toMatchSnapshot()
    })

    test("uses OpenAI + Copilot combination", () => {
      // #given OpenAI and Copilot are available
      const config = createConfig({
        hasOpenAI: true,
        hasCopilot: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should prefer OpenAI (native) over Copilot
      expect(result).toMatchSnapshot()
    })

    test("uses Claude + ZAI combination (librarian uses ZAI)", () => {
      // #given Claude and ZAI are available
      const config = createConfig({
        hasClaude: true,
        hasZaiCodingPlan: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should use ZAI, others use Claude
      expect(result).toMatchSnapshot()
    })

    test("uses Gemini + Claude combination (explore uses Gemini)", () => {
      // #given Gemini and Claude are available
      const config = createConfig({
        hasGemini: true,
        hasClaude: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use Gemini flash
      expect(result).toMatchSnapshot()
    })

    test("uses all fallback providers together", () => {
      // #given all fallback providers are available
      const config = createConfig({
        hasOpencodeZen: true,
        hasCopilot: true,
        hasZaiCodingPlan: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should prefer OpenCode Zen, but librarian uses ZAI
      expect(result).toMatchSnapshot()
    })

    test("uses all providers together", () => {
      // #given all providers are available
      const config = createConfig({
        hasClaude: true,
        hasOpenAI: true,
        hasGemini: true,
        hasOpencodeZen: true,
        hasCopilot: true,
        hasZaiCodingPlan: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should prefer native providers, librarian uses ZAI
      expect(result).toMatchSnapshot()
    })

    test("uses all providers with isMax20 flag", () => {
      // #given all providers are available with Max 20 plan
      const config = createConfig({
        hasClaude: true,
        hasOpenAI: true,
        hasGemini: true,
        hasOpencodeZen: true,
        hasCopilot: true,
        hasZaiCodingPlan: true,
        isMax20: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models
      expect(result).toMatchSnapshot()
    })
  })

  describe("explore agent special cases", () => {
    test("explore uses gpt-5-nano when only Gemini available (no Claude)", () => {
      // #given only Gemini is available (no Claude)
      const config = createConfig({ hasGemini: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use gpt-5-nano (Claude haiku not available)
      expect(result.agents?.explore?.model).toBe("opencode/gpt-5-nano")
    })

    test("explore uses Claude haiku when Claude available", () => {
      // #given Claude is available
      const config = createConfig({ hasClaude: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use claude-haiku-4-5
      expect(result.agents?.explore?.model).toBe("anthropic/claude-haiku-4-5")
    })

    test("explore uses Claude haiku regardless of isMax20 flag", () => {
      // #given Claude is available without Max 20 plan
      const config = createConfig({ hasClaude: true, isMax20: false })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use claude-haiku-4-5 (isMax20 doesn't affect explore)
      expect(result.agents?.explore?.model).toBe("anthropic/claude-haiku-4-5")
    })

    test("explore uses OpenAI model when only OpenAI available", () => {
      // #given only OpenAI is available
      const config = createConfig({ hasOpenAI: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use native OpenAI mini-fast (primary model)
      expect(result.agents?.explore?.model).toBe("openai/gpt-5.4-mini-fast")
      expect(result.agents?.explore?.variant).toBeUndefined()
    })

    test("explore uses gpt-5-mini when only Copilot available", () => {
      // #given only Copilot is available
      const config = createConfig({ hasCopilot: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use gpt-5-mini (Copilot fallback)
      expect(result.agents?.explore?.model).toBe("github-copilot/gpt-5-mini")
    })
  })

  describe("Sisyphus agent special cases", () => {
    test("Sisyphus is created when at least one fallback provider is available (Claude)", () => {
      // #given
      const config = createConfig({ hasClaude: true, isMax20: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.sisyphus?.model).toBe("anthropic/claude-opus-4-7")
    })

    test("Sisyphus is created when multiple fallback providers are available", () => {
      // #given
      const config = createConfig({
        hasClaude: true,
        hasKimiForCoding: true,
        hasOpencodeZen: true,
        hasZaiCodingPlan: true,
        isMax20: true,
      })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.sisyphus?.model).toBe("anthropic/claude-opus-4-7")
    })

    test("Sisyphus resolves to gpt-5.5 medium when only OpenAI is available", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.sisyphus?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.sisyphus?.variant).toBe("medium")
    })
  })

  describe("OpenAI fallback coverage", () => {
    test("Atlas resolves to OpenAI when only OpenAI is available", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.atlas?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.atlas?.variant).toBe("medium")
    })

    test("Metis resolves to OpenAI when only OpenAI is available", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.metis?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.metis?.variant).toBe("high")
    })

    test("Sisyphus-Junior resolves to OpenAI when only OpenAI is available", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.["sisyphus-junior"]?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.["sisyphus-junior"]?.variant).toBe("medium")
    })
  })

  describe("Hephaestus agent special cases", () => {
    test("Hephaestus is created when OpenAI is available (openai provider connected)", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.hephaestus?.variant).toBe("medium")
    })

    test("Hephaestus falls back to Copilot GPT-5.5 when only Copilot is available", () => {
      // #given
      const config = createConfig({ hasCopilot: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus).toEqual({
        model: "github-copilot/gpt-5.5",
        variant: "medium",
      })
    })

    test("Hephaestus is created when OpenCode Zen is available (opencode provider connected)", () => {
      // #given
      const config = createConfig({ hasOpencodeZen: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus?.model).toBe("opencode/gpt-5.5")
      expect(result.agents?.hephaestus?.variant).toBe("medium")
    })

    test("Hephaestus is omitted when only Claude is available (no required provider connected)", () => {
      // #given
      const config = createConfig({ hasClaude: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus).toBeUndefined()
    })

    test("Hephaestus is omitted when only Gemini is available (no required provider connected)", () => {
      // #given
      const config = createConfig({ hasGemini: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus).toBeUndefined()
    })

    test("Hephaestus is omitted when only ZAI is available (no required provider connected)", () => {
      // #given
      const config = createConfig({ hasZaiCodingPlan: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus).toBeUndefined()
    })
  })

  describe("librarian agent special cases", () => {
    test("librarian uses ZAI model when ZAI is available regardless of other providers", () => {
      // #given ZAI and Claude are available
      const config = createConfig({
        hasClaude: true,
        hasZaiCodingPlan: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should use ZAI_MODEL
      expect(result.agents?.librarian?.model).toBe("zai-coding-plan/glm-4.7")
    })

    test("librarian is omitted when no librarian provider matches", () => {
      // #given only Claude is available (no opencode-go or ZAI)
      const config = createConfig({ hasClaude: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should be omitted when its dedicated providers are unavailable
      expect(result.agents?.librarian).toBeUndefined()
    })
  })

  describe("special-case agents include fallback_models", () => {
    test("explore includes fallback_models when OpenAI and Claude are both available", () => {
      // #given both OpenAI and Claude are available
      const config = createConfig({ hasOpenAI: true, hasClaude: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should have fallback_models from the remaining chain entries
      expect(result.agents?.explore?.model).toBe("openai/gpt-5.4-mini-fast")
      expect(result.agents?.explore?.fallback_models).toBeDefined()
      expect(result.agents?.explore?.fallback_models?.length).toBeGreaterThan(0)
    })

    test("explore omits fallback_models when only one provider matches chain entries", () => {
      // #given only Claude is available
      const config = createConfig({ hasClaude: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should not have fallback_models (only one distinct chain entry matches)
      expect(result.agents?.explore?.model).toBe("anthropic/claude-haiku-4-5")
      expect(result.agents?.explore?.fallback_models).toBeUndefined()
    })

    test("librarian includes fallback_models when OpenAI and opencode-go are both available", () => {
      // #given OpenAI and opencode-go are available
      const config = createConfig({ hasOpenAI: true, hasOpencodeGo: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should have fallback_models
      expect(result.agents?.librarian?.model).toBe("openai/gpt-5.4-mini-fast")
      expect(result.agents?.librarian?.fallback_models).toBeDefined()
      expect(result.agents?.librarian?.fallback_models?.length).toBeGreaterThan(0)
    })

    test("librarian omits fallback_models when only ZAI is available", () => {
      // #given only ZAI is available
      const config = createConfig({ hasZaiCodingPlan: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should not have fallback_models
      expect(result.agents?.librarian?.model).toBe("zai-coding-plan/glm-4.7")
      expect(result.agents?.librarian?.fallback_models).toBeUndefined()
    })
  })

  describe("Vercel AI Gateway provider", () => {
    test("uses vercel/ model strings when only Vercel AI Gateway is available", () => {
      // #given only Vercel AI Gateway is available
      const config = createConfig({ hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use vercel/<sub-provider>/<model> format
      expect(result).toMatchSnapshot()
    })

    test("uses vercel/ model strings with isMax20 flag", () => {
      // #given Vercel AI Gateway is available with Max 20 plan
      const config = createConfig({ hasVercelAiGateway: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models via gateway
      expect(result).toMatchSnapshot()
    })

    test("explore uses vercel/minimax/minimax-m2.7-highspeed when only gateway available", () => {
      // #given only Vercel AI Gateway is available
      const config = createConfig({ hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use gateway-routed minimax (preferred over claude-haiku)
      expect(result.agents?.explore?.model).toBe("vercel/minimax/minimax-m2.7-highspeed")
    })

    test("librarian uses vercel/minimax/minimax-m2.7 when only gateway available", () => {
      // #given only Vercel AI Gateway is available
      const config = createConfig({ hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should use gateway-routed minimax (preferred over claude-haiku)
      expect(result.agents?.librarian?.model).toBe("vercel/minimax/minimax-m2.7")
    })

    test("Hephaestus is created when only Vercel AI Gateway is available", () => {
      // #given only Vercel AI Gateway is available
      const config = createConfig({ hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then hephaestus should be created with gateway-routed gpt-5.5
      expect(result.agents?.hephaestus?.model).toBe("vercel/openai/gpt-5.5")
    })

    test("native providers take priority over gateway", () => {
      // #given Claude and Vercel AI Gateway are both available
      const config = createConfig({ hasClaude: true, hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should prefer native anthropic over gateway
      expect(result.agents?.sisyphus?.model).toBe("anthropic/claude-opus-4-7")
    })
  })

  describe("schema URL", () => {
    test("always includes correct schema URL", () => {
      // #given any config
      const config = createConfig()

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should include correct schema URL
      expect(result.$schema).toBe(
        "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json"
      )
    })
  })
})
