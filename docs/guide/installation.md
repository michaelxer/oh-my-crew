# Installation

Oh My Crew installs as an OpenCode plugin named `oh-my-crew`. The installer can run as a friendly wizard or as a fully scripted command for agents and setup automation.

## Quick Start

```bash
npx oh-my-crew install
```

or, with Bun:

```bash
bunx oh-my-crew install
```

The wizard checks for OpenCode, adds `oh-my-crew` to the OpenCode `plugin` array, writes `oh-my-crew.json`, preserves existing provider settings, and backs up files before writing.

## OpenCode Prerequisite

Check OpenCode first:

```bash
opencode --version
```

If it is missing, install OpenCode from the official docs, then rerun the Oh My Crew installer.

## npm Install Path

Use this when you want the package installed directly in the OpenCode config directory:

```bash
cd ~/.config/opencode
npm install oh-my-crew --save
```

Then ensure `opencode.json` includes:

```json
{
  "plugin": ["oh-my-crew"]
}
```

On Windows, the OpenCode config directory is commonly `%USERPROFILE%\.config\opencode`.

## Non-Interactive Setup

Use `--no-tui` for scripts and LLM-agent setup:

```bash
bunx oh-my-crew install --no-tui \
  --claude=yes \
  --openai=yes \
  --gemini=no \
  --copilot=no \
  --opencode-zen=no \
  --opencode-go=no \
  --zai-coding-plan=no \
  --kimi-for-coding=no \
  --vercel-ai-gateway=no
```

Supported flags:

- `--claude=<yes|no|max20>`
- `--openai=<yes|no>`
- `--gemini=<yes|no>`
- `--copilot=<yes|no>`
- `--opencode-zen=<yes|no>`
- `--opencode-go=<yes|no>`
- `--zai-coding-plan=<yes|no>`
- `--kimi-for-coding=<yes|no>`
- `--vercel-ai-gateway=<yes|no>`
- `--custom-provider=<yes|no>`
- `--custom-provider-id=<id>`
- `--custom-base-url=<url>`
- `--captain-model=<provider/model>`
- `--strategist-model=<provider/model>`
- `--foreman-model=<provider/model>`
- `--architect-model=<provider/model>`
- `--reviewer-model=<provider/model>`
- `--utility-model=<provider/model>`
- `--enable-mcp=<websearch,context7,grep_app>`
- `--session-guardian=<yes|no>`
- `--disable-telemetry`
- `--skip-auth`

Custom provider flags never write API keys. Configure keys through OpenCode auth or environment variables for your provider.

## Agent Model Mapping

The installer writes explicit overrides only when you provide them. Otherwise each agent uses its built-in fallback chain.

| Installer flag | Agents |
| --- | --- |
| `--captain-model` | Captain - Ultraworker (`sisyphus`) |
| `--strategist-model` | Strategist - Deep Agent (`hephaestus`) |
| `--foreman-model` | Foreman - Plan Executor (`atlas`) |
| `--architect-model` | Architect - Plan Builder (`prometheus`) |
| `--reviewer-model` | Sage, Auditor, Advisor (`oracle`, `momus`, `metis`) |
| `--utility-model` | Scout, Scribe (`explore`, `librarian`) |

## Built-In MCPs

Built-in MCPs are enabled by default:

- `websearch`
- `context7`
- `grep_app`

To keep only a subset:

```bash
bunx oh-my-crew install --no-tui --claude=yes --gemini=no --copilot=no --enable-mcp=websearch,context7
```

This writes `disabled_mcps` for the omitted built-ins.

## Verification

After installation:

```bash
opencode debug config
opencode agent list
opencode mcp list
bunx oh-my-crew doctor
```

Confirm the agent list includes `Foreman - Plan Executor`. If it is missing, rerun the installer or add:

```json
{
  "agents": {
    "atlas": { "model": "anthropic/claude-sonnet-4-6" }
  }
}
```

## Troubleshooting

If OpenCode reports `Cannot find package 'zod'`, upgrade to a release where `zod` is a runtime dependency:

```bash
cd ~/.config/opencode
npm install oh-my-crew@latest --save
```

If duplicate agents appear, remove legacy plugin entries such as `oh-my-opencode`, `oh-my-openagent`, or `oh-my-china` from `opencode.json`. The installer removes those entries when it updates the plugin array.

If MCPs are missing, check `disabled_mcps` in `oh-my-crew.json` and run `opencode mcp list`.

If Session Guardian is unwanted, run with `--session-guardian=no` or add `"session-guardian"` to `disabled_skills`.

Anonymous telemetry can be disabled with `--disable-telemetry`, `OMO_SEND_ANONYMOUS_TELEMETRY=0`, or `OMO_DISABLE_POSTHOG=1`.

