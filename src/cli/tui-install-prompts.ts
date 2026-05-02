import * as p from "@clack/prompts"
import type { Option } from "@clack/prompts"
import type {
  BooleanArg,
  ClaudeSubscription,
  DetectedConfig,
  InstallConfig,
} from "./types"
import { detectedToInitialValues } from "./install-validators"

async function selectOrCancel<TValue extends Readonly<string | boolean | number>>(params: {
  message: string
  options: Option<TValue>[]
  initialValue: TValue
}): Promise<TValue | null> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return null

  const value = await p.select<TValue>({
    message: params.message,
    options: params.options,
    initialValue: params.initialValue,
  })
  if (p.isCancel(value)) {
    p.cancel("Installation cancelled.")
    return null
  }
  return value as TValue
}

async function textOrCancel(params: {
  message: string
  placeholder?: string
}): Promise<string | null> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return null

  const value = await p.text({
    message: params.message,
    placeholder: params.placeholder,
  })
  if (p.isCancel(value)) {
    p.cancel("Installation cancelled.")
    return null
  }
  return String(value).trim()
}

export async function promptInstallConfig(detected: DetectedConfig): Promise<InstallConfig | null> {
  const initial = detectedToInitialValues(detected)

  const claude = await selectOrCancel<ClaudeSubscription>({
    message: "Do you have a Claude Pro/Max subscription?",
    options: [
      { value: "no", label: "No", hint: "Will use opencode/big-pickle as fallback" },
      { value: "yes", label: "Yes (standard)", hint: "Claude Opus 4.5 for orchestration" },
      { value: "max20", label: "Yes (max20 mode)", hint: "Full power with Claude Sonnet 4.6 for Librarian" },
    ],
    initialValue: initial.claude,
  })
  if (!claude) return null

  const openai = await selectOrCancel({
    message: "Do you have an OpenAI/ChatGPT Plus subscription?",
    options: [
      { value: "no", label: "No", hint: "Oracle will use fallback models" },
      { value: "yes", label: "Yes", hint: "GPT-5.4 for Oracle (high-IQ debugging)" },
    ],
    initialValue: initial.openai,
  })
  if (!openai) return null

  const gemini = await selectOrCancel({
    message: "Will you integrate Google Gemini?",
    options: [
      { value: "no", label: "No", hint: "Frontend/docs agents will use fallback" },
      { value: "yes", label: "Yes", hint: "Beautiful UI generation with Gemini 3.1 Pro" },
    ],
    initialValue: initial.gemini,
  })
  if (!gemini) return null

  const copilot = await selectOrCancel({
    message: "Do you have a GitHub Copilot subscription?",
    options: [
      { value: "no", label: "No", hint: "Only native providers will be used" },
      { value: "yes", label: "Yes", hint: "Fallback option when native providers unavailable" },
    ],
    initialValue: initial.copilot,
  })
  if (!copilot) return null

  const opencodeZen = await selectOrCancel({
    message: "Do you have access to OpenCode Zen (opencode/ models)?",
    options: [
      { value: "no", label: "No", hint: "Will use other configured providers" },
      { value: "yes", label: "Yes", hint: "opencode/claude-opus-4-7, opencode/gpt-5.5, etc." },
    ],
    initialValue: initial.opencodeZen,
  })
  if (!opencodeZen) return null

  const zaiCodingPlan = await selectOrCancel({
    message: "Do you have a Z.ai Coding Plan subscription?",
    options: [
      { value: "no", label: "No", hint: "Will use other configured providers" },
      { value: "yes", label: "Yes", hint: "Fallback for Librarian and Multimodal Looker" },
    ],
    initialValue: initial.zaiCodingPlan,
  })
  if (!zaiCodingPlan) return null

  const kimiForCoding = await selectOrCancel({
    message: "Do you have a Kimi For Coding subscription?",
    options: [
      { value: "no", label: "No", hint: "Will use other configured providers" },
      { value: "yes", label: "Yes", hint: "Kimi K2.5 for Sisyphus/Prometheus fallback" },
    ],
    initialValue: initial.kimiForCoding,
})
  if (!kimiForCoding) return null

  const opencodeGo = await selectOrCancel({
    message: "Do you have an OpenCode Go subscription?",
    options: [
      { value: "no", label: "No", hint: "Will use other configured providers" },
      { value: "yes", label: "Yes", hint: "OpenCode Go for quick tasks" },
    ],
    initialValue: initial.opencodeGo,
  })
  if (!opencodeGo) return null

  const vercelAiGateway = await selectOrCancel({
    message: "Do you have a Vercel AI Gateway API key?",
    options: [
      { value: "no", label: "No", hint: "Will use other configured providers" },
      { value: "yes", label: "Yes", hint: "Universal proxy for OpenAI, Anthropic, Google, etc." },
    ],
    initialValue: initial.vercelAiGateway,
  })
  if (!vercelAiGateway) return null

  const customProvider = await selectOrCancel<BooleanArg>({
    message: "Do you use a custom OpenAI-compatible provider?",
    options: [
      { value: "no", label: "No", hint: "Use only built-in provider ids" },
      { value: "yes", label: "Yes", hint: "You will enter provider id and base URL guidance" },
    ],
    initialValue: "no",
  })
  if (!customProvider) return null

  let customProviderId: string | undefined
  let customBaseUrl: string | undefined
  if (customProvider === "yes") {
    customProviderId = await textOrCancel({
      message: "Custom provider id",
      placeholder: "openrouter",
    }) ?? undefined
    if (!customProviderId) return null

    customBaseUrl = await textOrCancel({
      message: "Custom provider base URL",
      placeholder: "https://openrouter.ai/api/v1",
    }) ?? undefined
  }

  const captainModel = await textOrCancel({
    message: "Captain model override (blank for automatic)",
    placeholder: customProviderId ? `${customProviderId}/model-id` : "anthropic/claude-opus-4-7",
  })
  if (captainModel === null) return null

  const strategistModel = await textOrCancel({
    message: "Strategist model override (blank for automatic)",
    placeholder: "openai/gpt-5.5",
  })
  if (strategistModel === null) return null

  const foremanModel = await textOrCancel({
    message: "Foreman model override (blank for automatic)",
    placeholder: "anthropic/claude-sonnet-4-6",
  })
  if (foremanModel === null) return null

  const architectModel = await textOrCancel({
    message: "Architect model override (blank for automatic)",
    placeholder: "anthropic/claude-opus-4-7",
  })
  if (architectModel === null) return null

  const reviewerModel = await textOrCancel({
    message: "Sage/Auditor/Advisor model override (blank for automatic)",
    placeholder: "openai/gpt-5.5",
  })
  if (reviewerModel === null) return null

  const utilityModel = await textOrCancel({
    message: "Scout/Scribe fast model override (blank for automatic)",
    placeholder: "openai/gpt-5.4-mini-fast",
  })
  if (utilityModel === null) return null

  const enabledMcpsValue = await p.multiselect({
    message: "Enable built-in MCPs",
    options: [
      { value: "websearch", label: "websearch" },
      { value: "context7", label: "context7" },
      { value: "grep_app", label: "grep_app" },
    ],
    initialValues: ["websearch", "context7", "grep_app"],
  })
  if (p.isCancel(enabledMcpsValue)) {
    p.cancel("Installation cancelled.")
    return null
  }

  const sessionGuardian = await selectOrCancel<BooleanArg>({
    message: "Enable Session Guardian behavior?",
    options: [
      { value: "yes", label: "Yes", hint: "Keep the built-in session lifecycle skill enabled" },
      { value: "no", label: "No", hint: "Disable the session-guardian skill" },
    ],
    initialValue: "yes",
  })
  if (!sessionGuardian) return null

  const anonymousTelemetry = await selectOrCancel<BooleanArg>({
    message: "Enable anonymous telemetry?",
    options: [
      { value: "yes", label: "Yes", hint: "Daily active signal only; no prompts or code" },
      { value: "no", label: "No", hint: "Write anonymous_telemetry=false" },
    ],
    initialValue: "yes",
  })
  if (!anonymousTelemetry) return null

  return {
    hasClaude: claude !== "no",
    isMax20: claude === "max20",
    hasOpenAI: openai === "yes",
    hasGemini: gemini === "yes",
    hasCopilot: copilot === "yes",
    hasOpencodeZen: opencodeZen === "yes",
    hasZaiCodingPlan: zaiCodingPlan === "yes",
    hasKimiForCoding: kimiForCoding === "yes",
    hasOpencodeGo: opencodeGo === "yes",
    hasVercelAiGateway: vercelAiGateway === "yes",
    customProviderId,
    customBaseUrl,
    modelOverrides: {
      captain: captainModel || undefined,
      strategist: strategistModel || undefined,
      foreman: foremanModel || undefined,
      architect: architectModel || undefined,
      reviewer: reviewerModel || undefined,
      utility: utilityModel || undefined,
    },
    enabledMcps: enabledMcpsValue as string[],
    sessionGuardianEnabled: sessionGuardian === "yes",
    telemetryEnabled: anonymousTelemetry === "yes",
  }
}
