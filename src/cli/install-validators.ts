import color from "picocolors"
import type {
  BooleanArg,
  ClaudeSubscription,
  DetectedConfig,
  InstallArgs,
  InstallConfig,
} from "./types"

export const SYMBOLS = {
  check: color.green("[OK]"),
  cross: color.red("[X]"),
  arrow: color.cyan("->"),
  bullet: color.dim("*"),
  info: color.blue("[i]"),
  warn: color.yellow("[!]"),
  star: color.yellow("*"),
}

const BUILTIN_MCP_NAMES = new Set(["websearch", "context7", "grep_app"])
const ANSI_COLOR_PATTERN = new RegExp("\u001b\\[[0-9;]*m", "g")

function parseCommaList(value: string | undefined): string[] | undefined {
  if (value === undefined) return undefined
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function formatProvider(name: string, enabled: boolean, detail?: string): string {
  const status = enabled ? SYMBOLS.check : color.dim("○")
  const label = enabled ? color.white(name) : color.dim(name)
  const suffix = detail ? color.dim(` (${detail})`) : ""
  return `  ${status} ${label}${suffix}`
}

export function formatConfigSummary(config: InstallConfig): string {
  const lines: string[] = []

  lines.push(color.bold(color.white("Configuration Summary")))
  lines.push("")

  const claudeDetail = config.hasClaude ? (config.isMax20 ? "max20" : "standard") : undefined
  lines.push(formatProvider("Claude", config.hasClaude, claudeDetail))
  lines.push(formatProvider("OpenAI/ChatGPT", config.hasOpenAI, "GPT-5.4 for Oracle"))
  lines.push(formatProvider("Gemini", config.hasGemini))
  lines.push(formatProvider("GitHub Copilot", config.hasCopilot, "fallback"))
  lines.push(formatProvider("OpenCode Zen", config.hasOpencodeZen, "opencode/ models"))
  lines.push(formatProvider("Z.ai Coding Plan", config.hasZaiCodingPlan, "Librarian/Multimodal"))
  lines.push(formatProvider("Kimi For Coding", config.hasKimiForCoding, "Sisyphus/Prometheus fallback"))
  lines.push(formatProvider("OpenCode Go", config.hasOpencodeGo, "quick tasks"))
  lines.push(formatProvider("Vercel AI Gateway", config.hasVercelAiGateway, "universal proxy"))
  lines.push(formatProvider("AXR AI", !!config.axraiTier, config.axraiTier))
  lines.push(formatProvider("Custom provider", !!config.customProviderId, config.customProviderId))

  lines.push("")
  lines.push(color.dim("─".repeat(40)))
  lines.push("")

  lines.push(color.bold(color.white("Model Assignment")))
  lines.push("")
  if (config.axraiTier) {
    lines.push(`  ${SYMBOLS.info} Models auto-configured from live AXR AI ${config.axraiTier} catalog`)
    lines.push(`  ${SYMBOLS.bullet} Catalog: https://api.axrai.app/v1/models.json`)
  } else {
    lines.push(`  ${SYMBOLS.info} Models auto-configured based on provider priority`)
    lines.push(`  ${SYMBOLS.bullet} Priority: Native > Copilot > OpenCode Zen > Z.ai`)
  }

  if (config.enabledMcps) {
    lines.push("")
    lines.push(`${SYMBOLS.info} Built-in MCPs: ${config.enabledMcps.length > 0 ? config.enabledMcps.join(", ") : "none"}`)
  }

  if (config.sessionGuardianEnabled !== undefined) {
    lines.push(`${SYMBOLS.info} Session Guardian: ${config.sessionGuardianEnabled ? "enabled" : "disabled"}`)
  }

  if (config.telemetryEnabled === false) {
    lines.push(`${SYMBOLS.info} Anonymous telemetry: disabled`)
  }

  return lines.join("\n")
}

export function printHeader(isUpdate: boolean): void {
  const mode = isUpdate ? "Update" : "Install"
  console.log()
  console.log(color.bgMagenta(color.white(` oMoMoMoMo... ${mode} `)))
  console.log()
}

export function printStep(step: number, total: number, message: string): void {
  const progress = color.dim(`[${step}/${total}]`)
  console.log(`${progress} ${message}`)
}

export function printSuccess(message: string): void {
  console.log(`${SYMBOLS.check} ${message}`)
}

export function printError(message: string): void {
  console.log(`${SYMBOLS.cross} ${color.red(message)}`)
}

export function printInfo(message: string): void {
  console.log(`${SYMBOLS.info} ${message}`)
}

export function printWarning(message: string): void {
  console.log(`${SYMBOLS.warn} ${color.yellow(message)}`)
}

export function printBox(content: string, title?: string): void {
  const lines = content.split("\n")
  const maxWidth =
    Math.max(
      ...lines.map((line) => line.replace(ANSI_COLOR_PATTERN, "").length),
      title?.length ?? 0,
    ) + 4
  const border = color.dim("─".repeat(maxWidth))

  console.log()
  if (title) {
    console.log(
      color.dim("┌─") +
        color.bold(` ${title} `) +
        color.dim("─".repeat(maxWidth - title.length - 4)) +
        color.dim("┐"),
    )
  } else {
    console.log(color.dim("┌") + border + color.dim("┐"))
  }

  for (const line of lines) {
    const stripped = line.replace(ANSI_COLOR_PATTERN, "")
    const padding = maxWidth - stripped.length
    console.log(color.dim("│") + ` ${line}${" ".repeat(padding - 1)}` + color.dim("│"))
  }

  console.log(color.dim("└") + border + color.dim("┘"))
  console.log()
}

export function validateNonTuiArgs(args: InstallArgs): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const usesAxrai = args.axrai === "trial" || args.axrai === "pro"

  if (args.axrai !== undefined && !["no", "trial", "pro"].includes(args.axrai)) {
    errors.push(`Invalid --axrai value: ${args.axrai} (expected: no, trial, pro)`)
  }

  if (!usesAxrai && args.claude === undefined) {
    errors.push("--claude is required (values: no, yes, max20)")
  } else if (args.claude !== undefined && !["no", "yes", "max20"].includes(args.claude)) {
    errors.push(`Invalid --claude value: ${args.claude} (expected: no, yes, max20)`)
  }

  if (!usesAxrai && args.gemini === undefined) {
    errors.push("--gemini is required (values: no, yes)")
  } else if (args.gemini !== undefined && !["no", "yes"].includes(args.gemini)) {
    errors.push(`Invalid --gemini value: ${args.gemini} (expected: no, yes)`)
  }

  if (!usesAxrai && args.copilot === undefined) {
    errors.push("--copilot is required (values: no, yes)")
  } else if (args.copilot !== undefined && !["no", "yes"].includes(args.copilot)) {
    errors.push(`Invalid --copilot value: ${args.copilot} (expected: no, yes)`)
  }

  if (args.openai !== undefined && !["no", "yes"].includes(args.openai)) {
    errors.push(`Invalid --openai value: ${args.openai} (expected: no, yes)`)
  }

  if (args.opencodeGo !== undefined && !["no", "yes"].includes(args.opencodeGo)) {
    errors.push(`Invalid --opencode-go value: ${args.opencodeGo} (expected: no, yes)`)
  }

  if (args.opencodeZen !== undefined && !["no", "yes"].includes(args.opencodeZen)) {
    errors.push(`Invalid --opencode-zen value: ${args.opencodeZen} (expected: no, yes)`)
  }

  if (args.zaiCodingPlan !== undefined && !["no", "yes"].includes(args.zaiCodingPlan)) {
    errors.push(`Invalid --zai-coding-plan value: ${args.zaiCodingPlan} (expected: no, yes)`)
  }

  if (args.kimiForCoding !== undefined && !["no", "yes"].includes(args.kimiForCoding)) {
    errors.push(`Invalid --kimi-for-coding value: ${args.kimiForCoding} (expected: no, yes)`)
  }

  if (args.vercelAiGateway !== undefined && !["no", "yes"].includes(args.vercelAiGateway)) {
    errors.push(`Invalid --vercel-ai-gateway value: ${args.vercelAiGateway} (expected: no, yes)`)
  }

  if (args.customProvider !== undefined && !["no", "yes"].includes(args.customProvider)) {
    errors.push(`Invalid --custom-provider value: ${args.customProvider} (expected: no, yes)`)
  }

  if (args.customProvider === "yes" && !args.customProviderId) {
    errors.push("--custom-provider-id is required when --custom-provider=yes")
  }

  if (args.customBaseUrl && !/^https?:\/\//.test(args.customBaseUrl)) {
    errors.push("--custom-base-url must start with http:// or https://")
  }

  if (args.sessionGuardian !== undefined && !["no", "yes"].includes(args.sessionGuardian)) {
    errors.push(`Invalid --session-guardian value: ${args.sessionGuardian} (expected: no, yes)`)
  }

  const enabledMcps = parseCommaList(args.enableMcp)
  if (enabledMcps) {
    for (const mcp of enabledMcps) {
      if (!BUILTIN_MCP_NAMES.has(mcp)) {
        errors.push(`Invalid --enable-mcp entry: ${mcp} (expected one of: websearch, context7, grep_app)`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

export function argsToConfig(args: InstallArgs): InstallConfig {
  const axraiTier = args.axrai === "trial" || args.axrai === "pro" ? args.axrai : undefined
  return {
    hasClaude: axraiTier ? false : args.claude !== "no",
    isMax20: axraiTier ? false : args.claude === "max20",
    hasOpenAI: axraiTier ? false : args.openai === "yes",
    hasGemini: axraiTier ? false : args.gemini === "yes",
    hasCopilot: axraiTier ? false : args.copilot === "yes",
    hasOpencodeZen: axraiTier ? false : args.opencodeZen === "yes",
    hasZaiCodingPlan: axraiTier ? false : args.zaiCodingPlan === "yes",
    hasKimiForCoding: axraiTier ? false : args.kimiForCoding === "yes",
    hasOpencodeGo: axraiTier ? false : args.opencodeGo === "yes",
    hasVercelAiGateway: axraiTier ? false : args.vercelAiGateway === "yes",
    axraiTier,
    customProviderId: !axraiTier && args.customProvider === "yes" ? args.customProviderId : undefined,
    customBaseUrl: !axraiTier && args.customProvider === "yes" ? args.customBaseUrl : undefined,
    modelOverrides: axraiTier ? undefined : {
      captain: args.captainModel,
      strategist: args.strategistModel,
      foreman: args.foremanModel,
      architect: args.architectModel,
      utility: args.utilityModel,
      reviewer: args.reviewerModel,
    },
    enabledMcps: parseCommaList(args.enableMcp),
    sessionGuardianEnabled: args.sessionGuardian === undefined ? undefined : args.sessionGuardian === "yes",
    telemetryEnabled: args.disableTelemetry ? false : undefined,
  }
}

export function detectedToInitialValues(detected: DetectedConfig): {
  claude: ClaudeSubscription
  openai: BooleanArg
  gemini: BooleanArg
  copilot: BooleanArg
  opencodeZen: BooleanArg
  zaiCodingPlan: BooleanArg
  kimiForCoding: BooleanArg
  opencodeGo: BooleanArg
  vercelAiGateway: BooleanArg
} {
  let claude: ClaudeSubscription = "no"
  if (detected.hasClaude) {
    claude = detected.isMax20 ? "max20" : "yes"
  }

  return {
    claude,
    openai: detected.hasOpenAI ? "yes" : "no",
    gemini: detected.hasGemini ? "yes" : "no",
    copilot: detected.hasCopilot ? "yes" : "no",
    opencodeZen: detected.hasOpencodeZen ? "yes" : "no",
    zaiCodingPlan: detected.hasZaiCodingPlan ? "yes" : "no",
    kimiForCoding: detected.hasKimiForCoding ? "yes" : "no",
    opencodeGo: detected.hasOpencodeGo ? "yes" : "no",
    vercelAiGateway: detected.hasVercelAiGateway ? "yes" : "no",
  }
}
