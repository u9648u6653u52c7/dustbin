/**
 * 倒计时类库
 * @class Countdown
 */
export default class Countdown {

    /**
     * Creates an instance of Countdown.
     * @param {Number} ms
     * @param {Function} fn
     * @param {[Number]} delay
     * @memberof Countdown
     */
    constructor(ms, fn, delay, offset) {
        this.ms = typeof ms === "number" ? ms : 0;
        this.fn = typeof fn === "function" ? fn : function () { };
        this.delay = typeof delay === "number" ? delay : 1000;
        this.offset = typeof offset === "number" ? offset : 10000;
    }

    /**
     * start
     * @memberof Countdown
     */
    start() {
        var that = this;
        var count = 0;
        var walk = function () {
            count++;
            var now = +new Date();
            var offset = now - (that.stime + count * that.delay);
            if (offset > that.offset) {
                var count2 = Math.floor(offset / that.delay);
                count += count2;
                that.ms -= (count2 * that.delay);
            }

            var nextTime = that.delay - offset;
            if (nextTime < 0) {
                nextTime = 0
            }
            that.fn.call(that, Countdown.format(that.ms));
            that.ms -= that.delay;

            if (that.ms < 0) {
                that.stop();
            } else {
                that.timer = setTimeout(walk, nextTime);
            }
        };

        if (this.ms >= 0) {
            this.stime = +new Date();
            this.timer = setTimeout(walk, this.delay);
        }
        return this;
    }

    /**
     * stop
     * @memberof Countdown
     */
    stop() {
        this.timer && clearTimeout(this.timer);
        return this;
    }

    /**
     * format 时间格式化
     * @param {Number} 秒
     * @returns {Object}
     */
    static format(ms) {
        var s = ms && typeof ms === "number" ? ms / 1000 : 0;
        s = s >= 0 ? s : 0;
        return {
            d: Math.floor(s / 86400),
            h: Math.floor(s % 86400 / 3600),
            m: Math.floor(s % 86400 % 3600 / 60),
            s: s % 86400 % 3600 % 60
        };
    }
}
