"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Constants = require("./constants");
const constants_1 = require("./constants");
/**
 * Get system remote service path
 *
 * @param  {String} role server role: frontend, backend
 * @return {String}      path string if the path exist else null
 */
function getSysRemotePath(role) {
    let p = path.join(__dirname, '/../common/remote/', role);
    return fs.existsSync(p) ? p : null;
}
exports.getSysRemotePath = getSysRemotePath;
/**
 * Get user remote service path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
function getUserRemotePath(appBase, serverType) {
    let p = path.join(appBase, '/app/servers/', serverType, Constants.DIR.REMOTE);
    return fs.existsSync(p) ? p : null;
}
exports.getUserRemotePath = getUserRemotePath;
/**
 * Get user remote cron path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
function getCronPath(appBase, serverType) {
    let p = path.join(appBase, '/app/servers/', serverType, Constants.DIR.CRON);
    return fs.existsSync(p) ? p : null;
}
exports.getCronPath = getCronPath;
/**
 * List all the subdirectory names of user remote directory
 * which hold the codes for all the server types.
 *
 * @param  {String} appBase application base path
 * @return {Array}         all the subdiretory name under servers/
 */
function listUserRemoteDir(appBase) {
    let base = path.join(appBase, '/app/servers/');
    let files = fs.readdirSync(base);
    return files.filter(function (fn) {
        if (fn.charAt(0) === '.') {
            return false;
        }
        return fs.statSync(path.join(base, fn)).isDirectory();
    });
}
exports.listUserRemoteDir = listUserRemoteDir;
/**
 * Compose remote path record
 *
 * @param  {String} namespace  remote path namespace, such as: 'sys', 'user'
 * @param  {String} serverType
 * @param  {String} path       remote service source path
 * @return {Object}            remote path record
 */
function remotePathRecord(namespace, serverType, path) {
    return { namespace: namespace, serverType: serverType, path: path };
}
exports.remotePathRecord = remotePathRecord;
/**
 * Get handler path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
function getHandlerPath(appBase, serverType) {
    let p = path.join(appBase, '/app/servers/', serverType, Constants.DIR.HANDLER);
    return fs.existsSync(p) ? p : null;
}
exports.getHandlerPath = getHandlerPath;
/**
 * Get admin script root path.
 *
 * @param  {String} appBase application base path
 * @return {String}         script path string
 */
function getScriptPath(appBase) {
    return path.join(appBase, Constants.DIR.SCRIPT);
}
exports.getScriptPath = getScriptPath;
/**
 * Get logs path.
 *
 * @param  {String} appBase application base path
 * @return {String}         logs path string
 */
function getLogPath(appBase) {
    return path.join(appBase, Constants.DIR.LOG);
}
exports.getLogPath = getLogPath;
function getPluginRemotePath(basePath) {
    let p = path.join(basePath, constants_1.DIR.REMOTE);
    return fs.existsSync(p) ? p : null;
}
exports.getPluginRemotePath = getPluginRemotePath;
function getPluginHandlerPath(basePath) {
    let p = path.join(basePath, constants_1.DIR.HANDLER);
    return fs.existsSync(p) ? p : null;
}
exports.getPluginHandlerPath = getPluginHandlerPath;
function getPluginCronPath(basePath) {
    let p = path.join(basePath, constants_1.DIR.CRON);
    return fs.existsSync(p) ? p : null;
}
exports.getPluginCronPath = getPluginCronPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aFV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvdXRpbC9wYXRoVXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IseUNBQXlDO0FBRXpDLDJDQUFrQztBQUVsQzs7Ozs7R0FLRztBQUNILFNBQWdCLGdCQUFnQixDQUFDLElBQVk7SUFDekMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekQsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN2QyxDQUFDO0FBSEQsNENBR0M7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxPQUFlLEVBQUUsVUFBa0I7SUFDakUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlFLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDdkMsQ0FBQztBQUhELDhDQUdDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLE9BQWUsRUFBRSxVQUFrQjtJQUMzRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUUsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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