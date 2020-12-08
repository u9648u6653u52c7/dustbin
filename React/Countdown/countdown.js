/**
 * 倒计时类库
 * @class Countdown
 */
function noop() { }

function isNumber(v) {
    return !isNaN(v) && typeof v === "number";
}

function isFuntion(v) {
    return typeof v === "function";
}

export default class Countdown {

    /**
     * Creates an instance of Countdown.
     * @param {Number} ms
     * @param {Function} onTick
     * @param {Function} onStop
     * @param {Function} onOver
     * @param {[Number]} delay
     * @param {[Number]} offset
     * @memberof Countdown
     */
    constructor(ms, onTick, onOver, onStop, delay, offset) {
        this.ms = isNumber(ms) ? ms : 0;
        this.onTick = isFuntion(onTick) ? onTick : noop;
        this.onOver = isFuntion(onOver) ? onOver : noop;
        this.onStop = isFuntion(onStop) ? onStop : noop;
        this.delay = isNumber(delay) ? delay : 1e3;
        this.offset = isNumber(offset) ? offset : 1e4;
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
            that.onTick(Countdown.format(that.ms));
            that.ms -= that.delay;

            if (that.ms < 0) {
                that.stop();
                that.onOver();
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
        clearTimeout(this.timer);
        this.onStop();
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
            s: Math.floor(s % 86400 % 3600 % 60),
            __s: s
        };
    }
}
