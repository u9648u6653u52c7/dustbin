import React from "react";

const rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60); };

/**
 * @class AutoScroll
 * @extends {React.Component}
 * @description 
 * <AutoScroll
 *  direction={"up"|"down"|"left"|"right"}
 *  step={number}
 *  n={number}
 *  attrs={{[key: string]: any}}
 * />
 */
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.$wrap = React.createRef();

        this.timer = null;
        this.counter = 0;

        this.keys = (direction => {
            const arr = [
                ["offsetHeight", "scrollHeight", "scrollTop"],
                ["offsetWidth", "scrollWidth", "scrollLeft"]
            ];

            const obj = {
                up: [...arr[0], "+"],
                down: [...arr[0], "-"],
                left: [...arr[1], "+"],
                right: [...arr[1], "-"]
            };

            return obj[
                obj.hasOwnProperty(direction)
                    ? direction
                    : "left"
            ];
        })(props.direction);

        this.move = (() => {
            const keys = this.keys;
            const { step = 1 } = this.props;

            return ({
                "+": () => {
                    const { current: $wrap } = this.$wrap;
                    if (this.counter >= this.maxVal) {
                        this.counter = this.cutVal;
                    } else {
                        this.counter += step;
                        $wrap[keys[2]] = this.counter;
                    }
                },
                "-": () => {
                    const { current: $wrap } = this.$wrap;
                    if (this.counter <= this.minVal) {
                        this.counter = this.cutVal
                    } else {
                        this.counter -= step;
                        $wrap[keys[2]] = this.counter
                    }
                }
            })[keys[3]];
        })();
    }

    calc() {
        const keys = this.keys;
        const { current: $wrap } = this.$wrap;
        this.wrapSize = $wrap[keys[0]];
        this.scrollSize = $wrap[keys[1]];
        this.cutVal = this.scrollSize / 2;
        this.maxVal = this.scrollSize - this.wrapSize;
        this.minVal = 0;
    }

    animate() {
        if (this.timer) {
            rAF(() => this.animate());
        }
        this.calc();
        this.move();
    }

    start() { 
        this.timer = true;
        this.animate();
    }

    stop() {
        this.timer = false;
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount() {
        this.stop();
    }

    render() {
        const { children, attrs = {}, n = 2 } = this.props;

        const elems = ((n) => {
            const arr = [];
            for (let i = 0; i < n; i++) {
                arr.push(children);
            }
            return arr;
        })(n);

        return (
            <div {...attrs} ref={this.$wrap}>
                {elems}
            </div>
        );
    }
}
