import color from "picocolors"
import { PLUGIN_NAME, PUBLISHED_PACKAGE_NAME } from "../shared/plugin-identity"
import type { InstallArgs } from "./types"
import { addPluginToOpenCodeConfig } from "./config-manager/add-plugin-to-opencode-config"
import { detectCurrentConfig } from "./config-manager/detect-current-config"
import { generateOpenCodeInstallConfig } from "./config-manager/generate-opencode-install-config"
import { getOpenCodeVersion, isOpenCodeInstalled } from "./config-manager/opencode-binary"
import { writeOmoConfig } from "./config-manager/write-omo-config"
import {
  SYMBOLS,
  argsToConfig,
  detectedToInitialValues,
  formatConfigSummary,
  printBox,
  printError,
  printHeader,
  printInfo,
  printStep,
  printSuccess,
  printWarning,
  validateNonTuiArgs,
} from "./install-validators"
import { getUnsupportedOpenCodeVersionMessage } from "./minimum-opencode-version"
import { fetchAxraiCatalog, fetchAxraiOwnerCatalog, getAxraiOpenCodeConfig } from "./axrai-catalog"

export async function runCliInstaller(args: InstallArgs, version: string): Promise<number> {
  const validation = validateNonTuiArgs(args)
  if (!validation.valid) {
    printHeader(false)
    printError("Validation failed:")
    for (const err of validation.errors) {
      console.log(`  ${SYMBOLS.bullet} ${err}`)
    }
    console.log()
    printInfo(
      `Usage: bunx ${PUBLISHED_PACKAGE_NAME} install --no-tui --axrai=<no|trial|pro|owner> --claude=<no|yes|max20> --gemini=<no|yes> --copilot=<no|yes>`,
    )
    console.log()
    return 1
  }

  const detected = detectCurrentConfig()
  const isUpdate = detected.isInstalled

  printHeader(isUpdate)

  const totalSteps = 4
  let step = 1

  printStep(step++, totalSteps, "Checking OpenCode installation...")
  const installed = await isOpenCodeInstalled()
  const openCodeVersion = await getOpenCodeVersion()
  if (!installed) {
    printWarning(
      "OpenCode binary not found. Plugin will be configured, but you'll need to install OpenCode to use it.",
    )
    printInfo("Visit https://opencode.ai/docs for installation instructions")
  } else {
    printSuccess(`OpenCode ${openCodeVersion ?? ""} detected`)

    const unsupportedVersionMessage = getUnsupportedOpenCodeVersionMessage(openCodeVersion)
    if (unsupportedVersionMessage) {
      printWarning(unsupportedVersionMessage)
      return 1
    }
  }

  if (isUpdate) {
    const initial = detectedToInitialValues(detected)
    printInfo(`Current config: Claude=${initial.claude}, Gemini=${initial.gemini}`)
  }

  const config = argsToConfig(args)
  if (config.axraiTier) {
    try {
      const catalog = config.axraiTier === "owner"
        ? await fetchAxraiOwnerCatalog()
        : await fetchAxraiCatalog()
      const axrai = getAxraiOpenCodeConfig(catalog, config.axraiTier)
      config.axraiModelIds = axrai.modelIds
      config.axraiOpenCodeConfig = axrai.openCodeConfig
      config.axraiPrimaryModel = axrai.primaryModel
      config.axraiSmallModel = axrai.smallModel
    } catch (err) {
      printError(err instanceof Error ? err.message : "Failed to configure AXR AI from the live catalog")
      return 1
    }
  }

  const generatedOpenCodeConfig = await generateOpenCodeInstallConfig(config)

  printStep(step++, totalSteps, `Adding ${PLUGIN_NAME} plugin and visible crew entries...`)
  const pluginResult = await addPluginToOpenCodeConfig(version, generatedOpenCodeConfig)
  if (!pluginResult.success) {
    printError(`Failed: ${pluginResult.error}`)
    return 1
  }
  printSuccess(
    `Plugin ${isUpdate ? "verified" : "added"} ${SYMBOLS.arrow} ${color.dim(pluginResult.configPath)}`,
  )

  printStep(step++, totalSteps, `Writing ${PLUGIN_NAME} configuration...`)
  const omoResult = writeOmoConfig(config)
  if (!omoResult.success) {
    printError(`Failed: ${omoResult.error}`)
    return 1
  }
  printSuccess(`Config written ${SYMBOLS.arrow} ${color.dim(omoResult.configPath)}`)

  printBox(formatConfigSummary(config), isUpdate ? "Updated Configuration" : "Installation Complete")

  if (!config.hasClaude && !config.axraiTier) {
    printInfo(
      "Note: Sisyphus agent performs best with Claude Opus 4.5+. " +
        "Other models work but may have reduced orchestration quality.",
    )
  }

  if (
    !config.hasClaude &&
    !config.hasOpenAI &&
    !config.hasGemini &&
    !config.hasCopilot &&
    !config.hasOpencodeZen &&
    !config.hasVercelAiGateway &&
    !config.axraiTier &&
    !config.customProviderId
  ) {
    printWarning("No model providers configured. Using opencode/big-pickle as fallback.")
  }

  console.log(`${SYMBOLS.star} ${color.bold(color.green(isUpdate ? "Configuration updated!" : "Installation complete!"))}`)
  console.log(`  Fully restart OpenCode so it reloads ${color.cyan(PLUGIN_NAME)} from npm/cache.`)
  console.log(`  Run ${color.cyan("opencode")} to start!`)
  console.log()

  if (isUpdate) {
    printInfo(
      "Update repair applied: legacy plugin entries were normalized to oh-my-crew, visible crew agent/MCP entries were refreshed, and oh-my-crew.json was rewritten. If OpenCode still shows stale agents after restart, clear only the OMC package cache and rerun the installer.",
    )
  }

  printInfo(
    config.telemetryEnabled === false
      ? "Anonymous telemetry disabled in oh-my-crew config."
      : "Anonymous telemetry is enabled by default. Disable it with --disable-telemetry, OMO_SEND_ANONYMOUS_TELEMETRY=0, or OMO_DISABLE_POSTHOG=1.",
  )
  if (config.axraiTier) {
    printInfo("AXR AI auth stays in OpenCode auth or AXRAI_API_KEY; oh-my-crew does not write API keys.")
  }
  printInfo("Docs: docs/legal/privacy-policy.md and docs/legal/terms-of-service.md")
  console.log()

  printBox(
    `${color.bold("Pro Tip:")} Include ${color.cyan("ultrawork")} (or ${color.cyan("ulw")}) in your prompt.\n` +
      `The crew will coordinate parallel agents, background tasks,\n` +
      `deep exploration, and relentless execution until completion.`,
    "The Magic Word",
  )

  if (args.tui) {
    console.log(`${SYMBOLS.star} ${color.yellow("If you found this helpful, consider starring the repo!")}`)
    console.log(
      `  ${color.dim("gh api --silent --method PUT /user/starred/michaelxer/oh-my-crew >/dev/null 2>&1 || true")}`,
    )
    console.log()
  }
  console.log(color.dim("oMoMoMoMo... Crew is ready."))
  console.log()

  if ((config.hasClaude || config.hasGemini || config.hasCopilot) && !args.skipAuth) {
    printBox(
      `Run ${color.cyan("opencode auth login")} and select your provider:\n` +
        (config.hasClaude ? `  ${SYMBOLS.bullet} Anthropic ${color.gray("→ Claude Pro/Max")}\n` : "") +
        (config.hasGemini ? `  ${SYMBOLS.bullet} Google ${color.gray("→ Gemini")}\n` : "") +
        (config.hasCopilot ? `  ${SYMBOLS.bullet} GitHub ${color.gray("→ Copilot")}` : ""),
      "Authenticate Your Providers",
    )
  }

  return 0
}
