export type ClaudeSubscription = "no" | "yes" | "max20"
export type BooleanArg = "no" | "yes"

export interface InstallArgs {
  tui: boolean
  claude?: ClaudeSubscription
  openai?: BooleanArg
  gemini?: BooleanArg
  copilot?: BooleanArg
  opencodeZen?: BooleanArg
  zaiCodingPlan?: BooleanArg
  kimiForCoding?: BooleanArg
  opencodeGo?: BooleanArg
  vercelAiGateway?: BooleanArg
  customProvider?: BooleanArg
  customProviderId?: string
  customBaseUrl?: string
  captainModel?: string
  strategistModel?: string
  foremanModel?: string
  architectModel?: string
  utilityModel?: string
  reviewerModel?: string
  enableMcp?: string
  sessionGuardian?: BooleanArg
  disableTelemetry?: boolean
  skipAuth?: boolean
}

export interface InstallConfig {
  hasClaude: boolean
  isMax20: boolean
  hasOpenAI: boolean
  hasGemini: boolean
  hasCopilot: boolean
  hasOpencodeZen: boolean
  hasZaiCodingPlan: boolean
  hasKimiForCoding: boolean
  hasOpencodeGo: boolean
  hasVercelAiGateway: boolean
  customProviderId?: string
  customBaseUrl?: string
  modelOverrides?: {
    captain?: string
    strategist?: string
    foreman?: string
    architect?: string
    utility?: string
    reviewer?: string
  }
  enabledMcps?: string[]
  sessionGuardianEnabled?: boolean
  telemetryEnabled?: boolean
}

export interface ConfigMergeResult {
  success: boolean
  configPath: string
  error?: string
}

export interface DetectedConfig {
  isInstalled: boolean
  installedVersion: string | null
  hasClaude: boolean
  isMax20: boolean
  hasOpenAI: boolean
  hasGemini: boolean
  hasCopilot: boolean
  hasOpencodeZen: boolean
  hasZaiCodingPlan: boolean
  hasKimiForCoding: boolean
  hasOpencodeGo: boolean
  hasVercelAiGateway: boolean
}
