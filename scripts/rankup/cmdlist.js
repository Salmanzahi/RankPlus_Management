import {
  CommandPermissionLevel,
  CustomCommandParamType,
} from "@minecraft/server";

import { rank } from "./commands/rank.js";
import { help } from './commands/help.js'
import { setRankCmd } from './commands/rank.js'
// ── Handler Imports ────────────────────────────────────────────────────────

// ── Simple Commands ────────────────────────────────────────────────────────
export const commands = [
  {
    name: "creator:helpmenu",
    description: "Help",
    permissionLevel: CommandPermissionLevel.Any,
    handler: help,
  },
  {
    name:'creator:debug',
    description: "Toggle debug mode (Usefull for command block project)",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    handler: help,
  },
  {
    name:'creator:setrank',
    description: "Set player(s) rank ( need operator permisssions !)",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "player" },
      { type: CustomCommandParamType.Integer,        name: "rankId" },
    ],
    handler: setRankCmd,
  }
  
];

// ── Enums ──────────────────────────────────────────────────────────────────
export const enums = [
  { name: "creator:rankenum",    values: ["info", "rankui", "set", "remove", "playerinfo", "edit", "add", 'list']}
];

// ── Enum-dependent Commands ────────────────────────────────────────────────
export const complexCommands = [
  {
    name: "creator:rank",
    description: "Rank system!",
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
      { name: "creator:rankenum",       type: CustomCommandParamType.Enum }

    ],
    optionalParameters: [
      {name: 'selector', type: CustomCommandParamType.EntitySelector},
    ],
    handler: rank,
  }
];

// ── Registration ───────────────────────────────────────────────────────────
/**
 * @param {import("@minecraft/server").CustomCommandRegistry} registry
 */
export function registerAll(registry) {
  // 1. Simple commands — definition + handler live in the same object
  commands.forEach(({ handler, ...definition }) =>
    registry.registerCommand(definition, handler),
  );

  // 2. Enums (must be registered before any command that references them)
  enums.forEach(({ name, values }) => registry.registerEnum(name, values));

  // 3. Enum-dependent commands
  complexCommands.forEach(({ handler, ...definition }) =>
    registry.registerCommand(definition, handler),
  );
}