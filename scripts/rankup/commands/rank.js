import { world, system, CustomCommandError, CustomCommandStatus } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { c } from "../lib/colorcode.js";
import { RANK_DATA } from "../config.js";
import { RankManager } from "../lib/rankManager.js";
import { Database } from '../lib/database.js'
import { success, error } from "../lib/notification.js";

const playerDB = new Database("Players")
// const defaultRank =  parseInt(RankManager.getDefaultRankId())

export function rank(origin, rankenum) {
  system.runTimeout(() => {
    const entityId = origin?.sourceEntity?.id;
    const player = (typeof entityId === 'string') ? (world.getEntity(entityId) ?? null) : null;

    const isPlayer = player !== null && player.typeId === "minecraft:player";

    if (isPlayer && !player.hasTag('RANK2026:ADMIN')) {
        error(player, `${c.red}You don't have permission to use this command! please add tag RANK2026:ADMIN TO YOUR PROFILE\n/tag @s add RANK2026:ADMIN`);
        return;
    }
    switch (rankenum) {
      case "rankui":
        showgui(player, origin);
        break;
    }
      
  },);
}


function showgui(player, origin){
  if (!player || player.typeId !== "minecraft:player") {
    world.sendMessage("[Rank System] showgui: Not a player!");
    return;
  }
     let form = new ActionFormData()
     form.title('§l§5Rank Manager')
     form.button('§2✚ §rAdd Rank')
     form.button('§6✎ §rEdit Rank')
     form.button('§c✖ §rRemove Rank')
     form.button('§b♛ §rSet Player Rank')
     form.button('§7⬛ §rClose')
     form.show(player).then((r) => {
      if (r.canceled) return;
     switch(r.selection){
      case 0: 
        addRank(player) 
        break;
      case 1:
        editRank(player)
        break;
      case 2:
        removeRank(player)
        break;
      case 3: 
        setRank(player)
        break;
      case 4: 
        break;
     }
     })
    
}


// ── Add a new rank ──────────────────────────────────────────────────────────
function addRank(player, rankId='', rankName='', rankDisplay=''){
  if (!player || player.typeId !== "minecraft:player") {
    world.sendMessage("[Rank System] addRank: Not a player!");
    return;
  }
  const nextId = RankManager.nextId();
  let form = new ModalFormData()
  form.title('§l§2Add Rank')
  form.textField(`Rank ID\n§7(next available: ${nextId})`, `E.g: ${nextId}`)
  form.textField('Rank Name', 'E.g: Admin, Guest, Member, Staff')
  form.textField(
    'Rank Display Format\n§7Use § color codes for colors\n§7Example: §c[ADMIN]§r',
    'E.g: §c[ADMIN]§r'
  )
  form.show(player).then((r) => {
    if (r.canceled) return;
    const [rankId, rankName, rankDisplay] = r.formValues;

    if (!rankId || !rankName || !rankDisplay) {
      error(player, `${c.red}All fields are required!`);
      return;
    }

    // Check if rank id already exists
    if (RankManager.get(rankId)) {
      error(player, `${c.red}Rank ID '${rankId}' already exists! Use Edit to modify it.`);
      return;
    }

    RankManager.set(rankId, rankName, rankDisplay);
    success(player, `${c.green}Successfully created rank ${rankDisplay}${c.green} with ID: ${c.yellow}${rankId}`);
  });
}


// ── Edit an existing rank ───────────────────────────────────────────────────
function editRank(player, rankId="", rankName="", rankDisplay=""){
  if (!player || player.typeId !== "minecraft:player") {
    world.sendMessage("[Rank System] editRank: Not a player!");
    return;
  }
  const sorted = RankManager.getAllSorted();

  if (sorted.length === 0) {
    error(player, `${c.red}No ranks exist to edit!`);
    return;
  }

  const rankLabels = sorted.map(([id, data]) => `§r[${id}] ${data.rank_display}§r - ${data.name}`);

  let selectForm = new ActionFormData();
  selectForm.title('§l§6Select Rank to Edit');
  for (const label of rankLabels) {
    selectForm.button(label);
  }
  selectForm.show(player).then((r) => {
    if (r.canceled) return;
    const [selectedId, selectedData] = sorted[r.selection];

    let editForm = new ModalFormData();
    editForm.title(`§l§6Edit Rank [${selectedId}]`);
    editForm.textField('Rank Name', 'Enter new name');
    editForm.textField(
      'Rank Display Format\n§7Use § color codes',
      'E.g: §c[ADMIN]§r',
    );
    editForm.show(player).then((r2) => {
      if (r2.canceled) return;
      const [newName, newDisplay] = r2.formValues;

      if (!newName || !newDisplay) {
        error(player, `${c.red}All fields are required!`);
        return;
      }

      RankManager.set(selectedId, newName, newDisplay);
      success(player, `${c.green}Successfully updated rank ${newDisplay}${c.green} (ID: ${c.yellow}${selectedId}${c.green})`);
    });
  });
}


// ── Remove a rank ───────────────────────────────────────────────────────────
function removeRank(player, rankId=''){
  if (!player || player.typeId !== "minecraft:player") {
    world.sendMessage("[Rank System] removeRank: Not a player!");
    return;
  }
  const sorted = RankManager.getAllSorted();

  if (sorted.length === 0) {
    error(player, `${c.red}No ranks exist to remove!`);
    return;
  }

  const rankLabels = sorted.map(([id, data]) => `§r[${id}] ${data.rank_display}§r - ${data.name}`);

  let form = new ActionFormData();
  form.title('§l§cRemove Rank');
  for (const label of rankLabels) {
    form.button(label);
  }
  form.show(player).then((r) => {
    if (r.canceled) return;
    const [selectedId, selectedData] = sorted[r.selection];
    const defaultId = RankManager.getDefaultRankId();

    if (selectedId === defaultId) {
      error(player, `${c.red}Cannot remove the default rank! Change the default rank first.`);
      return;
    }

    RankManager.remove(selectedId);
    success(player, `${c.green}Successfully removed rank ${selectedData.rank_display}${c.green} (ID: ${c.yellow}${selectedId}${c.green})`);
  });
}


// ── Give a player a rank ────────────────────────────────────────────────────
export function setRank(player, rankId=1){
  const sorted = RankManager.getAllSorted();
  const allProfiles = playerDB.all();
  const profileEntries = Object.entries(allProfiles); // [ [playerId, profile], ... ]
  const playerNames = profileEntries.map(([id, profile]) => profile.name ?? id);
  const rankLabels = sorted.map(([id, data]) => `${data.rank_display}§r`);
  

  if (sorted.length === 0) {
    error(player, `${c.red}No ranks exist! Add a rank first.`);
    return;
  }

  if (profileEntries.length === 0) {
    error(player, `${c.red}No players found in database!`);
    return;
  }

 

  let form = new ModalFormData()
  form.title('§l§bSet Player Rank')
  form.dropdown('Select Player', playerNames)
  form.dropdown('Select Rank', rankLabels)

  form.show(player).then((r) => {
    if (r.canceled) return;
    const [selectedPlayerId, selectedProfile] = profileEntries[r.formValues[0]];
    const [selectedRankId, selectedRankData] = sorted[r.formValues[1]];

    selectedProfile.rank = parseInt(selectedRankId);
    playerDB.set(selectedPlayerId, selectedProfile);
    
    // Check if player is online and update nameTag instantly
    const allPlayers = world.getAllPlayers();
    const targetPlayer = allPlayers.find(p => p.id === selectedPlayerId || p.name === selectedProfile.name);
    if (targetPlayer) {
      targetPlayer.nameTag = `${selectedRankData.rank_display} §r${targetPlayer.name}`;
    }

    success(player, `${c.green}Successfully set ${selectedRankData.rank_display}${c.green} to ${c.yellow}${selectedProfile.name ?? selectedPlayerId}`);
  });
}


// function editgui(player){
//   if (!player || player.typeId !== "minecraft:player") {
//     world.sendMessage("[Rank System] editgui: Not a player!");
//     return;
//   }
// }

export function setRankCmd(origin, selector, rankId){
    system.runTimeout(() => {
    for ( const e of selector){
        const id = world.getEntity(e.id)
        const playerprofile = playerDB.get(id.id)
        const currentRankId = parseInt(playerprofile.rank)
        // if(currentRankId == rankId) {
        //   return SyntaxError
        // }
        playerprofile.rank = parseInt(rankId)
        playerDB.set(id.id, playerprofile)
        console.log(JSON.stringify(id.name))
        const rankDisplay = RankManager.get(parseInt(rankId)).rank_display;
      id.nameTag = `${rankDisplay} §r${id.name}`;
        console.log(JSON.stringify(playerprofile))
    }
    return { status: CustomCommandStatus.Success}
})
}