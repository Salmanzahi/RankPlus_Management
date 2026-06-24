import { c } from "./lib/colorcode.js";
// TIME OFFSET
export const UTC = 7



export const RANK_DATA = {
    // Chat message layout — still static config
    MESSAGE_LAYOUT: {
        PREFIX: '',
        SEPERATOR: ` ${c.bold} `,
        SUFFIX: `${c.reset} : `
    },

    // RANKS_DATA and DEFAULT_RANK are now managed dynamically.
    // Use RankManager from lib/rankManager.js to add/edit/remove ranks in-game.
}


// ── Default ranks seeded on first run ──────────────────────────────────────
export const DEFAULT_RANKS = {
    "0": { name: "admin",  rank_display: `${c.red}[ADMIN]${c.reset}` },
    "1": { name: "member", rank_display: `${c.gray}[MEMBER]${c.reset}` },
};
