import { c } from "./lib/colorcode.js";



export const RANK_DATA = {
    
    MESSAGE_LAYOUT: {
        PREFIX: '',
        SEPERATOR: ` ${c.bold} `,
        SUFFIX: `${c.reset} : `
    },
}


export const DEFAULT_RANKS = {
    "0": { name: "admin",  rank_display: `${c.red}[ADMIN]${c.reset}` },
    "1": { name: "member", rank_display: `${c.gray}[MEMBER]${c.reset}` },
};
