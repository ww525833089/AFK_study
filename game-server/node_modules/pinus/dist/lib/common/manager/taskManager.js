"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let sequeue = require('seq-queue');
let queues = {};
exports.timeout = 3000;
/**
 * Add tasks into task group. Create the task group if it dose not exist.
 *
 * @param {String}   key       task key
 * @param {Function} fn        task callback
 * @param {Function} ontimeout task timeout callback
 * @param {Number}   timeout   timeout for task
 */
function addTask(key, fn, ontimeout, timeoutMs) {
    let queue = queues[key];
    if (!queue) {
        queue = sequeue.createQueue(exports.timeout);
        queues[key] = queue;
    }
    return queue.push(fn, ontimeout, timeoutMs);
}
exports.addTask = addTask;
/**
 * Destroy task group
 *
 * @param  {String} key   task key
 * @param  {Boolean} force whether close task group directly
 */
function closeQueue(key, force) {
    if (!queues[key]) {
        // ignore illeagle key
        return;
    }
    queues[key].close(force);
    queues[key] = undefined;
}
exports.closeQueue = closeQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFza01hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29tbW9uL21hbmFnZXIvdGFza01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFhbkMsSUFBSSxNQUFNLEdBQTZCLEVBQUUsQ0FBQztBQUUvQixRQUFBLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFFMUI7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxHQUFXLEVBQUUsRUFBNkIsRUFBRSxTQUFxQixFQUFFLFNBQWlCO0lBQ3hHLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsS0FBSyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBTyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUN2QjtJQUVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFSRCwwQkFRQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLEdBQVcsRUFBRSxLQUFjO0lBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDZCxzQkFBc0I7UUFDdEIsT0FBTztLQUNWO0lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBQzVCLENBQUM7QUFSRCxnQ0FRQyJ9