import type { AxraiTier } from "./types"

export const AXRAI_CATALOG_URL = "https://api.axrai.app/v1/models.json"
export const AXRAI_BASE_URL = "https://api.axrai.app/v1"

type UnknownRecord = Record<string, unknown>

export interface AxraiTierConfig {
  tier: AxraiTier
  modelIds: string[]
  providerId: string
  primaryModel: string
  smallModel: string
  openCodeConfig: UnknownRecord
}

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function cloneRecord(value: UnknownRecord): UnknownRecord {
  return structuredClone(value) as UnknownRecord
}

function stripAxraiProvider(model: string): string {
  return model.startsWith("axrai/") ? model.slice("axrai/".length) : model
}

export async function fetchAxraiCatalog(): Promise<UnknownRecord> {
  const res = await fetch(AXRAI_CATALOG_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch axrAI catalog: ${res.status}`)
  }

  const catalog = await res.json()
  if (!isRecord(catalog) || catalog.object !== "axrai.model_catalog") {
    throw new Error("Invalid axrAI catalog response")
  }

  return catalog
}

export function getAxraiOpenCodeConfig(catalog: UnknownRecord, tier: AxraiTier): AxraiTierConfig {
  const tiers = catalog.tiers
  if (!isRecord(tiers)) {
    throw new Error("Missing axrAI tiers")
  }

  const tierCatalog = tiers[tier]
  if (!isRecord(tierCatalog)) {
    throw new Error(`Missing axrAI tier: ${tier}`)
  }

  const modelIds = tierCatalog.model_ids
  if (!Array.isArray(modelIds) || modelIds.length === 0 || !modelIds.every((id) => typeof id === "string" && id.length > 0)) {
    throw new Error(`axrAI tier ${tier} has no models`)
  }

  const opencode = tierCatalog.opencode
  if (!isRecord(opencode)) {
    throw new Error(`Missing axrAI OpenCode config for tier: ${tier}`)
  }

  const config = opencode.config
  if (!isRecord(config)) {
    throw new Error(`Missing axrAI OpenCode config for tier: ${tier}`)
  }

  const provider = config.provider
  const axraiProvider = isRecord(provider) ? provider.axrai : undefined
  const options = isRecord(axraiProvider) ? axraiProvider.options : undefined
  const baseURL = isRecord(options) ? options.baseURL : undefined
  if (baseURL !== AXRAI_BASE_URL) {
    throw new Error("Unexpected axrAI baseURL")
  }

  const providerId = opencode.provider_id
  const primaryModel = opencode.model ?? config.model
  const smallModel = opencode.small_model ?? config.small_model ?? primaryModel
  if (providerId !== "axrai") {
    throw new Error("Unexpected axrAI provider id")
  }
  if (typeof primaryModel !== "string" || !primaryModel.startsWith("axrai/")) {
    throw new Error(`Missing axrAI primary model for tier: ${tier}`)
  }
  if (typeof smallModel !== "string" || !smallModel.startsWith("axrai/")) {
    throw new Error(`Missing axrAI small model for tier: ${tier}`)
  }
  if (!modelIds.includes(stripAxraiProvider(primaryModel)) || !modelIds.includes(stripAxraiProvider(smallModel))) {
    throw new Error(`axrAI tier ${tier} OpenCode models are not present in model_ids`)
  }

  return {
    tier,
    modelIds: [...modelIds],
    providerId,
    primaryModel,
    smallModel,
    openCodeConfig: cloneRecord(config),
  }
}
