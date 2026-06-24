import { world } from "@minecraft/server";
import { Database } from "./database.js";
// import { c } from "./colorcode.js";
// import { DEFAULT_RANKS} from '../config.js'

/**
 * RankManager — manages ranks entirely through world dynamic properties.
 *
 * Storage layout (inside the "Ranks" Database table):
 *   key  = rank id (string, e.g. "0", "1", "2")
 *   value = { name: string, rank_display: string }
 *
 * A separate dynamic property "RANK_DEFAULT" stores the default rank id.
 */

const rankDB = new Database("Ranks");


export const RankManager = {

    // ── Seed ────────────────────────────────────────────────────────────────
    /**
     * Populate the database with default ranks **only** if the table is empty.
     * Call this once during world initialization.
     */
    seedDefaults() {
        const existing = rankDB.all();
        if (Object.keys(existing).length === 0) {
            for (const [id, data] of Object.entries(DEFAULT_RANKS)) {
                rankDB.set(id, data);
            }
            // Set default rank id if not already set
            if (world.getDynamicProperty("RANK_DEFAULT") === undefined) {
                world.setDynamicProperty("RANK_DEFAULT", "1");
            }
            console.log("[RankManager] Seeded default ranks.");
        }
    },

    // ── CRUD ────────────────────────────────────────────────────────────────

    /**
     * Get all ranks as an object  { id: { name, rank_display }, ... }
     */
    getAll() {
        return rankDB.all();
    },

    /**
     * Get a single rank by its id string.
     * @param {string} id
     * @returns {{ name: string, rank_display: string } | null}
     */
    get(id) {
        return rankDB.get(String(id));
    },

    /**
     * Add or update a rank.
     * @param {string} id
     * @param {string} name
     * @param {string} rankDisplay - formatted display string (may contain §-codes)
     */
    set(id, name, rankDisplay) {
        rankDB.set(String(id), { name, rank_display: rankDisplay });
    },

    /**
     * Remove a rank by id.
     * @param {string} id
     * @returns {boolean}
     */
    remove(id) {
        return rankDB.delete(String(id));
    },

    // ── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Returns the default rank id (string).
     */
    getDefaultRankId() {
        return world.getDynamicProperty("RANK_DEFAULT") ?? "1";
    },

    /**
     * Update the default rank id.
     * @param {string} id
     */
    setDefaultRankId(id) {
        world.setDynamicProperty("RANK_DEFAULT", String(id));
    },

    /**
     * Returns an array of [id, { name, rank_display }] sorted by numeric id.
     */
    getAllSorted() {
        const all = rankDB.all();
        return Object.entries(all).sort((a, b) => Number(a[0]) - Number(b[0]));
    },

    /**
     * Get the next available numeric id (for auto-assigning).
     */
    nextId() {
        const all = rankDB.all();
        const ids = Object.keys(all).map(Number).filter(n => !isNaN(n));
        if (ids.length === 0) return "0";
        return String(Math.max(...ids) + 1);
    },
};
