import { world, system, CustomCommandError, CustomCommandStatus } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { c } from "../lib/colorcode.js";
import { RANK_DATA } from "../config.js";
import { RankManager } from "../lib/rankManager.js";
import { Database } from '../lib/database.js'
// import { system } from '@minecraft/server'
import { success, error } from "../lib/notification.js";
const playerDB = new Database("Players")


export function nickCmd(origin, selector, enumeration, name=''){
    system.runTimeout(() => {
        for (const e of selector){
            const entity = world.getEntity(e.id);
            if (!entity) continue;
            
            const profile = playerDB.get(entity.id);
            const playerRank = profile ? profile.rank : parseInt(RankManager.getDefaultRankId());
            const rankData = RankManager.get(String(playerRank));
            const playerRankDisplay = rankData ? rankData.rank_display : "";
            
            if (enumeration === 'set') {
                const displayName = name ? name : entity.name;
                entity.nameTag = `${playerRankDisplay} §r${displayName}`;
            } else if (enumeration === 'reset') {
                entity.nameTag = `${playerRankDisplay} §r${entity.name}`;
            }
        }
    });
}