# Guide Docs Notes

- Keep `agent-model-matching.md` as the upstream-style Oh My OpenAgent model matching reference. Avoid OMC-specific edits there so future upstream model-doc cherry-picks stay easy to compare.
- Use `omc-agent-model-matching.md` as the user-facing Oh My Crew model matching guide. It should translate public names to Captain, Strategist, Architect, Foreman, Advisor, Auditor, Sage, Scribe, Scout, Cadet, and Lookout.
- When upstream OMO changes model chains or model explanations in `agent-model-matching.md`, port the same behavioral change into `omc-agent-model-matching.md` and keep required JSON config keys such as `sisyphus`, `hephaestus`, `prometheus`, and `atlas` where users must type those keys.
- For AXR AI Pro or AXR AI Owner / Full Access users, consult the AXR recommendation section in `omc-agent-model-matching.md` before changing agent or category model assignments. For AXR Trial users, leave model selection to the installer because the Trial catalog is intentionally limited.
- User/agent-facing links should prefer `omc-agent-model-matching.md`; only link `agent-model-matching.md` as the upstream-sync reference.
