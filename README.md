<div align="center">

# Oh My Crew

### A role-based agent fork of [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)

Clean, role-descriptive agent names with content-filter-safe system prompts for AI proxy providers.

[![npm version](https://img.shields.io/npm/v/oh-my-crew)](https://www.npmjs.com/package/oh-my-crew)
[![GitHub stars](https://img.shields.io/github/stars/michaelxer/oh-my-crew?style=social)](https://github.com/michaelxer/oh-my-crew)
[![npm downloads](https://img.shields.io/npm/dm/oh-my-crew)](https://www.npmjs.com/package/oh-my-crew)

[English](README.md) | [Bahasa Indonesia](README.id.md)

</div>

---

## What is this?

**Oh My Crew** is a fork of [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) (by [@code-yeongyu](https://github.com/code-yeongyu)), based on [oh-my-china](https://github.com/enowdev/oh-my-china) (by [@enowdev](https://github.com/enowdev)), with the following modifications:

1. **System prompts adjusted** to pass through AI proxy content filters
2. **All agents renamed** to clean, role-descriptive crew names -- no political, cultural, or mythological references

### Agent Roster

| Original | Crew Name | Role |
|----------|-----------|------|
| Sisyphus | **Captain** | Main orchestrator. Steers the ship. |
| Hephaestus | **Strategist** | Autonomous deep worker. Plans and executes. |
| Oracle | **Sage** | Read-only consultant. Wisdom without action. |
| Librarian | **Scribe** | External docs search. Finds written knowledge. |
| Explore | **Scout** | Codebase search. Reconnaissance specialist. |
| Atlas | **Foreman** | Todo orchestrator. Keeps work on track. |
| Prometheus | **Architect** | Strategic planner. Designs before building. |
| Metis | **Advisor** | Pre-planning consultant. Identifies risks. |
| Momus | **Auditor** | Plan reviewer/critic. The quality gate. |
| Sisyphus-Junior | **Cadet** | Task executor. Follows orders. |
| Multimodal Looker | **Lookout** | Vision/PDF analysis. Sharp-eyed observer. |

### Content Filter Fix

The phrase `"Powerful AI Agent"` combined with identity override directives triggers some AI proxy content filters. This fork replaces it with softer phrasing that passes through.

### Session Guardian (NEW)

Built-in skill that gives agents **autonomous session lifecycle management**:

| Feature | What It Does |
|---------|-------------|
| **Git Checkpoints** | Auto-commits after each completed task. One commit per task, conventional commit messages. |
| **Context Monitoring** | Tracks context window usage via heuristics + system signals. Knows when to stop. |
| **Smart Handoff Timing** | Never interrupts mid-task. Finishes current work first, then creates handoff. |
| **Structured Handoff Docs** | Generates `HANDOFF_DOC/handoff-NNN.md` with full context for the next session. |
| **Chain Continuity** | Each handoff carries forward decisions and context from ALL previous sessions. |
| **Copy-Paste Resume** | Outputs a ready-to-paste prompt for starting the next session seamlessly. |
| **Credentials Protection** | Manages `.credentials/` folder for API keys, tokens, passwords. Auto-added to `.gitignore`. Agents never hardcode secrets in source code. |

**How it works:**

```text
Agent works -> completes task -> git commit -> checks context level
  |- Context OK -> picks up next task
  \- Context high (65%+) -> creates handoff -> provides resume prompt -> stops
```

The handoff files are saved to `HANDOFF_DOC/` in your project root (auto-added to `.gitignore`). Sensitive credentials go in `.credentials/` (also auto-gitignored). When starting a new session, paste the provided prompt and the agent picks up exactly where it left off.

Session Guardian is **auto-loaded** for Captain and Strategist -- no configuration needed.

---

## Installation

### Prerequisites

- [OpenCode](https://opencode.ai/docs) installed
- [Node.js](https://nodejs.org/) installed (includes npm)

### Step 1: Add to plugin config

Edit `~/.config/opencode/opencode.json` (or `opencode.jsonc`) and add `"oh-my-crew"` to the plugin array:

```json
{
  "plugin": ["oh-my-crew"]
}
```

> **Recommended:** Use `"oh-my-crew"` only. It includes everything you need from OMO and avoids dropdown duplication plus sub-agent routing conflicts.
>
> **Important:** If you keep `"oh-my-openagent@latest"` alongside OMC, you may get duplicate dropdown entries and old OMO sub-agent prompts can still win at runtime. For the cleanest setup, remove OMO and run OMC independently.

### Step 2: Restart OpenCode

OpenCode will auto-install the plugin from npm on startup. If the crew agents don't appear, install manually:

```bash
cd ~/.config/opencode
npm install oh-my-crew
```

Then restart OpenCode again.

### Step 3: Verify

```bash
opencode
# You should see Captain, Strategist, Sage, etc. in the agent dropdown
# Type "ultrawork" to activate all agents
```

### Configure your proxy provider

```json
{
  "provider": {
    "your-proxy": {
      "type": "openai",
      "url": "http://your-proxy:port/v1",
      "key": "your-api-key"
    }
  }
}
```

Anonymous telemetry is enabled by default to track active installations (DAU/WAU/MAU). A single event is sent at most once per UTC day per machine using a hashed installation identifier, never the raw hostname, and PostHog person profiles are not created. Disable with `OMO_SEND_ANONYMOUS_TELEMETRY=0` or `OMO_DISABLE_POSTHOG=1`. See [Privacy Policy](docs/legal/privacy-policy.md) and [Terms of Service](docs/legal/terms-of-service.md).

---

## Install from source (for developers)

Only needed if you want to modify the code:

```bash
git clone https://github.com/michaelxer/oh-my-crew.git
cd oh-my-crew
bun install
bun run build
bun link
```

Then add `"oh-my-crew"` to your `opencode.json` plugin array.

---

## Upstream Features

This fork inherits all features from oh-my-openagent:

| Feature | Description |
|---------|-------------|
| **Discipline Agents** | Captain orchestrates Strategist, Sage, Scribe, Scout in parallel |
| **`ultrawork` / `ulw`** | One word activates every agent. Runs until done |
| **IntentGate** | Analyzes true user intent before acting |
| **Hash-Anchored Edits** | `LINE#ID` content hash validates every change. Zero stale-line errors |
| **LSP + AST-Grep** | IDE-precision refactoring for agents |
| **Background Agents** | 5+ specialists running in parallel |
| **Built-in MCPs** | Exa (web search), Context7 (docs), Grep.app (GitHub search) |
| **Ralph Loop** | Self-referential loop until 100% done |
| **Architect Planner** | Interview-mode strategic planning before execution |
| **Claude Code Compatible** | All hooks, commands, skills, MCPs work unchanged |
| **Session Guardian** | Auto git checkpoints, context monitoring, structured handoff docs for seamless multi-session work |

For full documentation, see the [upstream project](https://github.com/code-yeongyu/oh-my-openagent).

---

## Syncing with Upstream

This is a proper GitHub fork. To pull latest upstream changes:

```bash
git remote add upstream https://github.com/code-yeongyu/oh-my-openagent.git
git fetch upstream
git merge upstream/dev
```

---

## Credits

This project is based on:

- **[oh-my-opencode / oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)** by **[@code-yeongyu](https://github.com/code-yeongyu)** (YeonGyu Kim) -- the original architecture, agents, tools, hooks, and all core features
- **[oh-my-china](https://github.com/enowdev/oh-my-china)** by **[@enowdev](https://github.com/enowdev)** -- the China-compatible fork with content filter fixes that this project builds upon

This fork renames all agents from cultural/political themed names to clean, role-descriptive crew names while preserving all upstream functionality.

- **Original repo**: [github.com/code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)
- **China fork**: [github.com/enowdev/oh-my-china](https://github.com/enowdev/oh-my-china)
- **npm**: [oh-my-crew](https://www.npmjs.com/package/oh-my-crew)
- **npm (original)**: [oh-my-opencode](https://www.npmjs.com/package/oh-my-opencode)
- **License**: [SUL-1.0](LICENSE.md) (inherited from upstream)
- **Discord**: [Join the community](https://discord.gg/PUwSMR9XNk)

---

## Support

If you find Oh My Crew useful, consider:

- Give it a [star on GitHub](https://github.com/michaelxer/oh-my-crew) to help others discover it
- Report issues or suggest features in [GitHub Issues](https://github.com/michaelxer/oh-my-crew/issues)
- Join the [Discord community](https://discord.gg/PUwSMR9XNk) for discussion

---

## License

This fork follows the same [SUL-1.0 license](LICENSE.md) as the upstream project.
See [NOTICE.md](NOTICE.md) for modification details as required by the license.
