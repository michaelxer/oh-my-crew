#!/usr/bin/env node
import { Command } from "commander"
import packageJson from "../../package.json" with { type: "json" }
import { install } from "./install"
import type { InstallArgs } from "./types"

const VERSION = packageJson.version

const program = new Command()

program
  .name("oh-my-crew")
  .description("Oh My Crew installer for OpenCode")
  .version(VERSION, "-v, --version", "Show version number")

program
  .command("install")
  .description("Install and configure oh-my-crew with interactive setup")
  .option("--no-tui", "Run in non-interactive mode (requires all options)")
  .option("--non-interactive", "Alias for --no-tui")
  .option("--claude <value>", "Claude subscription: no, yes, max20")
  .option("--openai <value>", "OpenAI/ChatGPT subscription: no, yes (default: no)")
  .option("--gemini <value>", "Gemini integration: no, yes")
  .option("--copilot <value>", "GitHub Copilot subscription: no, yes")
  .option("--opencode-zen <value>", "OpenCode Zen access: no, yes (default: no)")
  .option("--zai-coding-plan <value>", "Z.ai Coding Plan subscription: no, yes (default: no)")
  .option("--kimi-for-coding <value>", "Kimi For Coding subscription: no, yes (default: no)")
  .option("--opencode-go <value>", "OpenCode Go subscription: no, yes (default: no)")
  .option("--vercel-ai-gateway <value>", "Vercel AI Gateway: no, yes (default: no)")
  .option("--axrai <value>", "AXR AI plan: no, trial, pro (default: no)")
  .option("--custom-provider <value>", "Custom OpenAI-compatible provider: no, yes (default: no)")
  .option("--custom-provider-id <id>", "Custom provider id, e.g. openrouter or axrai")
  .option("--custom-base-url <url>", "Custom OpenAI-compatible base URL")
  .option("--captain-model <provider/model>", "Model override for Captain - Ultraworker")
  .option("--strategist-model <provider/model>", "Model override for Strategist - Deep Agent")
  .option("--foreman-model <provider/model>", "Model override for Foreman - Plan Executor")
  .option("--architect-model <provider/model>", "Model override for Architect - Plan Builder")
  .option("--reviewer-model <provider/model>", "Model override for Sage, Auditor, and Advisor")
  .option("--utility-model <provider/model>", "Model override for Scout and Scribe")
  .option("--enable-mcp <comma-list>", "Enable built-in MCPs: websearch,context7,grep_app")
  .option("--session-guardian <value>", "Session Guardian skill: no, yes (default: yes)")
  .option("--disable-telemetry", "Persistently disable anonymous telemetry in oh-my-crew config")
  .option("--skip-auth", "Skip authentication setup hints")
  .addHelpText("after", `
Examples:
  $ npx oh-my-crew install
  $ bunx oh-my-crew install
  $ npx oh-my-crew install --no-tui --claude=no --openai=no --gemini=no --copilot=no
  $ npx oh-my-crew install --no-tui --axrai=trial
  $ npx oh-my-crew install --no-tui --axrai=pro
`)
  .action(async (options) => {
    const args: InstallArgs = {
      tui: options.tui !== false && !options.nonInteractive,
      claude: options.claude,
      openai: options.openai,
      gemini: options.gemini,
      copilot: options.copilot,
      opencodeZen: options.opencodeZen,
      zaiCodingPlan: options.zaiCodingPlan,
      kimiForCoding: options.kimiForCoding,
      opencodeGo: options.opencodeGo,
      vercelAiGateway: options.vercelAiGateway,
      axrai: options.axrai,
      customProvider: options.customProvider,
      customProviderId: options.customProviderId,
      customBaseUrl: options.customBaseUrl,
      captainModel: options.captainModel,
      strategistModel: options.strategistModel,
      foremanModel: options.foremanModel,
      architectModel: options.architectModel,
      reviewerModel: options.reviewerModel,
      utilityModel: options.utilityModel,
      enableMcp: options.enableMcp,
      sessionGuardian: options.sessionGuardian,
      disableTelemetry: options.disableTelemetry ?? false,
      skipAuth: options.skipAuth ?? false,
    }
    const exitCode = await install(args)
    process.exit(exitCode)
  })

for (const commandName of ["doctor", "run", "get-local-version", "refresh-model-capabilities", "mcp"]) {
  program
    .command(commandName)
    .allowUnknownOption()
    .description("Available in legacy/native CLI builds")
    .action(() => {
      console.error(`oh-my-crew: "${commandName}" is not included in the lightweight npm installer CLI.`)
      console.error("Use the OpenCode plugin runtime for agent features, or use a legacy/native CLI build if needed.")
      process.exit(1)
    })
}

program
  .command("version")
  .description("Show version information")
  .action(() => {
    console.log(`oh-my-crew v${VERSION}`)
  })

program.parse()
