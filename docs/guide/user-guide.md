# Oh My Crew User Guide

This guide explains Oh My Crew in everyday language. You do not need to be a programmer to use it well. Think of Oh My Crew as a way to turn one OpenCode chat into a small AI team with different jobs.

If you have not installed it yet, start with the [Installation Guide](./installation.md).

## The Simple Idea

OpenCode normally gives you one AI assistant. Oh My Crew adds a crew of specialized assistants:

- One agent leads the work.
- Some agents research.
- Some agents plan.
- Some agents review.
- Some agents can work in the background while the main chat continues.

You can still talk normally. You do not need to manage every agent by hand. Most of the time, you ask for the result you want and OMC chooses the right workflow.

## Quick Start

After installation and restarting OpenCode, try one of these prompts.

```text
ultrawork
Please check this project, understand what it does, find any obvious problems, fix what is safe to fix, and verify your work.
```

```text
I want to add a new feature, but plan first. Ask me the important questions before changing files.
```

```text
hyperplan
I want the best plan for launching this app. Challenge the idea from multiple angles before making the final plan.
```

```text
team mode
Use a small team to research, plan, and review this task before implementing it.
```

## Main Features

### Crew Agents

OMC gives each agent a clear role name. You can use them naturally:

| Agent | Best For | Example prompt |
| --- | --- | --- |
| Captain | Leading complex hands-off work | `Captain, finish this task end to end and verify it.` |
| Strategist | Deep implementation and debugging | `Ask Strategist to investigate why this keeps failing.` |
| Architect | Planning before building | `Use Architect to make a plan before changing code.` |
| Foreman | Executing an existing plan step by step | `Foreman, work through the plan and keep tasks organized.` |
| Sage | Read-only advice and architecture review | `Ask Sage to review this design without editing files.` |
| Scout | Fast project search | `Ask Scout where the login flow is implemented.` |
| Scribe | Documentation and external examples | `Ask Scribe to find official docs and examples for this library.` |
| Advisor | Finds hidden risks before planning | `Ask Advisor what we might be missing.` |
| Auditor | Reviews plans or finished work | `Ask Auditor to check for bugs, regressions, and missing tests.` |
| Cadet | Smaller delegated tasks | Usually used automatically by OMC. |
| Lookout | Images, screenshots, and PDFs | `Ask Lookout to inspect this screenshot and explain the issue.` |

You do not have to memorize these names. For normal use, start with `ultrawork`, `team mode`, or planning prompts.

### `ultrawork` / `ulw`

Use `ultrawork` when you want OMC to take a broad task and push it to completion.

What it does:

- Understands the project before acting.
- Breaks the request into smaller tasks.
- Uses research, planning, coding, and review agents when useful.
- Keeps going until the task is genuinely handled.
- Verifies with tests, builds, or other checks when available.

Good use cases:

- "Fix this bug and verify it."
- "Add this feature across the app."
- "Read the project and continue the unfinished task."
- "Clean up this release and prepare it for publishing."

Example:

```text
ulw
Add a settings page for notification preferences. Follow the existing design, update tests, and verify the build.
```

### Architect / Planner Mode

Use planning mode when the job is important, unclear, or risky. The agent should ask questions and create a plan before changing files.

What it does:

- Clarifies what you really want.
- Finds missing decisions.
- Creates a structured plan.
- Lets you review the plan before execution.
- Works well for multi-day projects, big refactors, launches, and production changes.

Example:

```text
Plan first. I want to redesign the onboarding flow. Ask me questions, then create a step-by-step plan with risks and verification.
```

After the plan is ready, you can say:

```text
Start work on this plan.
```

### Team Mode

Team Mode lets OMC run a named group of agents for one coordinated job. It is useful when you want several viewpoints at once instead of one assistant thinking alone.

What it does:

- Creates a temporary team run.
- Gives team members their own tasks.
- Lets members send messages and share findings.
- Tracks team tasks and status.
- Cleans up when the work is done.

Good use cases:

- Researching a big decision.
- Comparing multiple implementation options.
- Having one member implement while another reviews.
- Splitting frontend, backend, and testing work.

How to enable:

```jsonc
{
  "team_mode": {
    "enabled": true
  }
}
```

Put this in `~/.config/opencode/oh-my-crew.jsonc`, then restart OpenCode.

Example:

```text
team mode
Create a team for this task: one member researches the current code, one proposes the plan, one reviews risks, and one checks tests. Then give me the final recommendation.
```

### Hyperplan

Hyperplan is a special planning workflow built on Team Mode. It is for serious decisions where you want the plan challenged hard before you trust it.

What it does:

- Starts an adversarial planning team.
- Each member analyzes the problem independently.
- Members attack each other's assumptions.
- Members defend, refine, or concede.
- The final planning agent turns the strongest ideas into a plan.

Good use cases:

- Product launch plans.
- Architecture choices.
- Security-sensitive changes.
- "I want the best plan, not the first plan."

How to use:

```text
hyperplan
I want to migrate this app to a new auth system. Challenge the options, find risks, then produce the best plan.
```

Team Mode must be enabled for Hyperplan.

### Background Agents

Background agents let OMC do more than one thing at a time.

What it does:

- Sends a research or review task to another agent.
- Lets the main agent keep working.
- Reports back when the background work is ready.
- Can be used for parallel research, implementation, review, or testing.

Good use cases:

- One agent searches the codebase while another fixes the bug.
- One agent checks documentation while another writes the feature.
- Several agents review different parts of a large change.

You usually do not need to call background tools manually. Tell OMC what you want:

```text
Use background agents where helpful. I want one agent to research the API, one to inspect existing patterns, and one to review the final changes.
```

### Session Guardian

Session Guardian helps long work survive across multiple OpenCode sessions.

What it does:

- Creates git checkpoints after finished tasks.
- Watches context usage so the session does not collapse at the worst time.
- Creates handoff docs in `HANDOFF_DOC/`.
- Gives you a resume prompt for the next session.
- Keeps secrets in `.credentials/` instead of hardcoding them.

Good use cases:

- Long refactors.
- Release preparation.
- Multi-session debugging.
- Work where you want a clear trail of what changed and why.

You usually do not need to enable it manually. It is loaded for Captain and Strategist by default.

### Built-In MCPs

MCPs are extra information sources or tools. In plain language: they let the agent look things up or use specialized services.

OMC includes:

- Web search for current information when available.
- Context7 for official library documentation.
- Grep.app for searching public GitHub code examples.

Good use cases:

- "Check the official docs before changing this."
- "Find examples of how other projects use this library."
- "Search the web for the latest API behavior."

Example:

```text
Before coding, use official docs and public examples to confirm the right approach.
```

### LSP And AST-Grep Tools

These are safer code-navigation and code-editing tools.

In plain language:

- LSP is like giving the agent IDE features such as "go to definition" and "find references."
- AST-Grep lets the agent search code by structure, not just text.

Good use cases:

- Renaming functions safely.
- Finding all places a feature is used.
- Refactoring code without guessing.
- Checking problems before a build fails.

Example:

```text
Use code navigation tools before refactoring. Find all references first, then make the change safely.
```

### Model Fallbacks

Model fallback means OMC can try another configured model when the first one is unavailable.

What it helps with:

- Provider downtime.
- Rate limits.
- Missing access to a model.
- Different agents needing different model strengths.

Example:

```text
If the primary model is unavailable, use the configured fallback and continue.
```

### Installer And Provider Setup

OMC includes an installer so you do not have to hand-edit every config file.

What it does:

- Adds `oh-my-crew` to OpenCode.
- Writes `oh-my-crew.json`.
- Preserves your existing provider settings.
- Helps configure Claude, OpenAI, Gemini, Copilot, OpenCode Zen, OpenCode Go, Z.ai, Kimi, Vercel AI Gateway, AXR AI, or custom OpenAI-compatible providers.
- Backs up config files before writing.

Use:

```bash
npx oh-my-crew@latest install
```

### Updating OMC

If OMC is already installed, update by running the same installer again:

```bash
npx oh-my-crew@latest install
```

Then fully restart OpenCode.

This update path preserves your provider settings, backs up config files, removes duplicate old plugin entries, rewrites visible crew agent/MCP entries, and refreshes `oh-my-crew.json`.

If OpenCode still shows old or missing agents after restart, close OpenCode completely and clear only the OMC package cache:

Windows PowerShell:

```powershell
$pkg = Join-Path $env:USERPROFILE ".cache\opencode\packages\node_modules"
Remove-Item -LiteralPath (Join-Path $pkg "oh-my-crew") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath (Join-Path $pkg "oh-my-opencode") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath (Join-Path $pkg "oh-my-openagent") -Recurse -Force -ErrorAction SilentlyContinue
npx oh-my-crew@latest install
```

macOS / Linux:

```bash
rm -rf "$HOME/.cache/opencode/packages/node_modules/oh-my-crew" \
       "$HOME/.cache/opencode/packages/node_modules/oh-my-opencode" \
       "$HOME/.cache/opencode/packages/node_modules/oh-my-openagent"
npx oh-my-crew@latest install
```

Do not delete your full OpenCode config folder for a normal update.

For agent-guided setup, paste:

```text
Install and configure oh-my-crew by following the instructions here:
https://raw.githubusercontent.com/michaelxer/oh-my-crew/refs/heads/oh-my-crew/docs/guide/installation.md
```

### Claude Code Compatibility

OMC can read many Claude Code-style settings, commands, skills, hooks, agents, and MCP files.

What this means:

- If you already used Claude Code workflows, many can carry over.
- Project skills and commands can be reused.
- Teams can keep existing instructions instead of rewriting everything.

You do not need this for basic use.

### Hooks And Recovery

Hooks are automatic helpers that run at important moments.

They can:

- Detect keywords like `ultrawork`, `hyperplan`, and `team mode`.
- Recover from common API or message problems.
- Protect against overwriting files too casually.
- Preserve important context during long sessions.
- Show update notifications.
- Remind agents to use the right specialists.

You do not need to operate hooks manually. They work in the background.

### Slash Commands And Skills

Skills are reusable instructions for special kinds of work. Slash commands are shortcut workflows.

Good use cases:

- Browser testing.
- Git cleanup.
- Refactoring.
- Review workflows.
- Project-specific repeated tasks.

Example:

```text
Use the relevant skill for this task and explain which one you used.
```

## Which Mode Should I Use?

| Situation | Use |
| --- | --- |
| You want the agent to handle everything | `ultrawork` or `ulw` |
| The task is risky or unclear | Architect / planning mode |
| You want several agents to discuss or split work | Team Mode |
| You want a plan challenged from many angles | Hyperplan |
| You want advice without edits | Sage |
| You want fast project search | Scout |
| You want docs or web examples | Scribe |
| You are working for a long time | Session Guardian |

## Beginner-Friendly Prompt Recipes

### Fix A Bug

```text
ultrawork
Find why this bug happens, fix it, and verify the fix. Explain the cause in simple language when done.
```

### Add A Feature

```text
Plan briefly, then implement this feature. Follow the existing project style, update tests if needed, and verify the result.
```

### Review Work

```text
Review the current changes for bugs, regressions, missing tests, and confusing code. Do not change files unless you find a clear fix.
```

### Learn A Project

```text
Read this project and explain what it does in plain language. Then tell me the safest next steps.
```

### Make A Serious Plan

```text
hyperplan
I need a strong plan for this project. Challenge assumptions, compare options, identify risks, and give me the best final plan.
```

### Continue From A Handoff

```text
Read all files in HANDOFF_DOC, understand the latest state, then continue the unfinished task. Check the repo before editing.
```

## Practical Tips

- Be clear about the result you want, not only the action.
- Say whether the agent may edit files, run tests, commit, push, or publish.
- For risky work, ask for a plan first.
- For hands-off work, include `ultrawork`.
- For major decisions, use `hyperplan`.
- Restart OpenCode after changing plugin or OMC config.
- Never paste API keys into chat. Use OpenCode auth or environment variables.

## Troubleshooting

### The agents do not appear

Restart OpenCode. Plugin changes load when OpenCode starts.

If they still do not appear, run:

```bash
npx oh-my-crew@latest install
```

If they are still missing after a full restart, use the cache cleanup steps in [Updating OMC](#updating-omc).

### Team Mode or Hyperplan says tools are missing

Enable Team Mode:

```jsonc
{
  "team_mode": {
    "enabled": true
  }
}
```

Save it in `~/.config/opencode/oh-my-crew.jsonc`, then restart OpenCode.

### A provider or model fails

Check provider login first:

```bash
opencode auth login
```

If you configured fallbacks, OMC may continue with another model.

### The current session is getting too long

Let Session Guardian create a handoff, then start a new session with the resume prompt.

## More Reading

- [Installation Guide](./installation.md)
- [Orchestration Guide](./orchestration.md)
- [OMC Agent-Model Matching Guide](./omc-agent-model-matching.md)
- [Configuration Reference](../reference/configuration.md)
- [Features Reference](../reference/features.md)
