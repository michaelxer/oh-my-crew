import { afterEach, describe, expect, it, mock } from "bun:test"
import { fetchAxraiCatalog, getAxraiOpenCodeConfig } from "./axrai-catalog"

const sampleCatalog = {
  object: "axrai.model_catalog",
  tiers: {
    trial: {
      id: "trial",
      model_ids: ["gpt-5.4", "gpt-5.3-codex"],
      opencode: {
        provider_id: "axrai",
        model: "axrai/gpt-5.4",
        small_model: "axrai/gpt-5.4",
        config: {
          provider: {
            axrai: {
              options: {
                baseURL: "https://api.axrai.app/v1",
                apiKey: "{env:AXRAI_API_KEY}",
              },
              models: {
                "gpt-5.4": { name: "gpt-5.4" },
                "gpt-5.3-codex": { name: "gpt-5.3-codex" },
              },
            },
          },
          model: "axrai/gpt-5.4",
          small_model: "axrai/gpt-5.4",
        },
      },
    },
    pro: {
      id: "pro",
      model_ids: ["gpt-5.5", "gpt-5-mini"],
      opencode: {
        provider_id: "axrai",
        model: "axrai/gpt-5.5",
        small_model: "axrai/gpt-5-mini",
        config: {
          provider: {
            axrai: {
              options: {
                baseURL: "https://api.axrai.app/v1",
                apiKey: "{env:AXRAI_API_KEY}",
              },
              models: {
                "gpt-5.5": { name: "gpt-5.5" },
                "gpt-5-mini": { name: "gpt-5-mini" },
              },
            },
          },
          model: "axrai/gpt-5.5",
          small_model: "axrai/gpt-5-mini",
        },
      },
    },
  },
}

describe("axrAI catalog", () => {
  afterEach(() => {
    mock.restore()
  })

  it("fetches and validates the live catalog shape", async () => {
    // given
    globalThis.fetch = mock(async () => new Response(JSON.stringify(sampleCatalog), { status: 200 })) as typeof fetch

    // when
    const catalog = await fetchAxraiCatalog()

    // then
    expect(catalog.object).toBe("axrai.model_catalog")
  })

  it("returns Trial OpenCode config", () => {
    // when
    const result = getAxraiOpenCodeConfig(sampleCatalog, "trial")

    // then
    expect(result.providerId).toBe("axrai")
    expect(result.primaryModel).toBe("axrai/gpt-5.4")
    expect(result.modelIds).not.toContain("gpt-5.5")
    expect(result.openCodeConfig.provider.axrai.options.baseURL).toBe("https://api.axrai.app/v1")
  })

  it("returns Pro OpenCode config", () => {
    // when
    const result = getAxraiOpenCodeConfig(sampleCatalog, "pro")

    // then
    expect(result.providerId).toBe("axrai")
    expect(result.primaryModel).toBe("axrai/gpt-5.5")
    expect(result.modelIds).toContain("gpt-5.5")
  })

  it("fails clearly when catalog fetch fails", async () => {
    // given
    globalThis.fetch = mock(async () => new Response("nope", { status: 503 })) as typeof fetch

    // then
    await expect(fetchAxraiCatalog()).rejects.toThrow("Failed to fetch axrAI catalog: 503")
  })

  it("fails clearly for invalid catalog shape", () => {
    // then
    expect(() => getAxraiOpenCodeConfig({ object: "wrong" }, "trial")).toThrow("Missing axrAI tiers")
  })
})

