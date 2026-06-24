import { world } from "@minecraft/server";

export class Database {
    /**
     * @param {string} tableName - The unique identifier/table name for this database.
     */
    constructor(tableName) {
        this.tableName = `db_${tableName}`;
        this.maxLimit = 32767;
    }

    /**
     * Fetch the entire underlying JSON object table
     * @private
     */
    _getAll() {
        try {
            const rawData = world.getDynamicProperty(this.tableName);
            return rawData ? JSON.parse(rawData) : {};
        } catch (error) {
            console.error(`[DB Error] Failed to read table '${this.tableName}':`, error);
            return {};
        }
    }

    /**
     * Save the entire table back to world properties
     * @private
     */
    _saveAll(data) {
        const jsonString = JSON.stringify(data);
        if (jsonString.length > this.maxLimit) {
            console.error(`[DB Critical] Table '${this.tableName}' exceeded the 32k limit! (${jsonString.length}/${this.maxLimit})`);
            return false;
        }
        world.setDynamicProperty(this.tableName, jsonString);
        return true;
    }

    // ==========================================
    // CRUD METHODS
    // ==========================================

    /**
     * CREATE / UPDATE: Save or overwrite data associated with a specific key
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        const data = this._getAll();
        data[key] = value;
        return this._saveAll(data);
    }

    /**
     * READ: Get data by its key
     * @param {string} key 
     * @returns {any | null}
     */
    get(key) {
        const data = this._getAll();
        return data[key] !== undefined ? data[key] : null;
    }

    /**
     * DELETE: Remove a record by its key
     * @param {string} key 
     */
    delete(key) {
        const data = this._getAll();
        if (data[key] !== undefined) {
            delete data[key];
            return this._saveAll(data);
        }
        return false;
    }

    /**
     * READ ALL: Returns all records in this table as an object
     * @returns {Record<string, any>}
     */
    all() {
        return this._getAll();
    }

    /**
     * Clear the entire table data
     */
    clear() {
        return this._saveAll({});
    }
}