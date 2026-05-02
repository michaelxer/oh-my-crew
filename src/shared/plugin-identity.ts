export const PLUGIN_NAME = "oh-my-crew"
export const LEGACY_PLUGIN_NAME = "oh-my-opencode"
export const LEGACY_OPENAGENT_PLUGIN_NAME = "oh-my-openagent"
export const CONFLICTING_PLUGIN_NAMES = [
  LEGACY_PLUGIN_NAME,
  LEGACY_OPENAGENT_PLUGIN_NAME,
  "oh-my-china",
] as const
export const PUBLISHED_PACKAGE_NAME = PLUGIN_NAME
export const ACCEPTED_PACKAGE_NAMES = [PUBLISHED_PACKAGE_NAME, ...CONFLICTING_PLUGIN_NAMES] as const
export const CONFIG_BASENAME = "oh-my-crew"
export const LEGACY_CONFIG_BASENAME = "oh-my-opencode"
export const LEGACY_CONFIG_BASENAME_2 = "oh-my-openagent"
export const LOG_FILENAME = "oh-my-crew.log"
export const CACHE_DIR_NAME = "oh-my-crew"
