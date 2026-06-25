import {
  CommandPermissionLevel,
  CustomCommandParamType,
} from "@minecraft/server";

import { rank } from "./commands/rank.js";
import { help } from './commands/help.js'
import { setRankCmd } from './commands/rank.js'
import { nickCmd } from "./commands/nick.js";

export const commands = [

  {
    name:'rankplus:setrank',
    description: "Set player(s) rank ( need operator permisssions !)",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "player" },
      { type: CustomCommandParamType.Integer,        name: "rankId" },
    ],
    handler: setRankCmd,
  }
];


export const enums = [
  { name: "rankplus:rankenum",    values: [ "rankui" ] },
  { name: 'rankplus:nickenum', values:['set', 'reset'] }
];


export const complexCommands = [
  {
    name: "rankplus:rank",
    description: "Rank system!",
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
      { name: "rankplus:rankenum",       type: CustomCommandParamType.Enum }

    ],
    handler: rank,
  },{
    name:'rankplus:nick',
    description: "Change player nickname !",
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
      {name: 'selector', type: CustomCommandParamType.EntitySelector},
      {name: 'rankplus:nickenum', type: CustomCommandParamType.Enum}
    ],
    optionalParameters: [
      {name: 'name', type: CustomCommandParamType.String}
    ],
    handler: nickCmd
  }
];

// ── Registration ───────────────────────────────────────────────────────────
/**
 * @param {import("@minecraft/server").CustomCommandRegistry} registry
 */
export function registerAll(registry) {

  commands.forEach(({ handler, ...definition }) =>
    registry.registerCommand(definition, handler),
  );


  enums.forEach(({ name, values }) => registry.registerEnum(name, values));


  complexCommands.forEach(({ handler, ...definition }) =>
    registry.registerCommand(definition, handler),
  );
}