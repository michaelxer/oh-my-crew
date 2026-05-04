# Installation

## For Humans

### Agent-guided install

Paste this into your LLM agent session:

```text
Install and configure oh-my-crew by following the instructions here:
https://raw.githubusercontent.com/michaelxer/oh-my-crew/refs/heads/oh-my-crew/docs/guide/installation.md
```

The agent should fetch this file with `curl`, ask about your subscriptions in chat, run the installer with `--no-tui`, verify the setup, and guide provider authentication.

### Terminal wizard

If you are installing yourself, run this in a real terminal. The terminal wizard will ask the setup questions there:

```bash
npx oh-my-crew@latest install
```

or, with Bun:

```bash
bunx oh-my-crew@latest install
```

The npm package runs the JS installer directly. Normal `npx` and `bunx` installs no longer depend on separate native platform packages.

In this guide, `--no-tui` means "no terminal menu". It does not mean "no questions". In agent-guided setup, the LLM asks the questions in chat and passes your answers as flags.

The wizard checks for OpenCode, asks first whether you have an active AXR AI subscription plan, adds `oh-my-crew` to the OpenCode `plugin` array, writes `oh-my-crew.json`, preserves existing provider settings, and backs up files before writing.

If you choose AXR AI Trial or Pro, the installer fetches the live catalog from:

```text
https://api.axrai.app/v1/models.json
```

It then writes the selected tier's OpenCode provider config into `opencode.json`/`opencode.jsonc` and maps OMC agents to models from that same tier only. It keeps the catalog's `{env:AXRAI_API_KEY}` placeholder, so set `AXRAI_API_KEY` in your environment before using AXR AI models.

Anonymous telemetry is enabled by default to track active installations (DAU/WAU/MAU). A single event is sent at most once per UTC day per machine using a hashed installation identifier, never the raw hostname, and PostHog person profiles are not created. Disable with `--disable-telemetry`, `OMO_SEND_ANONYMOUS_TELEMETRY=0`, or `OMO_DISABLE_POSTHOG=1`. See [Privacy Policy](../legal/privacy-policy.md) and [Terms of Service](../legal/terms-of-service.md).

## For LLM Agents

> **IMPORTANT: Use `curl` to fetch this file, not a summarizing webpage reader.** Summaries often drop important flags like `--axrai`, `--openai`, `--non-interactive`, and provider-specific setup notes.
>
> ```bash
> curl -fsSL https://raw.githubusercontent.com/michaelxer/oh-my-crew/refs/heads/oh-my-crew/docs/guide/installation.md
> ```

You are helping the user install Oh My Crew. Ask the questions below in chat, then run `npx oh-my-crew@latest install --no-tui ...` or `bunx oh-my-crew@latest install --no-tui ...`. Do not use the terminal TUI unless you have a real interactive terminal. `--no-tui` only disables the terminal menu; it does not remove the need to ask the user setup questions.

### Step 0: Ask About AXR AI

Ask first:

```text
Do you have an active AXR AI subscription plan?
```

If yes, ask which plan:

- Trial -> `--axrai=trial`
- Pro -> `--axrai=pro`
- No active AXR plan -> continue normal provider questions

If the user chooses AXR AI Trial or Pro, run one of these and skip the normal provider flags:

```bash
npx oh-my-crew@latest install --no-tui --axrai=trial
npx oh-my-crew@latest install --no-tui --axrai=pro
```

or:

```bash
bunx oh-my-crew@latest install --no-tui --axrai=trial
bunx oh-my-crew@latest install --no-tui --axrai=pro
```

AXR mode fetches the live model catalog and ignores older provider/model override flags so the generated config stays tied to the selected AXR tier. Do not invent AXR model IDs. Do not write raw API keys into config.

### Step 1: Ask Normal Provider Questions

If the user does not use AXR AI, ask these questions and map answers to flags:

1. Do you have a Claude Pro/Max subscription?
   - max20 mode -> `--claude=max20`
   - yes, normal Pro/Max -> `--claude=yes`
   - no -> `--claude=no`
2. Do you have an OpenAI/ChatGPT Plus subscription?
   - yes -> `--openai=yes`
   - no -> `--openai=no`
3. Will you integrate Google Gemini?
   - yes -> `--gemini=yes`
   - no -> `--gemini=no`
4. Do you have a GitHub Copilot subscription?
   - yes -> `--copilot=yes`
   - no -> `--copilot=no`
5. Do you have access to OpenCode Zen (`opencode/` models)?
   - yes -> `--opencode-zen=yes`
   - no -> `--opencode-zen=no`
6. Do you have an OpenCode Go subscription?
   - yes -> `--opencode-go=yes`
   - no -> `--opencode-go=no`
7. Do you have a Z.ai Coding Plan subscription?
   - yes -> `--zai-coding-plan=yes`
   - no -> `--zai-coding-plan=no`
8. Do you have a Kimi For Coding subscription?
   - yes -> `--kimi-for-coding=yes`
   - no -> `--kimi-for-coding=no`
9. Do you use Vercel AI Gateway?
   - yes -> `--vercel-ai-gateway=yes`
   - no -> `--vercel-ai-gateway=no`
10. Do you use a custom OpenAI-compatible provider?
   - yes -> ask provider id and base URL, then use `--custom-provider=yes --custom-provider-id=<id> --custom-base-url=<url>`
   - no -> `--custom-provider=no`

If the user has no Claude subscription, warn them that Captain works best with Claude-family models or the AXR/OpenCode/Kimi/GLM fallback families. The installer still works without Claude.

### Step 2: Check OpenCode

```bash
opencode --version
```

If OpenCode is missing, tell the user to install it from the official docs, then rerun this setup:

```text
https://opencode.ai/docs
```

### Step 3: Run The Installer

Use the flags from the user's answers:

```bash
npx oh-my-crew@latest install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  --opencode-zen=<yes|no> \
  --opencode-go=<yes|no> \
  --zai-coding-plan=<yes|no> \
  --kimi-for-coding=<yes|no> \
  --vercel-ai-gateway=<yes|no> \
  --custom-provider=<yes|no>
```

`--non-interactive` is an alias for `--no-tui`:

```bash
npx oh-my-crew@latest install --non-interactive --claude=no --openai=no --gemini=no --copilot=no
```

Examples:

- AXR Trial: `npx oh-my-crew@latest install --no-tui --axrai=trial`
- AXR Pro: `npx oh-my-crew@latest install --no-tui --axrai=pro`
- Claude + OpenAI: `npx oh-my-crew@latest install --no-tui --claude=yes --openai=yes --gemini=no --copilot=no`
- Claude max20 + Gemini: `npx oh-my-crew@latest install --no-tui --claude=max20 --openai=no --gemini=yes --copilot=no`
- Copilot only: `npx oh-my-crew@latest install --no-tui --claude=no --openai=no --gemini=no --copilot=yes`
- OpenCode Zen only: `npx oh-my-crew@latest install --no-tui --claude=no --openai=no --gemini=no --copilot=no --opencode-zen=yes`
- No subscriptions yet: `npx oh-my-crew@latest install --no-tui --claude=no --openai=no --gemini=no --copilot=no`

The installer will:

- Register `oh-my-crew` in `opencode.json`
- Remove duplicate legacy plugin entries such as `oh-my-opencode`, `oh-my-openagent`, and `oh-my-china`
- Write `oh-my-crew.json`
- Preserve existing provider settings
- Back up config files before writing
- Keep built-in MCPs, Session Guardian, and telemetry enabled by default unless explicitly changed

### Step 4: Optional Model Overrides

Only ask these if the user wants explicit per-role models. Otherwise rely on the built-in fallback chains.

| Installer flag | Agents |
| --- | --- |
| `--captain-model` | Captain - Ultraworker (`sisyphus`) |
| `--strategist-model` | Strategist - Deep Agent (`hephaestus`) |
| `--foreman-model` | Foreman - Plan Executor (`atlas`) |
| `--architect-model` | Architect - Plan Builder (`prometheus`) |
| `--reviewer-model` | Sage, Auditor, Advisor (`oracle`, `momus`, `metis`) |
| `--utility-model` | Scout, Scribe (`explore`, `librarian`) |

Custom provider flags and model overrides never write API keys. Configure keys through OpenCode auth or environment variables.

### Step 5: Configure Authentication

Guide the user through auth only for providers they selected. Use a real interactive terminal for `opencode auth login`.

Claude:

```bash
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
```

Gemini:

```bash
opencode auth login
# Provider: Google
# Choose the login method available in the user's OpenCode setup
```

AXR AI:

```bash
# Set this in the user's shell/profile; do not write the raw key into project files.
AXRAI_API_KEY=<user-key>
```

Custom OpenAI-compatible providers:

- Add provider auth through OpenCode or environment variables.
- Do not commit API keys.
- Preserve existing provider config.

### Step 6: Verify Setup

Run:

```bash
opencode debug config
opencode agent list
opencode mcp list
```

The published npm package is a lightweight installer CLI. For normal `npx`/`bunx` installs, use OpenCode's own diagnostics above instead of `oh-my-crew doctor`.

Confirm:

- `opencode.json` contains `oh-my-crew` in the `plugin` array
- The installer completion summary shows `Crew Models` with each agent's primary model and first fallback
- The agent list includes Captain, Strategist, Foreman, Architect, Sage, Scout, Scribe, Cadet, and Lookout
- `Foreman - Plan Executor` appears; internally it maps to `atlas`
- MCP list includes the enabled built-ins unless the user explicitly disabled them

If `Foreman - Plan Executor` is missing, rerun the installer. As a temporary manual workaround, add this to `oh-my-crew.json`:

```json
{
  "agents": {
    "atlas": { "model": "anthropic/claude-sonnet-4-6" }
  }
}
```

### Troubleshooting

If OpenCode reports `Cannot find package 'zod'`, upgrade:

```bash
cd ~/.config/opencode
npm install oh-my-crew@latest --save
```

If duplicate agents appear, remove legacy plugin entries such as `oh-my-opencode`, `oh-my-openagent`, or `oh-my-china` from `opencode.json`. The installer removes those entries when it updates the plugin array.

If MCPs are missing, check `disabled_mcps` in `oh-my-crew.json` and run `opencode mcp list`.

If Session Guardian is unwanted, run with `--session-guardian=no` or add `"session-guardian"` to `disabled_skills`.

Anonymous telemetry can be disabled with `--disable-telemetry`, `OMO_SEND_ANONYMOUS_TELEMETRY=0`, or `OMO_DISABLE_POSTHOG=1`.

### Finish

Tell the user: Congratulations, Oh My Crew is installed. Start OpenCode with:

```bash
opencode
```

For hands-off orchestration, include `ultrawork` or `ulw` in a prompt. For planning-first work, use Architect/Planner mode and then execute the plan.
