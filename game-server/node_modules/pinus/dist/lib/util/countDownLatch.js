"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Count down to zero or timeout and invoke cb finally.
 */
class CountDownLatch {
    constructor(count, opts, cb) {
        this.count = count;
        this.cb = cb;
        let self = this;
        if (opts.timeout) {
            this.timerId = setTimeout(function () {
                self.cb(true);
            }, opts.timeout);
        }
    }
    /**
     * Call when a task finish to count down.
     *
     * @api public
     */
    done() {
        if (this.count <= 0) {
            throw new Error('illegal state.');
        }
        this.count--;
        if (this.count === 0) {
            if (this.timerId) {
                clearTimeout(this.timerId);
            }
            this.cb();
        }
    }
}
exports.CountDownLatch = CountDownLatch;
function createCountDownLatch(count, opts, cb) {
    if (!count || count <= 0) {
        throw new Error('count should be positive.');
    }
    if (!cb && typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    if (typeof cb !== 'function') {
        throw new Error('cb should be a function.');
    }
    return new CountDownLatch(count, opts, cb);
}
exports.createCountDownLatch = createCountDownLatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnREb3duTGF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvdXRpbC9jb3VudERvd25MYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBSXZCLFlBQVksS0FBYSxFQUFFLElBQTJCLEVBQUUsRUFBMEI7UUFDOUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSTtRQUNBLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM5QjtZQUNELElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUNiO0lBQ0wsQ0FBQztDQUNKO0FBakNELHdDQWlDQztBQWFELFNBQWdCLG9CQUFvQixDQUFDLEtBQWEsRUFBRSxJQUFzRCxFQUFFLEVBQTRCO0lBQ3RJLElBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtRQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FDOUM7SUFFRCxJQUFJLENBQUMsRUFBRSxJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVUsRUFBRTtRQUNyQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ1YsSUFBSSxHQUFHLEVBQUUsQ0FBQztLQUNYO0lBRUQsSUFBRyxPQUFPLEVBQUUsS0FBSyxVQUFVLEVBQUU7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0tBQzdDO0lBRUQsT0FBTyxJQUFJLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBNkIsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBZkQsb0RBZUMifQ==