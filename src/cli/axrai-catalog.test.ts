import { afterEach, describe, expect, it, mock } from "bun:test"
import { fetchAxraiCatalog, fetchAxraiOwnerCatalog, getAxraiOpenCodeConfig } from "./axrai-catalog"

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

const sampleOwnerCatalog = {
  object: "axrai.model_catalog",
  access_type: "owner",
  key_type: "owner",
  model_ids: ["claude-opus-4.6", "gpt-5.5", "gpt-5-mini"],
  tiers: {
    plus: { id: "plus" },
    trial: { id: "trial" },
    pro: { id: "pro" },
  },
  opencode: {
    provider_id: "axrai",
    model: "axrai/gpt-5.5",
    small_model: "axrai/gpt-5-mini",
    config: {
      provider: {
        axrai: {
          options: {
            baseURL: "https://api.axrai.app/v1",
            apiKey: "raw-owner-key-that-must-not-survive",
          },
          models: {
            "claude-opus-4.6": { name: "claude-opus-4.6" },
            "gpt-5.5": { name: "gpt-5.5" },
            "gpt-5-mini": { name: "gpt-5-mini" },
          },
        },
      },
      model: "axrai/gpt-5.5",
      small_model: "axrai/gpt-5-mini",
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

  it("fetches authenticated Owner / Full Access catalog with bearer auth", async () => {
    // given
    let authorization = ""
    globalThis.fetch = mock(async (_url, init) => {
      authorization = String((init?.headers as Record<string, string>).Authorization)
      return new Response(JSON.stringify(sampleOwnerCatalog), { status: 200 })
    }) as typeof fetch

    // when
    const catalog = await fetchAxraiOwnerCatalog("owner-secret")

    // then
    expect(catalog.object).toBe("axrai.model_catalog")
    expect(authorization).toBe("Bearer owner-secret")
  })

  it("maps Owner / Full Access catalog without persisting API key options", () => {
    // when
    const result = getAxraiOpenCodeConfig(sampleOwnerCatalog, "owner")

    // then
    expect(result.providerId).toBe("axrai")
    expect(result.modelIds).toEqual(["claude-opus-4.6", "gpt-5.5", "gpt-5-mini"])
    expect(result.primaryModel).toBe("axrai/gpt-5.5")
    expect(result.smallModel).toBe("axrai/gpt-5-mini")
    expect(result.openCodeConfig.provider.axrai.options.apiKey).toBeUndefined()
  })

  it("can derive Owner model ids from OpenCode config model keys", () => {
    // given
    const { model_ids: _modelIds, ...catalogWithoutModelIds } = sampleOwnerCatalog

    // when
    const result = getAxraiOpenCodeConfig(catalogWithoutModelIds, "owner")

    // then
    expect(result.modelIds).toContain("claude-opus-4.6")
    expect(result.modelIds).toContain("gpt-5.5")
  })

  it("maps Owner auth failures to clear messages", async () => {
    // given
    globalThis.fetch = mock(async () => new Response("nope", { status: 401 })) as typeof fetch

    // then
    await expect(fetchAxraiOwnerCatalog("bad-key")).rejects.toThrow("AXR owner API key is missing or invalid.")

    // given
    globalThis.fetch = mock(async () => new Response("nope", { status: 403 })) as typeof fetch

    // then
    await expect(fetchAxraiOwnerCatalog("forbidden-key")).rejects.toThrow("This AXR key does not have access to the requested catalog.")
  })

  it("rejects non-owner authenticated catalogs", () => {
    // then
    expect(() => getAxraiOpenCodeConfig({ ...sampleOwnerCatalog, access_type: "pro" }, "owner"))
      .toThrow("AXR catalog response is not Owner / Full Access")
  })
})
