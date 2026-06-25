import { world, system } from "@minecraft/server";
import { registerAll }  from "./cmdlist.js";
import { c }            from "./lib/colorcode.js";
import { Database } from "./lib/database.js";
import { RANK_DATA } from "./config.js";
import { RankManager } from "./lib/rankManager.js";


const playerDB = new Database("Players")
// ── Startup & Initialization ───────────────────────────────────────────────
system.beforeEvents.startup.subscribe(() => {
  system.runTimeout(() => {
    console.log("intisializing addons... RANK+ Management");
  });
});


world.afterEvents.playerSpawn.subscribe((event)=> {
  const player = event.player
  if (!event.initialSpawn) return

  RankManager.seedDefaults();

  let profile = playerDB.get(player.id)
  if (profile) {
    profile.joinCount += 1
    profile.lastseen = new Date().toISOString()
  } else {
    profile = {
      name: player.name,
      joinCount: 1,
      balance: 500,
      rank: parseInt(RankManager.getDefaultRankId()),
      lastseen: new Date().toISOString()
    }
  }
  playerDB.set(player.id,profile)

  // Update nametag 
  const rankData = RankManager.get(String(profile.rank));
  const rankDisplay = rankData ? rankData.rank_display : `§7[UNKNOWN]§r`;
  player.nameTag = `${rankDisplay} §r${player.name}`;
})
system.beforeEvents.startup.subscribe((init) => {
      registerAll(init.customCommandRegistry);
});

world.beforeEvents.chatSend.subscribe((event) => {
  const sender = event.sender;
  const senderRank = playerDB.get(sender.id)?.rank ?? parseInt(RankManager.getDefaultRankId());
  const message = event.message;
  const rankData = RankManager.get(String(senderRank));
  const rankDisplay = rankData ? rankData.rank_display : `${c.gray}[UNKNOWN]${c.reset}`;
  const {PREFIX, SEPERATOR, SUFFIX} = RANK_DATA.MESSAGE_LAYOUT

  event.cancel = true;
  world.sendMessage(`${PREFIX}${sender.nameTag}${SUFFIX}${message}`)
});


