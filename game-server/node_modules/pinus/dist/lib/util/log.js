"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("pinus-logger");
/**
 * Configure pinus logger
 */
function configure(app, filename) {
    let serverId = app.getServerId();
    let base = app.getBase();
    logger.configure(filename, { serverId: serverId, base: base });
}
exports.configure = configure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3V0aWwvbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXVDO0FBR3ZDOztHQUVHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLEdBQWdCLEVBQUUsUUFBZ0I7SUFDMUQsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2pDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN6QixNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUpELDhCQUlDIn0=