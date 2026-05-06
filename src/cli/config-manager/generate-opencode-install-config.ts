import type { OhMyOpenCodeConfig } from "../../config"
import { applyAgentConfig } from "../../plugin-handlers/agent-config-handler"
import { applyMcpConfig } from "../../plugin-handlers/mcp-config-handler"
import type { PluginComponents } from "../../plugin-handlers/plugin-components-loader"
import { createModelCacheState } from "../../plugin-state"
import type { InstallConfig } from "../types"
import { deepMergeRecord } from "./deep-merge-record"
import { generateOmoConfig } from "./generate-omo-config"
import { getConfigDir } from "./config-context"

const EMPTY_PLUGIN_COMPONENTS: PluginComponents = {
  commands: {},
  skills: {},
  agents: {},
  mcpServers: {},
  hooksConfigs: [],
  plugins: [],
  errors: [],
}

export async function generateOpenCodeInstallConfig(
  installConfig: InstallConfig,
): Promise<Record<string, unknown>> {
  const pluginConfig = generateOmoConfig(installConfig) as OhMyOpenCodeConfig
  const config = deepMergeRecord({}, installConfig.axraiOpenCodeConfig ?? {})

  await applyAgentConfig({
    config,
    pluginConfig,
    ctx: { directory: getConfigDir() },
    pluginComponents: EMPTY_PLUGIN_COMPONENTS,
  })
  await applyMcpConfig({
    config,
    pluginConfig,
    pluginComponents: EMPTY_PLUGIN_COMPONENTS,
  })

  return config
}
